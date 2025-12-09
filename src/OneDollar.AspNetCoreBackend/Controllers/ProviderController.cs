using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Context;
using OneDollar.Api.Models.DTOs;
using OneDollar.Api.Models;
using OneDollar.Api.Models.Provider;

namespace OneDollar.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProviderController : ControllerBase
{
	private protected OneDollarContext _context;
	private protected HttpClient _lunchFlowHttpClient;

	public ProviderController(OneDollarContext oneDollarContext)
	{
		_context = oneDollarContext;

		_lunchFlowHttpClient = new HttpClient();
		var config = _context.LunchFlowProvider.FirstOrDefault(); // FIXME:
		if (config != null && !string.IsNullOrEmpty(config.LunchFlowApiKey))
		{
			_lunchFlowHttpClient.DefaultRequestHeaders.Add("x-api-key", config.LunchFlowApiKey);
		}
	}

	// TODO: Can this be more generic? Like have one "PostConfig" endpoint for all providers?
	[HttpPost(Name = "PostLunchFlowConfig")]
	public async Task<ActionResult> PostLunchFlowConfig([FromBody] LunchFlowProviderModel config)
	{
		_context.LunchFlowProvider.Add(config);
		await _context.SaveChangesAsync();

		return Ok();
	}

	[HttpPost("sync", Name = "PostSyncData")]
	public async Task<ActionResult> PostSyncData()
	{
		// Get accounts
		var accountsRequests = new HttpRequestMessage
		{
			Method = HttpMethod.Get,
			// TODO: Use the stored base address from the database
			RequestUri = new Uri("https://www.lunchflow.app/api/v1/accounts"),
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

		// Get balance for each account
		foreach (var acc in lunchFlowAccounts.Accounts)
		{
			var accountToBeUpdated = await _context.Account.SingleAsync(a => a.ExternalAccountId == acc.Id);

			var balanceRequest = new HttpRequestMessage
			{
				Method = HttpMethod.Get,
				RequestUri = new Uri($"https://www.lunchflow.app/api/v1/accounts/{acc.Id}/balance")
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


		// Get transactions
		foreach (var acc in lunchFlowAccounts.Accounts)
		{
			// Find the account saved to the database, because the transaction needs to have the 
			// account id linked, not the external account id that would be in the DTO we iterate over here
			var accInDb = await _context.Account.SingleAsync(a => a.ExternalAccountId == acc.Id);
			if (accInDb == null) { continue; }

			var transactionRequest = new HttpRequestMessage
			{
				Method = HttpMethod.Get,
				RequestUri = new Uri($"https://www.lunchflow.app/api/v1/accounts/{acc.Id}/transactions")
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
		
		return Ok();
	}
}
