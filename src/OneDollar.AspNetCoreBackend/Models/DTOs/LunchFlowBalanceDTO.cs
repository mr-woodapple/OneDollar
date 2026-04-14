namespace OneDollar.Api.Models.DTOs;

public record struct LunchFlowBalanceDTO
(
	LunchFlowBalance Balance
);

public record struct LunchFlowBalance
(
	float Amount,
	string Currency
);
