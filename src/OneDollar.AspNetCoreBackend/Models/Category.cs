namespace OneDollar.Api.Models;

public class Category
{
	public int CategoryId { get; set; }
	public string? Icon { get; set; }
	public required string Name { get; set; }
	public required bool IsExpenseCategory { get; set; }
}
