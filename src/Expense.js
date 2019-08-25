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
            expenses: []
        }
     
    }

    componentDidMount() {
        this.getExpenses();
    }


    getExpenses =()=> {
        axios.get(config.apiUrl + '/expense').then(response=> {
            this.setState({
                expenses: response.data
            })
            
        })
    }



    addExpense = () => {
        this.props.history.push("/add-expense");
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


    render() {

        let totalExpenses = 0
        this.state.expenses.map(e=> 
            totalExpenses += totalExpenses + e.amount
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
                          
                            <Form.Control type="text" placeholder="Search expense ..."/>
                            
                            <br/>
                            <Button variant="outline-danger" onClick={this.addExpense}>Add Expense</Button> 
                            <br/><br/>

                            <Table  striped>
                            <thead>
                                <tr>
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
                                    <td>{moment(e.date).format('MM/DD/YYYY')}</td>
                                    <td><a href="#">{e.categoryName} from {e.accountName}</a></td>
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