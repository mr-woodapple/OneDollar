using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Context;
using OneDollar.Api.Models;
using OneDollar.Api.Models.DTOs;
using OneDollar.Api.Models.Provider;

namespace OneDollar.Api.Services;

public class LunchFlowSyncService
{
	// Static ensures the lock is shared across all scopes (Background & API)
	private static readonly SemaphoreSlim _semaphore = new(1, 1);
	private readonly ILogger<LunchFlowSyncService> _logger;
	private protected OneDollarContext _context;
	private protected HttpClient _lunchFlowHttpClient;
	private protected string _baseAddress;
	private protected LunchFlowProviderModel _provider;

	public LunchFlowSyncService(
		OneDollarContext context,
		ILogger<LunchFlowSyncService> logger)
	{
		_logger = logger;
		_context = context;
		_lunchFlowHttpClient = new HttpClient();

		_provider = _context.LunchFlowProvider.FirstOrDefault();
		if (_provider != null && !string.IsNullOrEmpty(_provider.LunchFlowApiKey))
		{
			_lunchFlowHttpClient.DefaultRequestHeaders.Add("x-api-key", _provider.LunchFlowApiKey);
		}

		if (_provider != null && !string.IsNullOrWhiteSpace(_provider.LunchFlowApiUrl))
		{
			_baseAddress = _provider.LunchFlowApiUrl;
		}
	}

	public async Task RunSyncAsync()
	{
		if (!await _semaphore.WaitAsync(0))
		{
			_logger.LogWarning("Syncing LunchFlow skipped: A sync operation is already in progress.");
			return;
		}

		try
		{
			_logger.LogInformation("Starting sync LunchFlow data...");

			var accounts = await SyncAccounts();
			await SyncBalances(accounts);
			await SyncExpenses(accounts);

			// Update sync timestamp
			_provider.LastRunTimestamp = DateTime.Now;
			await _context.SaveChangesAsync();
		}
		catch (Exception ex)
		{
			_logger.LogError(ex, "Error during syncing LunchFlow.");
			throw;
		}
		finally
		{
			_semaphore.Release();
		}
	}

	public async Task<IEnumerable<LunchFlowAccount>> SyncAccounts()
	{
		var accountsRequests = new HttpRequestMessage
		{
			Method = HttpMethod.Get,
			RequestUri = new Uri(string.Concat(_baseAddress, "/accounts")),
		};

		LunchFlowAccountsDTO? lunchFlowAccounts;
		using (var response = await _lunchFlowHttpClient.SendAsync(accountsRequests))
		{
			response.EnsureSuccessStatusCode();
			lunchFlowAccounts = await response.Content.ReadFromJsonAsync<LunchFlowAccountsDTO>();
		}

		// TODO: Make this use SQL transactions
		foreach (var acc in lunchFlowAccounts.Accounts)
		{
			if (!await _context.Account.AnyAsync(a => a.ExternalAccountId == acc.Id))
			{
				var newAcc = new Account { ExternalAccountId = acc.Id, Name = acc.Name };
				_context.Add(newAcc);
			}
		}
		await _context.SaveChangesAsync();

		return lunchFlowAccounts.Accounts;
	}

	private async Task SyncBalances(IEnumerable<LunchFlowAccount> accounts)
	{
		foreach (var acc in accounts)
		{
			var accountToBeUpdated = await _context.Account.SingleAsync(a => a.ExternalAccountId == acc.Id);

			var balanceRequest = new HttpRequestMessage
			{
				Method = HttpMethod.Get,
				RequestUri = new Uri($"{_baseAddress}/accounts/{acc.Id}/balance")
			};

			LunchFlowBalanceDTO balance;
			using (var response = await _lunchFlowHttpClient.SendAsync(balanceRequest))
			{
				response.EnsureSuccessStatusCode();
				balance = await response.Content.ReadFromJsonAsync<LunchFlowBalanceDTO>();
			}

			accountToBeUpdated.Balance = balance.Balance.Amount;
			await _context.SaveChangesAsync();
		}
	}

	public async Task SyncExpenses(IEnumerable<LunchFlowAccount> accounts)
	{
		foreach (var acc in accounts)
		{
			// Find the account saved to the database, because the transaction needs to have the 
			// account id linked, not the external account id that would be in the DTO we iterate over here
			var accInDb = await _context.Account.SingleAsync(a => a.ExternalAccountId == acc.Id);
			if (accInDb == null) { continue; }

			var transactionRequest = new HttpRequestMessage
			{
				Method = HttpMethod.Get,
				RequestUri = new Uri($"{_baseAddress}/accounts/{acc.Id}/transactions")
			};

			LunchFlowTransactionsDTO? lunchFlowTransactions;
			using (var response = await _lunchFlowHttpClient.SendAsync(transactionRequest))
			{
				response.EnsureSuccessStatusCode();
				lunchFlowTransactions = await response.Content.ReadFromJsonAsync<LunchFlowTransactionsDTO>();
			}

			foreach (var transaction in lunchFlowTransactions.Transactions)
			{
				if (!await _context.Transaction.AnyAsync(t => t.ExternalTransactionId == transaction.Id))
				{
					var newTransaction = new Transaction
					{
						ExternalTransactionId = transaction.Id,
						AccountId = accInDb.AccountId,
						Currency = transaction.Currency,
						Timestamp = transaction.Date,
						Note = transaction.Description,
						IsPending = transaction.IsPending,
						Merchant = transaction.Merchant,
						Amount = transaction.Amount
					};
					_context.Add(newTransaction);
				}
				else
				{
					// check if the "is pending" status has changed
					var existingTransaction = await _context.Transaction.SingleAsync(t => t.ExternalTransactionId == transaction.Id);
					existingTransaction.IsPending = transaction.IsPending;
				}
			}

			await _context.SaveChangesAsync();
		}
	}
}
