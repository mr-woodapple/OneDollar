namespace OneDollar.Api.Models.DTOs;

public class LunchFlowAccountsDTO
{
	public IEnumerable<LunchFlowAccountDTO> Accounts { get; set; }
	public int Total {  get; set; }
}

public class LunchFlowAccountDTO
{
	public int Id { get; set; }
	public string Institution_logo { get; set; }
	public string Institution_name { get; set; }
	public string Name { get; set; }
	public string Provider {  get; set; }
	public string Currency {  get; set; }
	public string Status { get; set; }

}
