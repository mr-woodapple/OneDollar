using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Models;
using OneDollar.Api.Models.Provider;

namespace OneDollar.Api.Context;

public class OneDollarContext : DbContext
{
	public DbSet<Transaction> Transaction { get; set; } = default!;
	public DbSet<Category> Category { get; set; } = default!;
	public DbSet<Account> Account { get; set; } = default!;
	public DbSet<LunchFlowProviderModel> LunchFlowProvider { get; set;} = default!;

	public OneDollarContext(DbContextOptions<OneDollarContext> options) : base(options) { }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		// Making inherited models for provider base work
		modelBuilder.Entity<ProviderBaseModel>()
			.HasDiscriminator<string>("ProviderName")
			.HasValue<LunchFlowProviderModel>("LunchFlow");
	}
}
