using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

public class AccountController : ODataController
{
	private protected OneDollarContext _context;

	public AccountController(OneDollarContext context)
	{
		_context = context;
	}

	[EnableQuery]
	public async Task<ActionResult<IEnumerable<Account>>> Get()
	{
		return Ok(_context.Account.ToAsyncEnumerable());
	}

	public async Task<ActionResult> Post([FromBody] Account account)
	{
		if (account == null) { return BadRequest(); }

		try
		{
			await _context.Account.AddAsync(account);
			await _context.SaveChangesAsync();

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
			var account = _context.Account.Single(c => c.AccountId == key);
			_context.Account.Remove(account);
			await _context.SaveChangesAsync();

			return NoContent();
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}
}
