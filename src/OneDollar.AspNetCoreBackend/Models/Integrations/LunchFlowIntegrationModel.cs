using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OneDollar.Api.Models.Integrations;

/// <summary>
/// Holds the information provided by the LunchFlow Api.
/// See more: https://www.lunchflow.app/
/// </summary>
public class LunchFlowIntegrationModel
{
	[Key]
	[JsonIgnore]
	public int LunchFlowIntegrationId { get; set; }

	public string? LunchFlowApiKey { get; set; }
	public string? LunchFlowApiUrl { get; set; }
}
