namespace OneDollar.Api.Models.DTOs;

public class LunchFlowTransactionsDTO
{
	public required List<LunchFlowTransaction> Transactions { get; set; }
	public required int Total {  get; set; }
}

public class LunchFlowTransaction
{
	public required int AccountId { get; set; }
	public required float Amount { get; set; }
	public required string Currency {  get; set; }
	public required DateTime Date { get; set; }
	public required string Id { get; set; }
	public string? Description { get; set; }
	public bool? IsPending { get; set; }
	public string? Merchant {  get; set; }
}
