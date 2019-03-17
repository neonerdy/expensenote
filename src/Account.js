
import React, {Component} from 'react';
import axios from 'axios';
import {Input,Button, Card,Row, Collection, CollectionItem} from 'react-materialize';
import config from './Config';


export class Account extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            initialAccounts: [],
            accounts: []
        }
    }

    componentDidMount() {
        this.getAllAccounts();
    }

    getAllAccounts = () => {
        axios.get(config.apiUrl + "/api/account/getall").then(response => {
            this.setState({
                initialAccounts: response.data,
                accounts: response.data
            })

            console.log(response.data);
        })
    }

    onSearchChange = (e) => {

        let filteredAccount = this.state.initialAccounts.filter(account => account.accountName.toLowerCase()
            .includes(e.target.value.toLowerCase()) || 
            account.type.toLowerCase().includes(e.target.value.toLowerCase()));
             
        if (e.target.value == '')
        {
            this.setState( {
                accounts: this.state.initialAccounts
            })
        }
        else {
            this.setState( {
                accounts: filteredAccount
            })
    
        }
        
    }


    renderIcon = (account) => {
        if (account.type =="Cash") {
            return(
                <i className="material-icons circle pink">account_balance_wallet</i>
            )
        } else if (account.type =="Bank") {
            return(
                <i className="material-icons circle  blue lighten-1">account_balance</i>
            )
        } else if (account.type =="Credit Card") {
            return(
                <i className="material-icons circle purple">credit_card</i>
            )
        }
    }

    addAccount = () => {
        this.props.history.push("/add-account");
    }

    editAccount = (id) => {
        this.props.history.push("/edit-account/" + id);
        console.log(id);
       
    }
    

    render() {

        let totalBalance = 0;
        this.state.accounts.forEach(account=> 
            totalBalance += account.balance
        )

        totalBalance = totalBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


        return(
            <div className="container">
                <Card>
                    <span className="card-title">View <b>{this.state.accounts.length}</b> Accounts, total balance :  <b>{totalBalance}</b> </span>
                    <br/>
                    <Button waves="light" onClick={this.addAccount}>ADD ACCOUNT</Button>
                    <Input placeholder="Search Account" onChange={this.onSearchChange}/>
                    
                    <Collection>
                    {this.state.accounts.map(account=>
                        <CollectionItem className="avatar" key={account.id} onClick={()=>this.editAccount(account.id)}>
                            {this.renderIcon(account)}
                            <span className="secondary-content">{account.balance}</span>
                            <div className="title">{account.accountName}</div>
                            <div>{account.type}</div>

                        </CollectionItem>        
                    )}
                    </Collection>


                </Card>
            </div>
        )
    }
}