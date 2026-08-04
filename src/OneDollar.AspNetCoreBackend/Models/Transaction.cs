namespace OneDollar.Api.Models;

/// <summary>
/// Represents an income, expense, or transfer.
/// </summary>
public class Transaction : OneDollarBase
{
	public int TransactionId { get; set; }
	public DateTime Timestamp { get; set; }
	public float Amount { get; set; }
	public string Currency { get; set; } = "EUR";
	public string? Note { get; set; }
	public string? Merchant { get; set; }
	public bool? IsPending { get; set; }
	public bool IsTransfer { get; set; }


	public int AccountId { get; set; }
	public Account? Account { get; set; }

	public int? DestinationAccountId { get; set; }
	public Account? DestinationAccount { get; set; }

	public int? CategoryId { get; set; }
	public Category? Category { get; set; }

	public ICollection<Tag>? Tags { get; set; }


	// Used to store the id that for example LunchFlow returns for a transaction
	public string? ExternalTransactionId { get; set; }
}
