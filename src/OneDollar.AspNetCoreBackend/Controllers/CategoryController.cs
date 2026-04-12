using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
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

	/// <summary>
	/// Handles (partially) updating an existing category.
	/// </summary>
	/// <param name="key">Id of the category to update.</param>
	/// <param name="delta">The partial content to update the category with.</param>
	/// <returns>The updated category.</returns>
	[EnableQuery]
	public async Task<ActionResult> Patch([FromRoute] int key, [FromBody] Delta<Category> delta)
	{
		var category = oneDollarContext.Category.SingleOrDefault(c => c.CategoryId == key);
		if (category == null) { return NotFound(); }

		try
		{
			delta.Patch(category);
			await oneDollarContext.SaveChangesAsync();

			return Ok(oneDollarContext.Category.Single(c => c.CategoryId == key));
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
