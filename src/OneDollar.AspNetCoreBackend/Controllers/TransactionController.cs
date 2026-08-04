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
	public ActionResult<IEnumerable<Transaction>> Get()
	{
		return Ok(oneDollarContext.Transaction);
	}

	[EnableQuery]
	public async Task<ActionResult<Transaction>> Post([FromBody] Transaction transaction)
	{
		if (transaction == null) { return BadRequest(); }

		try
		{
			// Resolve tags to existing entities to avoid creating duplicates
			transaction.Tags = await ResolveTagsAsync(transaction.Tags);

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
		var transaction = await oneDollarContext.Transaction
			.Include(t => t.Tags)
			.SingleOrDefaultAsync(t => t.TransactionId == key);
		if (transaction == null) { return NotFound(); }

		try
		{
			var originalAccountId = transaction.AccountId;
			var originalAmount = transaction.Amount;

			// Capture incoming tags before patching so we can replace the
			// navigation collection with existing entities.
			ICollection<Tag>? incomingTags = null;
			var tagsChanged = delta.TryGetPropertyValue("Tags", out var tagsValue);
			if (tagsChanged && tagsValue is IEnumerable<Tag> tags)
			{
				incomingTags = tags.ToList();
			}

			delta.Patch(transaction);

			if (tagsChanged)
			{
				transaction.Tags = await ResolveTagsAsync(incomingTags);
			}

			if (transaction.AccountId == originalAccountId)
			{
				// Case 1: Account didn't change
				var account = await oneDollarContext.Account.SingleAsync(a => a.AccountId == originalAccountId);
				account.Balance += transaction.Amount - originalAmount;
			}
			else
			{
				// Case 2: Account did change
				var oldAccount = await oneDollarContext.Account.SingleAsync(a => a.AccountId == originalAccountId);
				var newAccount = await oneDollarContext.Account.SingleAsync(a => a.AccountId == transaction.AccountId);

				oldAccount.Balance -= originalAmount;
				newAccount.Balance += transaction.Amount;
			}

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

	/// <summary>
	/// Resolves the supplied tags to tracked entities that already exist in the
	/// database, matching by their id. This prevents duplicate tags from being
	/// created when linking existing tags to a transaction.
	/// </summary>
	/// <param name="tags">The tags supplied in the request payload.</param>
	/// <returns>The existing tag entities, or an empty collection.</returns>
	private async Task<ICollection<Tag>> ResolveTagsAsync(ICollection<Tag>? tags)
	{
		if (tags == null || tags.Count == 0) { return new List<Tag>(); }

		var ids = tags.Select(t => t.TagId).ToList();
		return await oneDollarContext.Tag.Where(t => ids.Contains(t.TagId)).ToListAsync();
	}
}
