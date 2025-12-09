using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace one_dollar.AspNetCoreBackend.Migrations
{
    /// <inheritdoc />
    public partial class RefactoredProviderSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LunchFlowIntegration");

            migrationBuilder.CreateTable(
                name: "ProviderBaseModel",
                columns: table => new
                {
                    ProviderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProviderName = table.Column<string>(type: "nvarchar(21)", maxLength: 21, nullable: false),
                    LastRunTimestamp = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LunchFlowApiKey = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LunchFlowApiUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProviderBaseModel", x => x.ProviderId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProviderBaseModel");

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
    }
}
