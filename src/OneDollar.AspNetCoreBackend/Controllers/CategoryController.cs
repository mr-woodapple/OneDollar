using Microsoft.AspNetCore.Mvc;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
	private protected OneDollarContext _context;

	public CategoryController(OneDollarContext oneDollarContext)
	{
		_context = oneDollarContext;
	}

	[HttpGet(Name = "GetCategories")]
	public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
	{
		return Ok(_context.Category.ToAsyncEnumerable());
	}

	[HttpPost(Name = "PostCategory")]
	public async Task<ActionResult> PostCategory([FromBody] Category category)
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

	[HttpDelete("{id}", Name = "DeleteCategory")]
	public async Task<ActionResult> DeleteCategory([FromRoute] int id)
	{
		if (id == null) { return BadRequest(); }

		try
		{
			var category = _context.Category.Single(c => c.CategoryId == id);
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
