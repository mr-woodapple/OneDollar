using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace one_dollar.AspNetCoreBackend.Migrations
{
    /// <inheritdoc />
    public partial class MakeCategoryExpenseAgnostic : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsExpenseCategory",
                table: "Category");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsExpenseCategory",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
