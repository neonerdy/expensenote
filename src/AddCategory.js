
import React, {Component} from 'react';
import axios from 'axios';
import {Input,Button, Card,Row} from 'react-materialize';
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
            budget: 0
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
            budget: this.state.budget
        }

        console.log(category);

        let isValid = this.validate();
        if (isValid) {
            axios.post(config.apiUrl + "/api/category/save", category).then(response => {
                this.props.history.push("/category");  
            })
        }


    }

   
    render() {

        let errStyle = {
            color: 'darkred'
        }

        return (
            <div className="container">
                <Card>
                    <span className="card-title">Add Category</span>
                    <br/>
                    <Row>
                        <div style={errStyle}>{this.state.error.categoryName}</div>
                        <Input s={12} name="categoryName" onChange={this.onValueChange} label="CATEGORY NAME"/>
                    </Row>
                    <Row>
                      <div style={errStyle}>{this.state.error.group}</div>
                        <Input type='select' s={12} name="group" label="GROUP"
                            onChange={this.onValueChange} >
                            <option disabled selected>Select Group</option>
                            {this.state.groups.map(group=> 
                                <option key={group} value={group}>{group}</option>    
                            )}
                        </Input>
                    </Row>
                    <Row>
                        <div style={errStyle}>{this.state.error.budget}</div>
                        <Input s={12} type='number' name="budget" onChange={this.onValueChange} label="MONTHLY BUDGET"/>
                    </Row>

                    <br/>
                    <Button waves="light" onClick={this.saveCategory}>SAVE</Button>

                </Card>
            
            
            </div>
        )
    }

}