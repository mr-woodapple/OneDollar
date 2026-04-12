using System.ComponentModel.DataAnnotations;

namespace OneDollar.Api.Models;

/// <summary>
/// Base model to be shared by all providers.
/// </summary>
public class ProviderBaseModel
{
	/// <summary>
	/// Gets or sets the unique id for the provider.
	/// </summary>
	[Key]
	public int ProviderId { get; set; }

	/// <summary>
	/// Gets or sets the human friendly name for the provider.
	/// </summary>
	required public string ProviderName { get; set; }

	/// <summary>
	/// Gets or sets the timestamp of the most recent sync, or null if the operation has not been executed.
	/// </summary>
	public DateTimeOffset? LastSyncTimestamp { get; set; }
}
