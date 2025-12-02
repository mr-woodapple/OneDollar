using Microsoft.EntityFrameworkCore;
using OneDollar.Api.Context;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure database connection
builder.Services.AddDbContext<OneDollarContext>(
	options => options.UseSqlServer(builder.Configuration.GetConnectionString("DatabaseConnection")));

// Configuring CORS (only for local development)
#if DEBUG
builder.Services.AddCors(options =>
{
	options.AddPolicy("OneDollarFrontend", policy =>
	{
		policy.WithOrigins(builder.Configuration.GetValue<string>("FrontendUrl"))
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials();
	});
});
#endif

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.MapOpenApi();
	app.UseCors("OneDollarFrontend");
}

app.UsePathBase(new PathString("/api"));
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
	Console.WriteLine("Applying migrations...");
	Console.WriteLine($"Connection string used: {builder.Configuration.GetConnectionString("DatabaseConnection")}");
	var db = scope.ServiceProvider.GetRequiredService<OneDollarContext>();
	db.Database.Migrate();
}

app.Run();
