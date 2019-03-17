
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
    public class AccountController : Controller
    {
        private AppDbContext context = null;
        public AccountController() 
        {
            context = new AppDbContext();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id) 
        {
            var account = await context.Accounts.FindAsync(id);
            return Ok(account);
        }

        public async Task<IActionResult> GetAll()
        {
            var accounts = await context.Accounts
                .OrderBy(a=>a.AccountName)
                .ToListAsync();
            
            return Ok(accounts);
        }


        
        [HttpGet("{id}")]
        public async Task<IActionResult> IsUsed(Guid id)
        {
            bool isUsed = false;

            var expenses = await context.Expenses.Where(e=>e.AccountId == id).ToListAsync();
            if (expenses.Count > 0) {
                isUsed = true;
            }

            return Ok(isUsed);
        }


        [HttpPost]
        public async Task<IActionResult> Save([FromBody]Account account)
        {
            account.ID = Guid.NewGuid();
            context.Add(account);    

            var result = await context.SaveChangesAsync();
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody]Account account)
        {
            context.Update(account);
            var result = await context.SaveChangesAsync();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {   
            var account = await context.Accounts.FindAsync(id);
            context.Remove(account);
            var result = await context.SaveChangesAsync();

            return Ok(result);
        }
  
    }
}