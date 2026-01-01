using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace one_dollar.AspNetCoreBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddLunchFlowIntegration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExternalTransactionId",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPending",
                table: "Transaction",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Merchant",
                table: "Transaction",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExternalAccountId",
                table: "Account",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "LunchFlowIntegration",
                columns: table => new
                {
                    LunchFlowIntegrationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LunchFlowApiKey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LunchFlowApiUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LunchFlowIntegration", x => x.LunchFlowIntegrationId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LunchFlowIntegration");

            migrationBuilder.DropColumn(
                name: "ExternalTransactionId",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "IsPending",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "Merchant",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "ExternalAccountId",
                table: "Account");
        }
    }
}
