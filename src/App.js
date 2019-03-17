import React, { Component } from 'react';

import {Route} from 'react-router-dom';
import { Expense } from './Expense';
import { Header } from './Header';
import { Account } from './Account';
import { Category } from './Category';
import { AddExpense } from './AddExpense';
import { AddCategory } from './AddCategory';
import { AddAccount } from './AddAccount';
import { ExpensePieChart } from './ExpensePieChart';
import { ExpenseBarChart } from './ExpenseBarChart';
import { EditAccount } from './EditAccount';
import { EditCategory } from './EditCategory';
import { EditExpense } from './EditExpense';

class App extends Component {
 
 
  render() {

    return (
      <div className="app">
         <Header/>
         <Route exact path="/" component={Expense}/>
         <Route path="/expense" component={Expense}/>
         <Route path="/account" component={Account}/>
         <Route path="/category" component={Category}/>
         <Route path="/chart" component={ExpensePieChart}/>
         <Route path="/chart-bar/:expense/:rgb" component={ExpenseBarChart}/>
         <Route path="/add-expense" component={AddExpense}/>
         <Route path="/add-account" component={AddAccount}/>
         <Route path="/add-category" component={AddCategory}/>
         <Route path="/edit-account/:id" component={EditAccount}/>
         <Route path="/edit-category/:id" component={EditCategory}/>
         <Route path="/edit-expense/:id" component={EditExpense}/>
         
     </div>
  );



  }
}

export default App;
