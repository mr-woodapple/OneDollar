using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using OneDollar.Api.Context;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers;

public class TagController(OneDollarContext oneDollarContext) : ODataController
{
	[EnableQuery]
	public async Task<ActionResult<IEnumerable<Tag>>> Get()
	{
		return Ok(oneDollarContext.Tag.ToAsyncEnumerable());
	}

	public async Task<ActionResult> Post([FromBody] Tag tag)
	{
		if (tag == null) { return BadRequest(); }

		try
		{
			await oneDollarContext.Tag.AddAsync(tag);
			await oneDollarContext.SaveChangesAsync();

			return Ok(tag);
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}

	/// <summary>
	/// Handles (partially) updating an existing tag.
	/// </summary>
	/// <param name="key">Id of the tag to update.</param>
	/// <param name="delta">The partial content to update the tag with.</param>
	/// <returns>The updated tag.</returns>
	[EnableQuery]
	public async Task<ActionResult> Patch([FromRoute] int key, [FromBody] Delta<Tag> delta)
	{
		var tag = oneDollarContext.Tag.SingleOrDefault(t => t.TagId == key);
		if (tag == null) { return NotFound(); }

		try
		{
			delta.Patch(tag);
			await oneDollarContext.SaveChangesAsync();

			return Ok(oneDollarContext.Tag.Single(t => t.TagId == key));
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
			var tag = oneDollarContext.Tag.SingleOrDefault(t => t.TagId == key);

			if (tag == null)
				return NotFound();

			oneDollarContext.Tag.Remove(tag);
			await oneDollarContext.SaveChangesAsync();

			return NoContent();
		}
		catch (Exception ex)
		{
			return Problem(ex.Message);
		}
	}
}
