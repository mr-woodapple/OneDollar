namespace OneDollar.Api.Models;

public class Transaction
{
    public int TransactionId { get; set; }
    public DateTime Timestamp {  get; set; }
    public float Amount { get; set; }
    public string Currency { get; set; } = "EUR";
    public string? Note { get; set; }

    // Foreign Keys
    public int AccountId { get; set; }
    public int CategoryId { get; set; }

    // Navigation Properties
    public Account? Account { get; set; }
    public Category? Category { get; set; }
}
