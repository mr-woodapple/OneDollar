namespace OneDollar.Api.Models;

public class Account
{
	public int AccountId { get; set; }
	public required string Name { get; set; }
	public float Balance { get; set; }
}
