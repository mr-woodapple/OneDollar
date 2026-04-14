using System.Text.Json.Serialization;
using OneDollar.Api.Enums;

namespace OneDollar.Api.Models.DTOs;

public record struct LunchFlowAccountsDTO
(
	IEnumerable<LunchFlowAccount> Accounts,
	int Total
);

public record struct LunchFlowAccount
(
	int Id,
	string Institution_logo,
	string Institution_name,
	string Name,
	string Provider,
	string Currency,

	[property: JsonConverter(typeof(JsonStringEnumConverter))]
	AccountStates Status
);
