import React, {Component} from 'react';
import axios from 'axios';
import {Card,Button,Form} from 'react-bootstrap';


import {Header} from './Header';
import config from './Config';


export class AddExpense extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            error: {},
            categories: [],
            accounts: [],
            expenseDate: new Date(),
            categoryId: '',
            accountId: '',
            amount: '',
            description: ''
        }
    }


    componentDidMount() {
        this.getCategories();
        this.getAccounts();
    }
    
    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onDateChange = (date) => {
        this.setState({
            expenseDate: date
        })
    }

    getCategories = () => {
        axios.get(config.apiUrl + '/category').then(response=> {
            this.setState({
                categories: response.data
            })
        })
    }


    getAccounts = () => {
        axios.get(config.apiUrl + '/account').then(response=> {
            this.setState({
                accounts: response.data
            })
        })
    }


    validateExpense = () => {

        let isValid = true;
        let error = {};

        if (this.state.categoryId == '') {
            error.categoryId = 'Category is required';
            isValid = false;
        }
        if (this.state.accountId == '') {
            error.accountId = 'Account is required';
            isValid = false;
        } 

        if (this.state.amount == '') {
            error.amount = 'Balance is required';
            isValid = false;
        }
      
        this.setState({
            error: error 
        })

        return isValid;

    }



    saveExpense = () => {

        let isValid = this.validateExpense();
        
        if (isValid) {

            let expense = {
                categoryId: this.state.categoryId,
                accountId: this.state.accountId,
                amount: this.state.amount,
                description: this.state.description
            }

            axios.post(config.apiUrl + '/expense/save', expense).then(response=> {
                this.props.history.push('/expense');
            })
        }

    }

    

    render()
    {
        return(
            <div>
                <Header/>
                <br/>
            
            <div class="col d-flex justify-content-center">
                <Card style={{ width: '60rem' }}>
                    <Card.Body>

                            <h3><small>Add Expense</small></h3>
                        <br/><br/>

                        <Form.Group controlId="formExpense">

                            <Form.Label>Category Name</Form.Label>
                            <Form.Control as="select" name="categoryId">
                                <option value="" selected>Please Select</option>
                                {this.state.categories.map(c=> 
                                    <option value={c.id}>{c.categoryName}</option>
                                )}
                            </Form.Control>
                            <br/>
                            <Form.Label>Account Name</Form.Label>
                            <Form.Control as="select" name="accountId">
                                <option value="" selected>Please Select</option>
                                {this.state.accounts.map(a=> 
                                    <option value={a.id}>{a.accountName}</option>
                                )}
                                </Form.Control>
                            <br/>
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number"/>
                            <br/>
                            <Form.Label>Notes</Form.Label>
                            <Form.Control type="text"/>
                        </Form.Group>     

                        <br/><br/>
                        <Button variant="primary">Save Expense</Button>
                    
                    </Card.Body>
                </Card>
        
            </div>



            </div>
        )

    }



}
