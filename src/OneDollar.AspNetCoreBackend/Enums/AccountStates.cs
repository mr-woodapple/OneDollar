using System.Runtime.Serialization;

namespace OneDollar.Api.Enums;

public enum AccountStates
{
	/// <summary>
	/// Used by LunchFlow if the account needs to be re-authenticated.
	/// </summary>
	[EnumMember(Value = "Disconnected")]
	DISCONNECTED,

	/// <summary>
	/// All good, nothing to do with this one.
	/// </summary>
	[EnumMember(Value = "Active")]
	ACTIVE
}
