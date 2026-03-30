using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

public class CategoryController(OneDollarContext oneDollarContext) : ODataController
{
	[EnableQuery]
	public async Task<ActionResult<IEnumerable<Category>>> Get()
	{
		return Ok(oneDollarContext.Category.ToAsyncEnumerable());
	}

	public async Task<ActionResult> Post([FromBody] Category category)
	{
		if (category == null) { return BadRequest(); }

		try
		{
			await oneDollarContext.Category.AddAsync(category);
			await oneDollarContext.SaveChangesAsync();

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
			var category = oneDollarContext.Category.Single(c => c.CategoryId == key);
			oneDollarContext.Category.Remove(category);
			await oneDollarContext.SaveChangesAsync();

			return NoContent();
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}
}
