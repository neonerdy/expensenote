
import React, {Component} from 'react';
import axios from 'axios';
import {Input,Button, Card,Row} from 'react-materialize';
import config from './Config';

export class AddAccount extends Component
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

    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
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


    saveAccount = () => {

        let account = {
            accountName: this.state.accountName,
            type: this.state.type,
            balance: this.state.balance
        }

        console.log(account);

        let isValid = this.validate();
        if (isValid) {
            axios.post(config.apiUrl + "/api/account/save", account).then(response => {
                this.props.history.push("/account");  
            })
        }


    }




    render() {

        let errStyle = {
            color: 'darkred'
        }

        return(
            <div className="container">
                <Card>
                <span className="card-title">Add Account</span>
                    <br/>
                    <Row>
                        <div style={errStyle}>{this.state.error.accountName}</div>
                        <Input s={12} name="accountName" onChange={this.onValueChange} label="ACCOUNT NAME"/>
                    </Row>
                    <Row>
                      <div style={errStyle}>{this.state.error.type}</div>
                        <Input type='select' s={12} name="type" label="TYPE"
                            onChange={this.onValueChange} >
                            <option disabled selected>Select Type</option>
                            {this.state.types.map(type=> 
                                <option key={type} value={type}>{type}</option>    
                            )}
                        </Input>
                    </Row>
                    <Row>
                        <div style={errStyle}>{this.state.error.balance}</div>
                        <Input s={12} type='number' name="balance" onChange={this.onValueChange} label="BALANCE"/>
                    </Row>

                    <br/>
                    <Button waves="light" onClick={this.saveAccount}>SAVE</Button>

                </Card>
            </div>
        )
    }



}