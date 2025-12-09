using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace OneDollar.Api.Models;

public class ProviderBaseModel
{
	[Key]
	[JsonIgnore]
	required public int ProviderId { get; set; }

	required public string ProviderName { get; set; }
	public DateTimeOffset? LastRunTimestamp { get; set; }

}
