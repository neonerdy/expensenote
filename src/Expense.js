

import React, {Component} from 'react';
import axios from 'axios';
import {Input,Button, Card,Row, Collection, CollectionItem} from 'react-materialize';
import config from './Config';
import moment from 'moment';
import {Link} from 'react-router-dom';

export class Expense extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            initialExpenses: [],
            expenses: []
        }
    }

    componentDidMount() {
        this.getAllExpenses();
     }
 
     getAllExpenses = () => {
         axios.get(config.apiUrl +  "/api/expense/getall").then(response => {
             this.setState({
                 initialExpenses: response.data,
                 expenses: response.data
              })
         })
     }

 
     renderIcon = (expense) => {

        console.log(expense.amount);

        if (expense.amount > expense.categoryBudget) {

            let overBudget =  expense.amount - expense.categoryBudget;
            let tooltipText = "Budgeted : " + expense.categoryBudget + ", Over Spent : " + overBudget;

            return(
                <a href="#" data-toggle="tooltip" title={tooltipText}>
                    <i class="material-icons circle red">date_range</i>
                </a>     
            )
        } 
        else 
        {
            return(
                <a href="#">
                    <i class="material-icons circle green">date_range</i>
                </a>
            )
        }
    }

    addExpense = () => {
        this.props.history.push("/add-expense");
    }

    editExpense = (id) => {
        this.props.history.push("/edit-expense/" + id);
    }


    onSearchChange = (e) => {

        let filteredExpense = this.state.initialExpenses.filter(expense => expense.categoryName.toLowerCase()
            .includes(e.target.value.toLowerCase()) || 
             expense.date.includes(e.target.value) ||
             expense.accountName.toLowerCase().includes(e.target.value.toLowerCase()) ||
             expense.categoryGroup.toLowerCase().includes(e.target.value.toLowerCase()));
             
        if (e.target.value == '')
        {
            this.setState( {
                expenses: this.state.initialExpenses
            })
        }
        else {
            this.setState( {
                expenses: filteredExpense
            })
    
        }
        
    }
   

    render() {

        let totalExpense = 0;
        this.state.expenses.forEach(expense=> 
            totalExpense += expense.amount
        )

        totalExpense = totalExpense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


        return(
            <div>
            <div class="container">
            <Card>
              <span class="card-title">View <b>{this.state.expenses.length}</b> Expenses, total amount :  <b>{totalExpense}</b> </span>
              <br/>
              <Button waves="light" onClick={this.addExpense}>ADD EXPENSE</Button>
              <Input placeholder="Search Expenses" onChange={this.onSearchChange}/>
              
              {this.state.expenses.length > 0 ?
                <Collection>
                    {this.state.expenses.map(e=>
                    <CollectionItem className="avatar collection-item" key={e.id} onClick={()=>this.editExpense(e.id)}>
                        {this.renderIcon(e)}
                        {e.categoryName} From {e.accountName}
                        <span class="secondary-content">{e.amount}</span>
                        <div>{e.categoryGroup}</div>
                        <div>{moment(e.date).format("MM/DD/YYYY")}</div>
                    </CollectionItem>
                    )}
                </Collection>
            : (
               <Collection>
                    <CollectionItem>There is no expense yet</CollectionItem>
               </Collection>     
              )
            }
           
            </Card>
      
          </div>
            
        </div>

        )
    }
}