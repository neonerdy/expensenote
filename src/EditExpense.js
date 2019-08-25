import React, {Component} from 'react';
import axios from 'axios';
import {Card,Button,Form} from 'react-bootstrap';
import {Header} from './Header';
import config from './Config';


export class EditExpense extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            error: {},
            categories: [],
            accounts: [],
            categoryId: '',
            accountId: '',
            amount: '',
            currentAmount: '',
            description: ''
        }
    }


    componentDidMount() {
        let id = this.props.match.params.id;
        this.getCategories();
        this.getAccounts();
        this.getExpenseById(id);    
    }


    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
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



    getExpenseById = (id) => {

        axios.get(config.apiUrl + '/expense/' + id).then(response=> {
            this.setState({
                id: response.data.id,
                categoryId: response.data.categoryId,
                accountId: response.data.accountId,
                amount: response.data.amount,
                currentAmount: response.data.amount,
                description: response.data.description
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
            error.amount = 'Amount is required';
            isValid = false;
        }
      
        this.setState({
            error: error 
        })

        return isValid;

    }

    
    updateExpense = () => {

        let isValid = this.validateExpense();
        
        if (isValid) {

            let expense = {
                id: this.state.id,
                categoryId: this.state.categoryId,
                accountId: this.state.accountId,
                amount: this.state.amount,
                currentAmount: this.state.currentAmount,
                description: this.state.description
            }

            axios.put(config.apiUrl + '/expense/update', expense).then(response=> {
                this.props.history.push('/expense');
            })
        }

    }


    deleteExpense = () => {
        
        let isConfirmed = window.confirm("Are you sure want to delete this expense?");
        
        if (isConfirmed) {
            
            let expense = {
                id: this.state.id,
                accountId: this.state.accountId,
                amount: this.state.amount
            }
           
            axios.post(config.apiUrl + '/expense/delete', expense).then(response => {
                this.props.history.push('/expense');
            })
        }
    }



    render() {

        let errStyle = {
            color: 'darkred'
        }

        return(
            <div>

             <Header/>
             <br/>
            
             <div class="col d-flex justify-content-center">
                <Card style={{ width: '60rem' }}>
                    <Card.Body>

                        <h3><small>Edit Expense</small></h3>
                        <br/><br/>

                        <Form.Group controlId="formExpense">

                            <Form.Label>Category Name</Form.Label>
                            <Form.Control as="select" name="categoryId" onChange={this.onValueChange} value={this.state.categoryId}>
                                <option value="" selected>Please Select</option>
                                {this.state.categories.map(c=> 
                                    <option value={c.id}>{c.categoryName}</option>
                                )}
                            </Form.Control>
                            <div style={errStyle}>{this.state.error.categoryId}</div>
                            <br/>

                            <Form.Label>Account Name</Form.Label>
                            <Form.Control as="select" name="accountId" onChange={this.onValueChange} value={this.state.accountId}>
                            <option value="" selected>Please Select</option>
                            {this.state.accounts.map(a=> 
                                <option value={a.id}>{a.accountName}</option>
                            )}
                            </Form.Control>
                            <div style={errStyle}>{this.state.error.accountId}</div>
                       
                            <br/>
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" name="amount" onChange={this.onValueChange} value={this.state.amount}/>
                            <div style={errStyle}>{this.state.error.amount}</div>
                            <br/>

                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" onChange={this.onValueChange} description={this.state.description}/>
                        </Form.Group>     

                        <br/><br/>
                        <Button variant="primary" onClick={this.updateExpense}>Update</Button>&nbsp;
                        <Button variant="danger" onClick={this.deleteExpense}>Delete</Button>&nbsp;
                        
                    
                    </Card.Body>
                </Card>
        
            </div>


            </div>
        )

    }
}