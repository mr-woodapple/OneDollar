using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Context;
using OneDollar.Api.Models.DTOs;
using OneDollar.Api.Models.Provider;
using OneDollar.Api.Enums;
using OneDollar.Api.Services;

namespace OneDollar.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class ProviderController(OneDollarContext oneDollarContext, LunchFlowSyncService lunchFlowSyncService) : ControllerBase
{
	private protected OneDollarContext _context = oneDollarContext;
	private readonly LunchFlowSyncService _lunchFlowSyncService = lunchFlowSyncService;

	[HttpPost("{provider}", Name = "PostProviderConfig")]
	public async Task<ActionResult> PostProviderConfig([FromRoute] string provider, [FromBody] ProviderConfigDTO providerConfig)
	{
		switch (provider)
		{
			case nameof(ProviderEnum.LunchFlow):
				var config = new LunchFlowProviderModel()
				{
					ProviderName = ProviderEnum.LunchFlow.ToString(),
					LunchFlowApiKey = providerConfig.LunchFlowApiKey,
					LunchFlowApiUrl = providerConfig.LunchFlowApiUrl
				};
				_context.LunchFlowProvider.Add(config);
				await _context.SaveChangesAsync();
				return Ok(config);

			default:
				return BadRequest($"No provider found for given name '{provider}'");
		}
	}

	[HttpGet("{provider}", Name = "GetProviderConfig")]
	public async Task<ActionResult> GetProviderConfig([FromRoute] string provider)
	{
		switch (provider)
		{
			case nameof(ProviderEnum.LunchFlow):
				var config = await _context.LunchFlowProvider.FirstOrDefaultAsync();
				return Ok(config);

			default:
				return NotFound();
		}
	}

	[HttpPost("{provider}/sync", Name = "PostSyncData")]
	public async Task<ActionResult> PostSyncData([FromRoute] string provider)
	{
		switch (provider)
		{
			case nameof(ProviderEnum.LunchFlow):
				try
				{
					await _lunchFlowSyncService.RunSyncAsync();
					return NoContent();
				}
				catch (Exception ex)
				{
					return BadRequest(ex.Message);
				}
				

			default:
				return NotFound($"No provider found for '{provider}'.");
		}
	}
}
