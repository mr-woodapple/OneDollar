using System.Runtime.Serialization;

namespace OneDollar.Api.Enums;

/// <summary>
/// Enum of the supported integrations
/// </summary>
public enum Integrations
{
	[EnumMember(Value = "LunchFlow")]
	LunchFlow
}
