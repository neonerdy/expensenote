import React, {Component} from 'react';
import axios from 'axios';
import {Card, Button,Form} from 'react-bootstrap';
import {Header} from './Header';
import config from './Config';


export class EditCategory extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            error: {},
            groups : ['Bills','Car','Debt/Payable','Education','Entertaintment','Food',
                      'Gadget','Groceries','Hobbies','Household','Health Care','Insurance',
                      'Personal Care','Pets','Shopping','Social','Sport and Recreation',
                      'Tax','Transportation','Utilities','Vacation','Other'],
            id: '',
            categoryName: '',
            group: '',
            monthlyBudget: 0   
        }
    }

    componentDidMount() {

        let id = this.props.match.params.id;
        this.getCategoryById(id);
    }


    onValueChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getCategoryById = (id) => {
        axios.get(config.apiUrl + '/category/' + id).then(response => {
            this.setState({
                id:response.data.id,
                categoryName: response.data.categoryName,
                group: response.data.group,
                monthlyBudget: response.data.monthlyBudget
            })
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


    updateCategory = () => {

        let category = {
            id: this.state.id,
            categoryName: this.state.categoryName,
            group: this.state.group,
            monthlyBudget: this.state.monthlyBudget
        }

        let isValid = this.validateCategory();
        if (isValid) {
            axios.put(config.apiUrl + "/category/update", category).then(response => {
                this.props.history.push("/category");  
            })
        }

    }

    deleteCategory = () => {

        let id = this.props.match.params.id;
        let isConfirmed = window.confirm("Are you sure want to delete this category?");
        
        if (isConfirmed) {
            axios.delete(config.apiUrl + '/category/delete/' + id).then(response => {
                this.props.history.push('/category');
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

                         <h3><small>Edit Category</small></h3>
                        <br/><br/>

                        <Form.Group controlId="formExpense">

                            <Form.Label>Category Name</Form.Label>
                            <Form.Control type="text" name="categoryName" onChange={this.onValueChange} value={this.state.categoryName}/>
                            <div style={errStyle}>{this.state.error.categoryName}</div>
                            <br/>
                            
                            <Form.Label>Type</Form.Label>
                            <Form.Control as="select" value={this.state.group} name="group" onChange={this.onValueChange} value={this.state.group}>
                                <option value="" selected>Please Select</option>
                                {this.state.groups.map(g=> 
                                    <option value={g} selected>{g}</option>
                                )}
                            </Form.Control>
                            <div style={errStyle}>{this.state.error.group}</div>
                            <br/>

                            <Form.Label>Monthly Budget</Form.Label>
                            <Form.Control type="text" name="monthlyBudget" onChange={this.onValueChange} value={this.state.monthlyBudget}/>
                            <div style={errStyle}>{this.state.error.monthlyBudget}</div>

                            <br/>

                        </Form.Group>     

                        <br/><br/>
                        <Button variant="primary" onClick={this.updateCategory}>Update</Button>&nbsp;
                        <Button variant="danger" onClick={this.deleteCategory}>Delete</Button>
                        
                   
                    </Card.Body>
                </Card>
        
           </div>




            </div>

        )
    }

}