using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace one_dollar.AspNetCoreBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddBalanceToAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Balance",
                table: "Account",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Balance",
                table: "Account");
        }
    }
}
