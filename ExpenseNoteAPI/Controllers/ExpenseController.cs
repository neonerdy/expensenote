using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using ExpenseNote.Models;

namespace ExpenseNote.Controllers
{
    [Route("api/[controller]/[action]")]
    public class ExpenseController : Controller
    {
        private AppDbContext context;

        public ExpenseController() 
        {
            context = new AppDbContext();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var accounts = await context.Expenses
                .Include(e=>e.Category)
                .Include(e=>e.Account)
                .Where(e=>e.Date.Month == DateTime.Now.Month && e.Date.Year == DateTime.Now.Year)
                .OrderByDescending(e=>e.Date)
                .Select(e=>new {
                    id = e.ID,
                    categoryId =  e.CategoryId,
                    categoryName =  e.Category.CategoryName,
                    categoryGroup =  e.Category.Group,
                    categoryBudget =  e.Category.Budget,
                    accountId =  e.AccountId,
                    accountName =  e.Account.AccountName,
                    date =  e.Date,
                    amount = e.Amount,
                    description = e.Description
                })
                .ToListAsync();

            return Ok(accounts);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
             var account = await context.Expenses
                .Include(e=>e.Category)
                .Include(e=>e.Account)
                .Where(e=>e.Date.Month == DateTime.Now.Month
                    && e.Date.Year == DateTime.Now.Year && e.ID == id)
                .FirstOrDefaultAsync();

            return Ok(account);
        }


        [HttpGet]
        public async Task<IActionResult> GetMonthly()
        {
            var month = DateTime.Now.Month;
            var year = DateTime.Now.Year;

            var expenses = await context.Expenses.Include(e=>e.Category)
                    .Where(e=>e.Date.Month == month && e.Date.Year == year)
                    .GroupBy(e=>e.Category.CategoryName)
                    .Select(g=> new {
                        CategoryName = g.Key,
                        Amount = g.Sum(e=>e.Amount)
                    }).ToListAsync();

            return Ok(expenses);    
        }


        [HttpGet("{categoryName}")]
        public async Task<IActionResult> GetYearly(string categoryName)
        {
            var month = DateTime.Now.Month;
            var year = DateTime.Now.Year;

            var expenses = await context.Expenses.Include(e=>e.Category)
                    .Where(e=>e.Category.CategoryName == categoryName && e.Date.Year == year)
                    .GroupBy(e=>e.Date.Month)
                    .Select(g=> new {
                        Month = g.Key,
                        Amount = g.Sum(e=>e.Amount)
                    }).ToListAsync();

            return Ok(expenses);    
        }
        

        [HttpGet("{categoryName}")]
        public async Task<IActionResult> GetAnnualy(string categoryName)
        {
            var year = DateTime.Now.Year;

            var expenses = await context.Expenses.Include(e=>e.Category)
                    .Where(e=>e.Date.Year == year && e.Category.CategoryName == categoryName)
                    .GroupBy(e=>e.Category.CategoryName)
                    .Select(g=> new {
                        CategoryName = g.Key,
                        Amount = g.Sum(e=>e.Amount)
                    }).ToListAsync();

            return Ok(expenses);    

        }


        [HttpPost]
        public async Task<IActionResult> Save([FromBody]Expense expense)
        {
            expense.ID = Guid.NewGuid();
           
            var account = await context.Accounts.FindAsync(expense.AccountId);
            account.Balance = account.Balance - expense.Amount;
            
            context.Add(expense);
            context.Update(account);

            var result = await context.SaveChangesAsync();

            return Ok(result);
        }


        [HttpPut]
        public async Task<IActionResult> Update([FromBody]Expense expense)
        {
            decimal amountTemp = 0;
            
            var account = await context.Accounts.FindAsync(expense.AccountId);
           
            if (expense.Amount > expense.CurrentAmount) {
                amountTemp = expense.Amount - expense.CurrentAmount;
                account.Balance = account.Balance - amountTemp;
            } else {
                 amountTemp = expense.CurrentAmount - expense.Amount;
                 account.Balance = account.Balance + amountTemp;               
            }
          
            context.Update(expense);
            
            if (expense.Amount != expense.CurrentAmount)
                context.Update(account);

            var result = await context.SaveChangesAsync();
            
            return Ok(result);
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var expense = await context.Expenses.FindAsync(id);
            
            var account = await context.Accounts.FindAsync(expense.AccountId);
            account.Balance = account.Balance + expense.Amount;

            context.Remove(expense);
            context.Update(account);

            var result = await context.SaveChangesAsync();

            return Ok(result);
        }


        

        
    }

}