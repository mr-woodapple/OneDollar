namespace OneDollar.Api.Models;

public class Account
{
	public int AccountId { get; set; }
	public required string Name { get; set; }
	public float Balance { get; set; }

	// Used to store the account id that for example LunchFlow returns for an account
	public int? ExternalAccountId { get; set; }

}
