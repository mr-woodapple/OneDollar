namespace OneDollar.Api.Models.DTOs;

public record struct LunchFlowTransactionsDTO
(
	List<LunchFlowTransaction> Transactions,
	int Total
);

public record struct LunchFlowTransaction
(
	int AccountId,
	float Amount,
	string Currency,
	DateTime Date,
	string Id,
	string? Description,
	bool? IsPending,
	string? Merchant
);
