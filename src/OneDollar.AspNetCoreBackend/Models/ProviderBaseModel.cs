using System.ComponentModel.DataAnnotations;

namespace OneDollar.Api.Models;

public class ProviderBaseModel
{
	[Key]
	public int ProviderId { get; set; }
	required public string ProviderName { get; set; }
	public DateTimeOffset? LastRunTimestamp { get; set; }
}
