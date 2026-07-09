namespace OneDollar.Api.Models;

/// <summary>
/// Represents a tag that can be applied to multiple transactions to track
/// spending across categories.
/// </summary>
public class Tag : OneDollarBase
{
	public int TagId { get; set; }
	public required string Name { get; set; }
	public string? Color { get; set; }

	public ICollection<Transaction>? Transactions { get; set; }
}
