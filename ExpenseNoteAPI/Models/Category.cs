
using System;
using System.Collections.Generic;

namespace ExpenseNote.Models
{

    public class  Category
    {
        public Guid ID { get; set; }
        public string CategoryName { get; set;}
        public string Group { get; set;}
        public decimal Budget { get; set;}
    }    


}