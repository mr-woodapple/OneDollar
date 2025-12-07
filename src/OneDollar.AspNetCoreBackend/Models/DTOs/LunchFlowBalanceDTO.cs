namespace OneDollar.Api.Models.DTOs;

public class LunchFlowBalanceDTO
{
	public required LunchFlowBalance Balance { get; set; }
}

public class LunchFlowBalance
{
	public required float Amount { get; set; }
	public required string Currency { get; set; }
}
