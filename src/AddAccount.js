import React, {Component} from 'react';
import axios from 'axios';
import {Card, Button,Form} from 'react-bootstrap';
import {Header} from './Header';
import config from './Config';


export class AddAccount extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            error: {},
            types: ['Cash','Bank','Credit Card'],
            accountName: '',
            type: '',
            balance: '',
            description:''        
        }
    }


    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    validateAccount = () => {

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

        let isValid = this.validateAccount();

        if (isValid) {

            let account = {
                accountName: this.state.accountName,
                type: this.state.type,
                balance: this.state.balance,
                description: this.state.description
            }

            axios.post(config.apiUrl +  '/account/save', account).then(response=> {
                this.props.history.push('/account');
            })
        }

    }

    render()
    {
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

                         <h3><small>Add Account</small></h3>
                        <br/><br/>

                        <Form.Group controlId="formExpense">

                            <Form.Label>Account Name</Form.Label>
                            <Form.Control type="text" name="accountName" onChange={this.onValueChange}/>
                            <div style={errStyle}>{this.state.error.accountName}</div>
                            <br/>
                            
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" value={this.state.type} name="type" onChange={this.onValueChange}>
                                <option value="" selected>Please Select</option>
                                {this.state.types.map(t=> 
                                    <option value={t} selected>{t}</option>
                                )}
                            </Form.Control>
                            <div style={errStyle}>{this.state.error.type}</div>
                            <br/>

                            <Form.Label>Balance</Form.Label>
                            <Form.Control type="number" name="balance" onChange={this.onValueChange}/>
                            <div style={errStyle}>{this.state.error.balance}</div>
                            <br/>

                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" onChange={this.onValueChange}/>
                            <br/>

                        </Form.Group>     

                        <br/><br/>
                        <Button variant="primary" onClick={this.saveAccount}>Save Account</Button>
                   
                    </Card.Body>
                </Card>
        
           </div>




            </div>
        )
    }


}