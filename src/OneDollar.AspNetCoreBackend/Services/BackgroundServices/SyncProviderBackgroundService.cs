namespace OneDollar.Api.Services.BackgroundServices;

public class SyncProviderBackgroundService : BackgroundService
{
	private readonly ILogger<SyncProviderBackgroundService> _logger;
	private readonly IServiceScopeFactory _scopeFactory;
	private readonly TimeSpan _taskRunTime = new(0, 0, 0); // Run at 00:00:00 (midnight)

	public SyncProviderBackgroundService(
		IServiceScopeFactory scopeFactory,
		ILogger<SyncProviderBackgroundService> logger)
	{
		_scopeFactory = scopeFactory;
		_logger = logger;
	}

	protected override async Task ExecuteAsync(CancellationToken stoppingToken)
	{
		while (!stoppingToken.IsCancellationRequested)
		{
			// Calculate the delay until the desired run time
			var now = DateTime.Now;
			var nextRunTime = now.Date.AddDays(1).Add(_taskRunTime);

			// If the desired run time has already passed today, schedule for tomorrow
			if (nextRunTime <= now)
			{
				nextRunTime = nextRunTime.AddDays(1);
			}

			var delay = nextRunTime - now;

			_logger.LogInformation(
				"Next execution scheduled for: {NextRunTime} (Running in: {Delay})",
				nextRunTime,
				delay);

			// Wait for the scheduled time
			await Task.Delay(delay, stoppingToken);

			// Execute the daily sync
			if (!stoppingToken.IsCancellationRequested)
			{
				using (var scope = _scopeFactory.CreateScope())
				{
					_logger.LogInformation("Daily LunchFlow sync executed at: {Now}", DateTime.Now);

					// Resolve the scoped service within this block
					var syncService = scope.ServiceProvider.GetRequiredService<LunchFlowSyncService>();
					await syncService.RunSyncAsync();

					_logger.LogInformation("Daily LunchFlow finished at: {Now}", DateTime.Now);
				}
			}
		}

		_logger.LogInformation("Daily Task Service stopping.");
	}
}
