
import React, {Component} from 'react';
import axios from 'axios';
import {Card, Row,Input,Button} from 'react-materialize';
import config from './Config';
import moment from 'moment';



export class AddExpense extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            accounts: [],
            categoryId: '',
            accountId: '',
            date: '',
            description: '',
            amount: 0,
            error: {}
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

   
    saveExpense = () => {

   
        let expense = {
            categoryId: this.state.categoryId,
            accountId: this.state.accountId,
            date: moment(this.state.date).format("MM/DD/YYYY"),
            description: this.state.description,
            amount: this.state.amount
        }

        console.log(expense);


        let isValid = this.validate();
        if (isValid) {
            axios.post(config.apiUrl + "/api/expense/save", expense).then(response=> {
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
              <span class="card-title">Add Expense</span>
              <br/>
              <Row>
               <div style={errStyle}>{this.state.error.categoryId}</div>
               <Input type='select' s={12} label="CATEGORY" name="categoryId"
                onChange={this.onValueChange} >
                  <option disabled selected>Select Category</option>
                  {this.state.categories.map(cat=> 
                    <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                    )}
                </Input>
              </Row>
              <Row>
               <div style={errStyle}>{this.state.error.accountId}</div>
               <Input type='select' s={12} label="FROM ACCOUNT" name="accountId"
                onChange={this.onValueChange}>
               <option disabled selected>Select Account</option>
                  {this.state.accounts.map(acc=> 
                    <option key={acc.id} value={acc.id}>{acc.accountName}</option>
                    )}
                  </Input>
              </Row>
              <Row>
                <div style={errStyle}>{this.state.error.date}</div>
                <Input s={12} type='date' name="date"  
                    onChange={this.onValueChange} label="DATE"/>
             </Row>
             <Row>
                <div style={errStyle}>{this.state.error.amount}</div>
               <Input s={12} type='number' name="amount" onChange={this.onValueChange} label="AMOUNT"/>
             </Row>
             <Row>
                 <Input s={12} onChange={this.onValueChange} name="description" label="DESCRIPION"/>
             </Row>
             
              
              <br/>
                <Button waves="light" onClick={this.saveExpense}>SAVE</Button>
            </Card>


            </div>
        )
    }
}
 