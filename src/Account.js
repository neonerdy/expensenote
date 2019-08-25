import React, {Component} from 'react';
import axios from 'axios';
import {Button,Card,CardColumns} from 'react-bootstrap';
import config from './Config';
import {Header} from './Header';



export class Account extends Component
{

  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
    }

  }


  componentDidMount() {
    this.getAccounts();
  }


  getAccounts = () => {
      axios.get(config.apiUrl + '/account').then(response=> {
        this.setState({
          accounts: response.data
        })
      })
  }


  addAccount = () => {
    this.props.history.push('/add-account');
  }


  renderAccount = (type) => {
    if (type === 'Cash') {
      return 'primary'
    } else if (type === 'Bank') {
      return 'info'
    }else if (type === 'Credit Card') {
      return 'danger'
    }

  }


  editAccount = (id) => {
    this.props.history.push('/edit-account/' + id);
  }


  render() {

    let totalBalance = 0;
    this.state.accounts.map(account=> 
        totalBalance += account.balance
    )

    return(
      <div>
        <Header/>
       <br/>
      <div class="col d-flex justify-content-center">

 
      <Card style={{ width: '60rem' }}>
        
        <Card.Body>

          <h3><small>View <b>{this.state.accounts.length}</b> Accounts, total balance : <b>{totalBalance}</b></small></h3>
          <br/>
          <Button variant="outline-success" onClick={this.addAccount}>Add Account</Button>
          <br/><br/> 
        
          <CardColumns>

            {this.state.accounts.map(a=> 

              <Card bg={this.renderAccount(a.type)} text="white" style={{ width: '18rem',  cursor: 'pointer' }} onClick={()=>this.editAccount(a.id)}>
                <Card.Header>{a.type.toUpperCase()}</Card.Header>
                <Card.Body>
                  <Card.Title>{a.accountName}</Card.Title>
                  <Card.Text>
                      <h1><small>{a.balance}</small></h1>
                      Balance
                  </Card.Text>
                </Card.Body>
              </Card>
            )}


  
        </CardColumns>

     </Card.Body>
  </Card>

</div>

      
        

    


       
      </div>
    )
  }


}
