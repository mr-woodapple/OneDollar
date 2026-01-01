using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

public class TransactionController : ODataController
{
	private protected OneDollarContext _context;

	public TransactionController(OneDollarContext oneDollarContext)
	{
		_context = oneDollarContext;
	}

	[EnableQuery]
	public async Task<ActionResult<IEnumerable<Transaction>>> Get()
	{
		var t = _context.Transaction.ToAsyncEnumerable();

		return Ok(t);
	}

	[EnableQuery]
	public async Task<ActionResult<Transaction>> Post([FromBody] Transaction transaction)
	{
		if (transaction == null) { return BadRequest(); }

		try
		{
			_context.Transaction.Add(transaction);

			// Update the linked accounts balance before saving
			var account = await _context.Account.SingleAsync(a => a.AccountId == transaction.AccountId);
			account.Balance += transaction.Amount;

			await _context.SaveChangesAsync();
			return Ok(transaction);
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}

	[EnableQuery]
	public async Task<ActionResult<Transaction>> Patch([FromRoute] int key, [FromBody] Delta<Transaction> delta)
	{
		var transaction = _context.Transaction.SingleOrDefault(t => t.TransactionId == key);
		if (transaction == null) { return NotFound(); }

		try
		{
			// Check if a transaction for the given id exists
			var existingTransaction = await _context.Transaction.SingleOrDefaultAsync(t => t.TransactionId == key);
			if (existingTransaction == null) { return NotFound(); }

			if (transaction.AccountId == existingTransaction.AccountId)
			{
				// Case 1: Account didn't change
				var account = await _context.Account.SingleAsync(a => a.AccountId == existingTransaction.AccountId);
				account.Balance -= existingTransaction.Amount;
				account.Balance += transaction.Amount;
			}
			else
			{
				// Case 2: Account did change
				var oldAccount = await _context.Account.SingleAsync(a => a.AccountId == existingTransaction.AccountId);
				var newAccount = await _context.Account.SingleAsync(a => a.AccountId == transaction.AccountId);

				oldAccount.Balance -= existingTransaction.Amount;
				newAccount.Balance += transaction.Amount;
			}

			delta.Patch(transaction);
			await _context.SaveChangesAsync();

			return Ok(_context.Transaction.Single(t => t.TransactionId == key));
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}

	public async Task<ActionResult> Delete([FromRoute] int key)
	{
		try
		{
			var transaction = await _context.Transaction.SingleAsync(t => t.TransactionId == key);
			_context.Transaction.Remove(transaction);

			// Update the linked accounts balance before saving
			var account = await _context.Account.SingleAsync(a => a.AccountId == transaction.AccountId);
			account.Balance -= transaction.Amount;

			await _context.SaveChangesAsync();
			return NoContent();
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}
}
