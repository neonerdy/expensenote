
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
    public class CategoryController : Controller
    {
        private AppDbContext context;
        public CategoryController() {
            context = new AppDbContext();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await context.Categories
                .OrderBy(c=>c.CategoryName)
                .ToListAsync();
            
            return Ok(categories);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var category = await context.Categories.FindAsync(id);
            return Ok(category);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> IsUsed(Guid id)
        {
            bool isUsed = false;

            var expenses = await context.Expenses.Where(e=>e.CategoryId == id).ToListAsync();
            if (expenses.Count > 0) {
                isUsed = true;
            }

            return Ok(isUsed);
        }


        [HttpPost]
        public async Task<IActionResult> Save([FromBody]Category category)
        {
            category.ID = Guid.NewGuid();
            context.Add(category);
            var result = await context.SaveChangesAsync();

            return Ok(result);
        }


        [HttpPut]
        public async Task<IActionResult> Update([FromBody]Category category)
        {
            context.Update(category);
            var result = await context.SaveChangesAsync();

            return Ok(result);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var category = await context.Categories.FindAsync(id);
            context.Remove(category);
            var result = await context.SaveChangesAsync();

            return Ok(result);
        }
        
    }








}