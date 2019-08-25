import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {Account} from './Account';
import {Expense} from './Expense';
import {AddExpense} from './AddExpense';
import {Category} from './Category';
import {AddCategory} from './AddCategory';
import {AddAccount} from './AddAccount';
import {EditAccount} from './EditAccount';
import {EditCategory} from './EditCategory';
import {EditExpense} from './EditExpense';
import {Chart} from './Chart';


export default class App extends Component
{
  render()
  {
    return(
      <div>
             <Route exact path="/" component={Expense}/>
             <Route exact path="/expense" component={Expense}/>
             <Route exact path="/account" component={Account}/>
             <Route exact path="/category" component={Category}/>
             <Route exact path="/chart" component={Chart}/>
              <Route exact path="/add-expense" component={AddExpense}/>
             <Route exact path="/add-account" component={AddAccount}/>
             <Route exact path="/add-category" component={AddCategory}/>
             <Route exact path="/edit-account/:id" component={EditAccount}/>
             <Route exact path="/edit-category/:id" component={EditCategory}/>
             <Route exact path="/edit-expense/:id" component={EditExpense}/>
      </div>
    )
  }

}
