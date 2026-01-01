using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

public class CategoryController : ODataController
{
	private protected OneDollarContext _context;

	public CategoryController(OneDollarContext oneDollarContext)
	{
		_context = oneDollarContext;
	}

	[EnableQuery]
	public async Task<ActionResult<IEnumerable<Category>>> Get()
	{
		return Ok(_context.Category.ToAsyncEnumerable());
	}

	public async Task<ActionResult> Post([FromBody] Category category)
	{
		if (category == null) { return BadRequest(); }

		try
		{
			await _context.Category.AddAsync(category);
			await _context.SaveChangesAsync();

			return Ok(category);
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
			var category = _context.Category.Single(c => c.CategoryId == key);
			_context.Category.Remove(category);
			await _context.SaveChangesAsync();

			return NoContent();
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}
}
