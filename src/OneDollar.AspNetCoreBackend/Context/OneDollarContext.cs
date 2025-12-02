using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Models;
using OneDollar.Api.Models.Integrations;

namespace OneDollar.Api.Context;

public class OneDollarContext : DbContext
{
	public OneDollarContext(DbContextOptions<OneDollarContext> options) : base(options) { }

	public DbSet<Transaction> Transaction { get; set; } = default!;
	public DbSet<Category> Category { get; set; } = default!;
	public DbSet<Account> Account { get; set; } = default!;
	public DbSet<LunchFlowIntegrationModel> LunchFlowIntegration { get; set;} = default!;
}
