import React, {Component} from 'react';
import axios from 'axios';
import {Card, Button,Form} from 'react-bootstrap';
import {Header} from './Header';
import config from './Config';


export class AddCategory extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            error: {},
            groups : ['Bills','Car','Debt/Payable','Education','Entertaintment','Food',
                      'Gadget','Groceries','Hobbies','Household','Health Care','Insurance',
                      'Personal Care','Pets','Shopping','Social','Sport and Recreation',
                      'Tax','Transportation','Utilities','Vacation','Other'],
            categoryName: '',
            group: '',
            monthlyBudget: ''   
        }
    }

    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    validateCategory = () => {

        let isValid = true;
        let error = {};

        if (this.state.categoryName == '') {
            error.categoryName = 'Category name is required';
            isValid = false;
        }
        if (this.state.group == '') {
            error.group = 'Group is required';
            isValid = false;
        } 
      
        this.setState({
            error: error 
        })

        return isValid;

    }


    saveCategory = () => {

        let category = {
            categoryName: this.state.categoryName,
            group: this.state.group,
            monthlyBudget: this.state.monthlyBudget
        }

        let isValid = this.validateCategory();
        if (isValid) {
            axios.post(config.apiUrl + "/category/save", category).then(response => {
                this.props.history.push("/category");  
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

                         <h3><small>Add Category</small></h3>
                        <br/><br/>

                        <Form.Group controlId="formExpense">

                            <Form.Label>Category Name</Form.Label>
                            <Form.Control type="text" name="categoryName" onChange={this.onValueChange}/>
                            <div style={errStyle}>{this.state.error.categoryName}</div>
                            <br/>
                            
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" value={this.state.group} name="group" onChange={this.onValueChange}>
                                <option value="" selected>Please Select</option>
                                {this.state.groups.map(g=> 
                                    <option value={g} selected>{g}</option>
                                )}
                            </Form.Control>
                            <div style={errStyle}>{this.state.error.group}</div>
                            <br/>

                            <Form.Label>Monthly Budget</Form.Label>
                            <Form.Control type="text" name="monthlyBudget" onChange={this.onValueChange}/>
                            <div style={errStyle}>{this.state.error.monthlyBudget}</div>

                            <br/>

                        </Form.Group>     

                        <br/><br/>
                        <Button variant="primary" onClick={this.saveCategory}>Save Category</Button>
                   
                    </Card.Body>
                </Card>
        
           </div>

            </div>    
        )
    }

}