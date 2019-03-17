
import React, {Component} from 'react';
import axios from 'axios';
import {Card, Row,Input,Button, Modal} from 'react-materialize';
import config from './Config';
import moment from 'moment';
import $ from 'jquery';

export class EditExpense extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            accounts: [],
            id: '',
            categoryId: '',
            accountId: '',
            date: '',
            description: '',
            amount: 0,
            currentAmount: 0,
            error: {}
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

    getExpenseById = (id) => {
        axios.get(config.apiUrl + "/api/expense/getbyid/" + id).then(response=> {
            this.setState({
                id: response.data.id,
                categoryId: response.data.categoryId,
                accountId: response.data.accountId,
                date: moment(response.data.date).format("D MMMM, YYYY"),
                description: response.data.description,
                amount: response.data.amount,
                currentAmount: response.data.amount,
            })
        })
    }

    
    getCategories = () => {
        axios.get(config.apiUrl + "/api/category/getall").then(response=> {
            this.setState({
                categories: response.data
            })
        })
    }
    
    getAccounts = () => {
        axios.get(config.apiUrl + "/api/account/getall").then(response=> {
            this.setState({
                accounts: response.data
            })
        })
    }

    validate = () => {

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
        if (this.state.date == '') {
            error.date = 'Date is required';
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

   
        let expense = {
            id: this.state.id,
            categoryId: this.state.categoryId,
            accountId: this.state.accountId,
            date: moment(this.state.date).format("MM/DD/YYYY"),
            description: this.state.description,
            amount: this.state.amount,
            currentAmount: this.state.currentAmount
        }

        console.log(expense);

        let isValid = this.validate();
        if (isValid) {
            axios.put(config.apiUrl + "/api/expense/update", expense).then(response=> {
                this.props.history.push("/expense");            
            })
        }
    }


    deleteExpense = () => {
        
        var isDelete = window.confirm("Are you sure want to delete this expense?");
        if (isDelete) 
        {
            axios.delete(config.apiUrl + "/api/expense/delete/" + this.props.match.params.id).then(response => {
                this.props.history.push("/expense");
            })
            
        } 
    }

    

    render() {

        let errStyle = {
            color: 'darkred'
        }

        return(
            <div class="container">

            <Card>
              <span class="card-title">Edit Expense</span>
              <br/>
              <Row>
               <input type="hidden" value={this.state.id}/>
               <div style={errStyle}>{this.state.error.categoryId}</div>
               <label>CATEGORY</label>
               <Input type='select' s={12} name="categoryId"
                onChange={this.onValueChange} value={this.state.categoryId}>
                  <option disabled selected>Select Category</option>
                  {this.state.categories.map(cat=> 
                    <option value={cat.id}>{cat.categoryName}</option>
                    )}
                </Input>
              </Row>
              <Row>
               <div style={errStyle}>{this.state.error.accountId}</div>
               <label>FROM ACCOUNT</label>
               <Input type='select' s={12} name="accountId"
                onChange={this.onValueChange} value={this.state.accountId}>
               <option disabled selected>Select Account</option>
                  {this.state.accounts.map(acc=> 
                    <option value={acc.id}>{acc.accountName}</option>
                    )}
                  </Input>
              </Row>
              <Row>
                <div style={errStyle}>{this.state.error.date}</div>
                <label>DATE</label>
                <Input s={12} type='date' name="date"  
                    onChange={this.onValueChange} value={this.state.date}/>
             </Row>
             <Row>
                <div style={errStyle}>{this.state.error.amount}</div>
                <label>AMOUNT</label>
                <Input s={12} type='number' name="amount" onChange={this.onValueChange} value={this.state.amount}/>
                <input type="hidden" name="currentAmount" value={this.state.currentAmount}/>
             </Row>
             <Row>
                 <label>DESCRIPTION</label>
                 <Input s={12} onChange={this.onValueChange} name="description" value={this.state.description}/>
             </Row>
             
              
              <br/>
                <Button waves="light" onClick={this.updateExpense}>UPDATE</Button>&nbsp;&nbsp;&nbsp;
                <Button className="btn waves-effect waves-light red lighten-2" 
                   onClick={this.deleteExpense}>DELETE</Button>
                
           
            </Card>


            </div>
        )
    }
}
 