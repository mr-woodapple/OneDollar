using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

public class TransactionController(OneDollarContext oneDollarContext) : ODataController
{
	[EnableQuery]
	public async Task<ActionResult<IEnumerable<Transaction>>> Get()
	{
		var t = oneDollarContext.Transaction.ToAsyncEnumerable();

		return Ok(t);
	}

	[EnableQuery]
	public async Task<ActionResult<Transaction>> Post([FromBody] Transaction transaction)
	{
		if (transaction == null) { return BadRequest(); }

		try
		{
			oneDollarContext.Transaction.Add(transaction);

			// Update the linked accounts balance before saving
			var account = await oneDollarContext.Account.SingleAsync(a => a.AccountId == transaction.AccountId);
			account.Balance += transaction.Amount;

			await oneDollarContext.SaveChangesAsync();
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
		var transaction = oneDollarContext.Transaction.SingleOrDefault(t => t.TransactionId == key);
		if (transaction == null) { return NotFound(); }

		try
		{
			// Check if a transaction for the given id exists
			var existingTransaction = await oneDollarContext.Transaction.SingleOrDefaultAsync(t => t.TransactionId == key);
			if (existingTransaction == null) { return NotFound(); }

			if (transaction.AccountId == existingTransaction.AccountId)
			{
				// Case 1: Account didn't change
				var account = await oneDollarContext.Account.SingleAsync(a => a.AccountId == existingTransaction.AccountId);
				account.Balance -= existingTransaction.Amount;
				account.Balance += transaction.Amount;
			}
			else
			{
				// Case 2: Account did change
				var oldAccount = await oneDollarContext.Account.SingleAsync(a => a.AccountId == existingTransaction.AccountId);
				var newAccount = await oneDollarContext.Account.SingleAsync(a => a.AccountId == transaction.AccountId);

				oldAccount.Balance -= existingTransaction.Amount;
				newAccount.Balance += transaction.Amount;
			}

			delta.Patch(transaction);
			await oneDollarContext.SaveChangesAsync();

			return Ok(oneDollarContext.Transaction.Single(t => t.TransactionId == key));
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
			var transaction = await oneDollarContext.Transaction.SingleAsync(t => t.TransactionId == key);
			oneDollarContext.Transaction.Remove(transaction);

			// Update the linked accounts balance before saving
			var account = await oneDollarContext.Account.SingleAsync(a => a.AccountId == transaction.AccountId);
			account.Balance -= transaction.Amount;

			await oneDollarContext.SaveChangesAsync();
			return NoContent();
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}
}
