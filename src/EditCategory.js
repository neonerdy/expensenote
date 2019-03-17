
import React, {Component} from 'react';
import axios from 'axios';
import {Input,Button, Card,Row} from 'react-materialize';
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
            budget: 0,
            isUsed: false
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
        axios.get(config.apiUrl + "/api/category/getbyid/" + id).then(response=> {
            this.setState({
                id: response.data.id,
                categoryName: response.data.categoryName,
                group: response.data.group,
                budget: response.data.budget
            })
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

    updateCategory = () => {

        let category = {
            id: this.state.id,
            categoryName: this.state.categoryName,
            group: this.state.group,
            budget: this.state.budget
        }

        console.log(category);

        let isValid = this.validate();
        if (isValid) {
            axios.put(config.apiUrl + "/api/category/update", category).then(response => {
                this.props.history.push("/category");  
            })

        }
    }

    deleteIfNotUsed = (id) => {

      
        axios.get(config.apiUrl + "/api/category/isused/" + id).then(response=> {
           if (response.data == true) {
                alert("Can't delete, this category already used by expense");     
           } else {
                axios.delete(config.apiUrl + "/api/category/delete/"  + id).then(response=> {
                    this.props.history.push("/category");
                })      
           }
        })
      

    }


    deleteCategory = () => {

        let id = this.props.match.params.id;
        var isDelete = window.confirm("Are you sure want to delete this category?");
        if (isDelete) 
        {
            this.deleteIfNotUsed(id);
        }
    }

   
    render() {

        let errStyle = {
            color: 'darkred'
        }

        return (
            <div className="container">
                <Card>
                    <span className="card-title">Edit Category</span>
                    <br/>
                    <Row>
                        <div style={errStyle}>{this.state.error.categoryName}</div>
                        <label>CATEGORY NAME</label>
                        <Input s={12} name="categoryName" onChange={this.onValueChange} value={this.state.categoryName}/>
                    </Row>
                    <Row>
                      <div style={errStyle}>{this.state.error.group}</div>
                       <label>GROUP</label>
                        <Input type='select' s={12} name="group"
                            onChange={this.onValueChange}  value={this.state.group}>
                            <option disabled selected>Select Group</option>
                            {this.state.groups.map(group=> 
                                <option value={group}>{group}</option>    
                            )}
                        </Input>
                    </Row>
                    <Row>
                        <div style={errStyle}>{this.state.error.budget}</div>
                        <label>MONTHLY BUDGET</label>
                        <Input s={12} type='number' name="budget" onChange={this.onValueChange} value={this.state.budget}/>
                    </Row>

                    <br/>
                    <Button waves="light" onClick={this.updateCategory}>UPDATE</Button>&nbsp;&nbsp;&nbsp;
                    <Button className="btn waves-effect waves-light red lighten-2" onClick={this.deleteCategory}>DELETE</Button>

                </Card>
            
            
            </div>
        )
    }

}