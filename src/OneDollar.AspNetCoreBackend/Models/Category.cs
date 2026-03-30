namespace OneDollar.Api.Models;

/// <summary>
/// Represents a category with an identifier, name, and optional icon.
/// </summary>
public class Category
{
	public int CategoryId { get; set; }
	public string? Icon { get; set; }
	public required string Name { get; set; }
}
