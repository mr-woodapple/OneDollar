namespace OneDollar.Api.Models;

/// <summary>
/// Base model used by various models.
/// </summary>
public class OneDollarBase
{
	/// <summary>
	/// Gets or sets a value indicating whether the entity is marked as deleted.
	/// </summary>
	public bool Deleted { get; set; }

	/// <summary>
	/// Gets or sets the timestamp when the entity was created.
	/// </summary>
	public DateTimeOffset CreatedAt { get; set; }

	/// <summary>
	/// Gets or sets the timestamp when the entity was last modified.
	/// </summary>
	public DateTimeOffset? ModifiedAt { get; set; }

	/// <summary>
	/// Gets or sets the timestamp when the entity was deleted.
	/// </summary>
	public DateTimeOffset? DeletedAt { get; set; }
}
