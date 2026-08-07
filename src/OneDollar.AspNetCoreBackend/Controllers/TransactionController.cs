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

		var validationError = GetValidationError(transaction);
		if (validationError != null) { return BadRequest(validationError); }

		try
		{
			// Resolve tags to existing entities to avoid creating duplicates
			transaction.Tags = await ResolveTagsAsync(transaction.Tags);

			oneDollarContext.Transaction.Add(transaction);

			await ApplyBalanceImpactAsync(TransactionBalanceState.From(transaction), 1);

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
			var originalState = TransactionBalanceState.From(transaction);

			// Capture incoming tags before patching so we can replace the
			// navigation collection with existing entities.
			ICollection<Tag>? incomingTags = null;
			var tagsChanged = delta.TryGetPropertyValue("Tags", out var tagsValue);
			if (tagsChanged && tagsValue is IEnumerable<Tag> tags)
			{
				incomingTags = tags.ToList();
			}

			delta.Patch(transaction);

			var validationError = GetValidationError(transaction);
			if (validationError != null) { return BadRequest(validationError); }

			if (tagsChanged)
			{
				transaction.Tags = await ResolveTagsAsync(incomingTags);
			}

			await ApplyBalanceImpactAsync(originalState, -1);
			await ApplyBalanceImpactAsync(TransactionBalanceState.From(transaction), 1);

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

			await ApplyBalanceImpactAsync(TransactionBalanceState.From(transaction), -1);

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

	private static string? GetValidationError(Transaction transaction)
	{
		if (!transaction.IsTransfer)
		{
			return transaction.DestinationAccountId == null && transaction.DestinationAccount == null
				? null
				: "Only transfers can have a destination account.";
		}

		if (transaction.DestinationAccountId == null)
		{
			return "A transfer requires a destination account.";
		}

		if (transaction.DestinationAccountId == transaction.AccountId)
		{
			return "The source and destination accounts must be different.";
		}

		if (transaction.Amount <= 0)
		{
			return "A transfer amount must be greater than zero.";
		}

		return transaction.CategoryId == null && transaction.Category == null
			? null
			: "Transfers cannot have a category.";
	}

	private async Task ApplyBalanceImpactAsync(TransactionBalanceState transaction, int direction)
	{
		var balanceChanges = new Dictionary<int, float>();

		static void AddChange(IDictionary<int, float> changes, int accountId, float amount)
		{
			changes.TryGetValue(accountId, out var currentAmount);
			changes[accountId] = currentAmount + amount;
		}

		if (transaction.IsTransfer)
		{
			AddChange(balanceChanges, transaction.AccountId, -transaction.Amount * direction);
			AddChange(balanceChanges, transaction.DestinationAccountId!.Value, transaction.Amount * direction);
		}
		else
		{
			AddChange(balanceChanges, transaction.AccountId, transaction.Amount * direction);
		}

		var accountIds = balanceChanges.Keys.ToList();
		var accounts = await oneDollarContext.Account
			.Where(account => accountIds.Contains(account.AccountId))
			.ToDictionaryAsync(account => account.AccountId);

		if (accounts.Count != accountIds.Count)
		{
			throw new InvalidOperationException("One or more linked accounts do not exist.");
		}

		foreach (var (accountId, balanceChange) in balanceChanges)
		{
			accounts[accountId].Balance += balanceChange;
		}
	}

	private readonly record struct TransactionBalanceState(
		int AccountId,
		int? DestinationAccountId,
		float Amount,
		bool IsTransfer)
	{
		public static TransactionBalanceState From(Transaction transaction) =>
			new(
				transaction.AccountId,
				transaction.DestinationAccountId,
				transaction.Amount,
				transaction.IsTransfer);
	}
}
