
import React, {Component} from 'react';
import axios from 'axios';
import {Input,Button, Card,Row, Collection, CollectionItem} from 'react-materialize';
import config from './Config';

export class Category extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            initialCategories: [],
            categories: []
        }
    }

    componentDidMount() {
        this.getAllCategories();
    }

    renderIcon = (category) => {
        if (category.budget > 0) 
        {
            return(
                <i class="material-icons circle grey darken-1">bookmark_border</i>
            )
        } 
    }

    getAllCategories = () => {
        axios.get(config.apiUrl + "/api/category/getall").then(response => {
            this.setState({
                initialCategories: response.data,
                categories: response.data
            })

            console.log(response.data);
        })
    }


    onSearchChange = (e) => {

        let filteredCategory = this.state.initialCategories.filter(category => category.categoryName.toLowerCase()
            .includes(e.target.value.toLowerCase()) || 
            category.group.toLowerCase().includes(e.target.value.toLowerCase()));
             
        if (e.target.value == '')
        {
            this.setState( {
                categories: this.state.initialCategories
            })
        }
        else {
            this.setState( {
                categories: filteredCategory
            })
    
        }
        
    }

    addCategory = () => {
        this.props.history.push("/add-category");
    }

    editCategory = (id) => {
        this.props.history.push("/edit-category/" + id);
    }


    render() {

        let totalBudget = 0;
        this.state.categories.forEach(category=> 
            totalBudget += category.budget
        )

        totalBudget = totalBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


        return(
            <div className="container">
                <Card>
                    <span className="card-title">View <b>{this.state.categories.length}</b> Categeries, total budget :  <b>{totalBudget}</b> </span>
                    <br/>
                    <Button waves="light" onClick={this.addCategory}>ADD CATEGORY</Button>
                    <Input placeholder="Search Category" onChange={this.onSearchChange}/>
                    <Collection>
                    
                    {this.state.categories.map(category => 
                        <CollectionItem className="avatar" key={category.id} onClick={()=>this.editCategory(category.id)}>
                            {this.renderIcon(category)}
                            <span class="secondary-content" >{category.budget}</span>
                            <div class="title">{category.categoryName}</div>
                            <div>{category.group}</div>
                        </CollectionItem>
                    )}
                    
                    </Collection>
                
                </Card>
            </div>
        )
    }
}