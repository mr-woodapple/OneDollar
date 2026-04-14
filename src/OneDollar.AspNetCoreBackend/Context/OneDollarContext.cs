using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using OneDollar.Api.Models;
using OneDollar.Api.Models.Provider;

namespace OneDollar.Api.Context;

public class OneDollarContext(DbContextOptions<OneDollarContext> options) : DbContext(options)
{
	public DbSet<Transaction> Transaction { get; set; } = default!;
	public DbSet<Category> Category { get; set; } = default!;
	public DbSet<Account> Account { get; set; } = default!;
	public DbSet<LunchFlowProviderModel> LunchFlowProvider { get; set; } = default!;

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		// Making inherited models for provider base work
		modelBuilder.Entity<ProviderBaseModel>()
			.HasDiscriminator<string>("ProviderName")
			.HasValue<LunchFlowProviderModel>("LunchFlow");

		modelBuilder.Entity<Account>()
			.HasQueryFilter(a => !a.Deleted) // Setting global queries to ignore "Deleted = true" data
			.Property(a => a.Status)
			.HasConversion<string>();

		modelBuilder.Entity<Category>().HasQueryFilter(c => !c.Deleted);

		modelBuilder.Entity<Transaction>().HasQueryFilter(t => !t.Deleted);
	}

	/// <summary>
	/// Override SaveChangesAsync to implement soft delete and automatic timestamping.
	/// </summary>
	/// <returns><inheritdoc /></returns>
	public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
	{
		ChangeTracker.DetectChanges();

		var entries = ChangeTracker.Entries().Where(e => e.Entity is OneDollarBase && (
			e.State == EntityState.Added ||
			e.State == EntityState.Modified ||
			e.State == EntityState.Deleted));

		foreach (var entry in entries)
		{
			var entity = (OneDollarBase)entry.Entity;

			switch (entry.State)
			{
				case EntityState.Added:
					entity.CreatedAt = DateTimeOffset.UtcNow;
					entity.Deleted = false;
					break;
				
				case EntityState.Modified:
					entity.ModifiedAt = DateTimeOffset.UtcNow;
					break;
				
				case EntityState.Deleted:
					// Mark as modified instead of deleted
					entry.State = EntityState.Modified;
					entity.DeletedAt = DateTimeOffset.UtcNow;
					entity.Deleted = true;
					break;
				
				default:
					break;
			}
		}

		return await base.SaveChangesAsync(cancellationToken);
	}
}
