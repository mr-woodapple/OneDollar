using System.Text.Json.Serialization;
using OneDollar.Api.Enums;

namespace OneDollar.Api.Models.DTOs;

public class LunchFlowAccountsDTO
{
	public required IEnumerable<LunchFlowAccount> Accounts { get; set; }
	public required int Total {  get; set; }
}

public class LunchFlowAccount
{
	public required int Id { get; set; }
	public required string Institution_logo { get; set; }
	public required string Institution_name { get; set; }
	public required string Name { get; set; }
	public required string Provider {  get; set; }
	public required string Currency {  get; set; }

	[JsonConverter(typeof(JsonStringEnumConverter))]
	public AccountStates Status { get; set; }

}
