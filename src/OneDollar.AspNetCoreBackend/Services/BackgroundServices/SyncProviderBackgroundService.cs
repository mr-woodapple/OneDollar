namespace OneDollar.Api.Services.BackgroundServices;

public class SyncProviderBackgroundService : BackgroundService
{
	private readonly ILogger<SyncProviderBackgroundService> _logger;
	private readonly TimeSpan _taskRunTime = new(0, 0, 0); // Run at 00:00:00 (midnight)

	public SyncProviderBackgroundService(ILogger<SyncProviderBackgroundService> logger)
	{
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
				"Next execution scheduled for: {NextRunTime} (Delay: {Delay})",
				nextRunTime,
				delay);

			// 2. Wait for the scheduled time
			await Task.Delay(delay, stoppingToken);

			// 3. Execute the daily task
			if (!stoppingToken.IsCancellationRequested)
			{
				// TODO: CAll the actual service
				_logger.LogInformation("Daily ´task executed at: {Now}", DateTime.Now);
			}
		}

		_logger.LogInformation("Daily Task Service stopping.");
	}
}
