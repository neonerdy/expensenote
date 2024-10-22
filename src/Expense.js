import React, {Component} from 'react';
import axios from 'axios';
import {Button,Form,Card, Table,Badge,DropdownButton,Dropdown,ButtonGroup} from 'react-bootstrap';

import { Header } from './Header';
import moment from 'moment';
import config from './Config';

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
        this.getExpenses();
    }


    getExpenses =()=> {
        axios.get(config.apiUrl + '/expense').then(response=> {
            this.setState({
                initialExpenses: response.data,
                expenses: response.data
            })
            
        })
    }



    addExpense = () => {
        this.props.history.push('/add-expense');
    }

    editExpense = (id) => {
        this.props.history.push('/edit-expense/' + id);
    }


    renderOverBudget = (e) => {

        if (e.amount > e.monthlyBudget) {
            return(
                <div>
                    <Badge variant="danger">Over Budget</Badge>&nbsp;
                    <Badge variant="info">+ {e.amount-e.monthlyBudget}</Badge>
                </div>
            )
        }
    }


    onSearchChange = (e) => {

        let filteredExpense = this.state.initialExpenses.filter(expense => expense.categoryName.toLowerCase()
            .includes(e.target.value.toLowerCase()) || 
             expense.date.toLowerCase().includes(e.target.value) ||
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

        let totalExpenses = 0
        this.state.expenses.map(e=> 
            totalExpenses += e.amount
        )

        return(
            <div>
                <Header/>
                <br/>
                <div class="col d-flex justify-content-center">

                    <Card style={{ width: '60rem' }}>
                        <Card.Body>
                            <h3><small>View <b>{this.state.expenses.length}</b> Expenses, total amount : <b>{totalExpenses}</b></small></h3>
                            <br/>
                          
                            <Form.Control type="text" placeholder="Search expense ..." onChange={this.onSearchChange}/>
                            
                            <br/>
                            <Button variant="outline-danger" onClick={this.addExpense}>Add Expense</Button> 
                            <br/><br/>

                            <Table  striped>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th style={{color:'grey'}}>DATE</th>
                                    <th style={{color:'grey'}}>DESCRIPTION</th>
                                    <th style={{color:'grey'}}>AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.expenses.map(e=> 
                                <tr>
                                    <td>{this.renderOverBudget(e)}</td>     
                                    <td>{e.categoryGroup.toUpperCase()}</td>
                                    <td>{e.date}</td>
                                    <td><a href="#!" onClick={()=>this.editExpense(e.id)}>{e.categoryName} from {e.accountName}</a></td>
                                    <td>{e.amount}</td>
                                </tr>
                                )}

                                
                            
                            </tbody>
                            </Table>

                            <br/><br/>


                        </Card.Body> 


                    </Card>


                </div>



            </div>
        )
    }




}