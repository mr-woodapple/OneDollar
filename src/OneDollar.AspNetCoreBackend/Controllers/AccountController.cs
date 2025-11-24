using Microsoft.AspNetCore.Mvc;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;


[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private protected OneDollarContext _context;

    public AccountController(OneDollarContext context)
    {
        _context = context; 
    }

    [HttpGet(Name = "GetAccounts")]
    public async Task<ActionResult<IEnumerable<Account>>> GetAccount()
    {
        return Ok(_context.Account.ToAsyncEnumerable());
    }

    [HttpPost(Name = "PostAccount")]
    public async Task<ActionResult> PostAccount([FromBody] Account account)
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

    [HttpDelete("{id}", Name = "DeleteAccount")]
    public async Task<ActionResult> DeleteAccount([FromRoute] int id)
    {
        if (id == null) { return BadRequest(); }

        try
        {
            var account = _context.Account.Single(c => c.AccountId == id);
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
