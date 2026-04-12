using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

public class AccountController(OneDollarContext oneDollarContext) : ODataController
{
	[EnableQuery]
	public async Task<ActionResult<IEnumerable<Account>>> Get()
	{
		return Ok(oneDollarContext.Account.ToAsyncEnumerable().Where(a => !a.Deleted));
	}

	public async Task<ActionResult> Post([FromBody] Account account)
	{
		if (account == null) { return BadRequest(); }

		try
		{
			await oneDollarContext.Account.AddAsync(account);
			await oneDollarContext.SaveChangesAsync();

			return Ok(account);
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}

	public async Task<ActionResult> DeleteAccount([FromRoute] int key)
	{
		try
		{
			var account = oneDollarContext.Account.Single(c => c.AccountId == key);

			if (oneDollarContext.Transaction.Any(t => t.AccountId == account.AccountId))
				return Conflict("The account is still used, please remove all transactions from it first.");

			oneDollarContext.Account.Remove(account);
			await oneDollarContext.SaveChangesAsync();

			return NoContent();
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}
}
