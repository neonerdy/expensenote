

import React, {Component} from 'react';
import axios from 'axios';
import {Input,Button, Card,Row} from 'react-materialize';
import config from './Config';


export class EditAccount extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            error: {},
            types: ['Cash', 'Bank', 'Credit Card'],
            accountName: '',
            type: '',
            balance: 0
        }
    }

    componentDidMount() {
        
        let accountId = this.props.match.params.id;
        this.getAccountById(accountId);
    }


    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getAccountById = (id) => {

        axios.get(config.apiUrl + "/api/account/getbyid/" + id).then(response=> {
            this.setState({
                accountName: response.data.accountName,
                type: response.data.type,
                balance: response.data.balance
            })  

            console.log(this.state.type);
        })

    }

    
    updateAccount = () => {

        let account = {
            id: this.props.match.params.id,
            accountName: this.state.accountName,
            type: this.state.type,
            balance: this.state.balance
        }

        let isValid = this.validate();
        if (isValid) {
            axios.put(config.apiUrl + "/api/account/update",account).then(response => {
                this.props.history.push("/account");  
            })
        }
    }

    deleteIfNotUsed = (id) => {

        axios.get(config.apiUrl + "/api/account/isused/" + id).then(response=> {
           if (response.data == true) {
                alert("Can't delete, this account already used by expense");     
           } else {
                axios.delete(config.apiUrl + "/api/account/delete/" + id).then(response => {
                    this.props.history.push("/account");  
                })   
           }
        })
    }


    deleteAccount = () => {

        let id = this.props.match.params.id;
        var isDelete = window.confirm("Are you sure want to delete this account?");
        
        if (isDelete) 
        {
           this.deleteIfNotUsed(id);
        }

    }


    validate = () => {

        let isValid = true;
        let error = {};

        if (this.state.accountName == '') {
            error.accountName = 'Account name is required';
            isValid = false;
        }
        if (this.state.type == '') {
            error.type = 'Type is required';
            isValid = false;
        } 

        if (this.state.balance == '') {
            error.balance = 'Balance is required';
            isValid = false;
        }
      
        this.setState({
            error: error 
        })

        return isValid;

    }
   
    render() {

        let errStyle = {
            color: 'darkred'
        }

        return(
            <div className="container">
            <Card>
            <span className="card-title">Edit Account</span>
                <br/>
                <Row>
                    <div style={errStyle}>{this.state.error.accountName}</div>
                    <label>ACCOUNT NAME</label>
                    <Input s={12} name="accountName" onChange={this.onValueChange} 
                      value = {this.state.accountName}/>
                </Row>
                <Row>
                <div style={errStyle}>{this.state.error.type}</div>
                     <label>TYPE</label>
                    <Input type='select' s={12} name="type" value={this.state.type} 
                        onChange={this.onValueChange} >
                        <option disabled selected>Select Type</option>
                        {this.state.types.map(t=> 
                            <option key={t} value={t}>{t}</option>    
                        )}
                    </Input>
                </Row>
                <Row>
                    <div style={errStyle}>{this.state.error.balance}</div>
                    <label>BALANCE</label>
                    <Input s={12} type='number' name="balance" onChange={this.onValueChange} 
                        value={this.state.balance}/>
                </Row>

                <br/>
               
                <Button waves="light" onClick={this.updateAccount}>UPDATE</Button>&nbsp;&nbsp;&nbsp;
                <Button className="btn waves-effect waves-light red lighten-2" onClick={this.deleteAccount}>DELETE</Button>

            </Card>
        </div>
        )
    }

}