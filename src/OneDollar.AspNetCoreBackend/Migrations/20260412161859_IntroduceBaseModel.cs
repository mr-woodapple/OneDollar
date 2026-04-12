using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace one_dollar.AspNetCoreBackend.Migrations
{
    /// <inheritdoc />
    public partial class IntroduceBaseModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Transaction",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Transaction",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "Transaction",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ModifiedAt",
                table: "Transaction",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Category",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Category",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "Category",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ModifiedAt",
                table: "Category",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "Account",
                type: "datetimeoffset",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));

            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "Account",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DeletedAt",
                table: "Account",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ModifiedAt",
                table: "Account",
                type: "datetimeoffset",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Category");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "Account");
        }
    }
}
