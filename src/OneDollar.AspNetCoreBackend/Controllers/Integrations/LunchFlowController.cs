using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Context;
using OneDollar.Api.Models.Integrations;
using OneDollar.Api.Models.DTOs;
using OneDollar.Api.Models;

namespace OneDollar.Api.Controllers.Integrations;

[ApiController]
[Route("[controller]")]
public class LunchFlowController : ControllerBase
{
	private protected OneDollarContext _context;
	private protected HttpClient _lunchFlowHttpClient;

	public LunchFlowController(OneDollarContext oneDollarContext)
	{
		_context = oneDollarContext;

		_lunchFlowHttpClient = new HttpClient();
		var config = _context.LunchFlowIntegration.FirstOrDefault();
		if (config != null && !string.IsNullOrEmpty(config.LunchFlowApiKey))
		{
			_lunchFlowHttpClient.DefaultRequestHeaders.Add("x-api-key", config.LunchFlowApiKey);
		}
	}

	[HttpPost(Name = "PostLunchFlowConfig")]
	public async Task<ActionResult> PostLunchFlowConfig([FromBody] LunchFlowIntegrationModel config)
	{
		_context.LunchFlowIntegration.Add(config);
		await _context.SaveChangesAsync();

		return Ok();
	}

	[HttpPost("sync", Name = "PostSyncData")]
	public async Task<ActionResult> PostSyncData()
	{
		// Get accounts
		var request = new HttpRequestMessage
		{
			Method = HttpMethod.Get,
			// TODO: Use the stored base address from the database
			RequestUri = new Uri("https://www.lunchflow.app/api/v1/accounts"),
		};

		LunchFlowAccountsDTO? lunchFlowAccounts;
		using (var response = await _lunchFlowHttpClient.SendAsync(request))
		{
			response.EnsureSuccessStatusCode();
			lunchFlowAccounts = await response.Content.ReadFromJsonAsync<LunchFlowAccountsDTO>();
		}

		foreach(var acc in lunchFlowAccounts.Accounts)
		{
			if (!await _context.Account.AnyAsync(a => a.ExternalAccountId == acc.Id))
			{
				var newAcc = new Account { ExternalAccountId = acc.Id, Name = acc.Name };
				_context.Add(newAcc);
			}
		}
		await _context.SaveChangesAsync();

		// Get transactions
		// TODO:

		return Ok();
	}
}
