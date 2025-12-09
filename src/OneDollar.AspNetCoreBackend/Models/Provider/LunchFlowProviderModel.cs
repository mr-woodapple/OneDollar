using OneDollar.Api.Enums;

namespace OneDollar.Api.Models.Provider;

/// <summary>
/// Holds the information provided by the LunchFlow Api.
/// See more: https://www.lunchflow.app/
/// </summary>
public class LunchFlowProviderModel : ProviderBaseModel
{
	public string? LunchFlowApiKey { get; set; }
	public string? LunchFlowApiUrl { get; set; }

	public LunchFlowProviderModel()
	{
		ProviderName = ProviderEnum.LunchFlow.ToString();
	}
}
