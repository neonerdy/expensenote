

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using ExpenseNote.Models;

namespace ExpenseNote
{
    public class AppDbContext : DbContext
    {

        public DbSet<Account> Accounts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Expense> Expenses { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionBuilder)
        {
            optionBuilder.UseNpgsql("host=localhost;database=expensenote;username=postgres;password=postgres");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Account>(entity => 
            {
                entity.ToTable("accounts");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.AccountName).HasColumnName("account_name");
                entity.Property(e => e.Type).HasColumnName("type");
                entity.Property(e => e.Balance).HasColumnName("balance");
                entity.Property(e => e.Description).HasColumnName("description");
            });

            modelBuilder.Entity<Category>(entity => 
            {
                entity.ToTable("categories");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.CategoryName).HasColumnName("category_name");
                entity.Property(e => e.Group).HasColumnName("group");
                entity.Property(e => e.Budget).HasColumnName("monthly_budget");
                
            });

            modelBuilder.Entity<Expense>(entity => 
            {
                entity.ToTable("expenses");
                entity.Property(e => e.ID).HasColumnName("id");
                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.AccountId).HasColumnName("account_id");
                entity.Property(e => e.Date).HasColumnName("date");
                entity.Property(e => e.Amount).HasColumnName("amount");
                entity.Property(e => e.Description).HasColumnName("description");
            });


        }


        
    }
}