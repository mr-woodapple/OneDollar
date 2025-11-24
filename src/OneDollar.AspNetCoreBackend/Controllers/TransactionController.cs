using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class TransactionController : ODataController
{
    private protected OneDollarContext _context;

    public TransactionController(OneDollarContext oneDollarContext)
    {
        _context = oneDollarContext;
    }

    [HttpGet(Name = "GetTransactions")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetAllTransactions()
    {
        var t = _context.Transaction
            .Include(t => t.Category)
            .Include(t => t.Account)
            .ToAsyncEnumerable();

        return Ok(t);
    }

    [HttpPost(Name = "PostTransaction")]
    public async Task<ActionResult<Transaction>> PostTransaction([FromBody] Transaction transaction)
    {
        if (transaction == null) { return BadRequest(); }

        try
        {
            _context.Transaction.Add(transaction);
            var account = await _context.Account.SingleAsync(a => a.AccountId == transaction.AccountId);

            // Update the linked accounts balance before saving
            // account.Balance += transaction.Amount;

            await _context.SaveChangesAsync();

            var t = _context.Transaction
                .Include(t => t.Category)
                .Include(t => t.Account)
                .Single(t => t.TransactionId == transaction.TransactionId);

            return Ok(t);
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }

    [HttpPut("{id}", Name = "PutTransaction")]
    public async Task<ActionResult<Transaction>> PutTransaction([FromRoute] int id, [FromBody] Transaction transaction)
    {
        if (id != transaction.TransactionId)
        {
            return BadRequest("The transaction ID in the URL must match the transaction ID in the body.");
        }

        try
        {
            // Check if a transaction for the given id exists
            var existingTransaction = await _context.Transaction.SingleOrDefaultAsync(t => t.TransactionId == id);
            if (existingTransaction == null) { return NotFound(); }

            _context.Entry(existingTransaction).CurrentValues.SetValues(transaction);
            await _context.SaveChangesAsync();

            var t = _context.Transaction
                .Include(t => t.Category)
                .Include(t => t.Account)
                .Single(t => t.TransactionId == id);

            return Ok(t);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            return Conflict(ex);
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }

    [HttpDelete("{id}", Name = "DeleteTransaction")]
    public async Task<ActionResult> DeleteTransaction([FromRoute] int id)
    {
        try
        {
            var transaction = await _context.Transaction.SingleAsync(t => t.TransactionId == id);
            _context.Transaction.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            return Problem(ex.Message); 
        }
    }
}
