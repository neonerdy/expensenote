import React, {Component} from 'react';
import axios from 'axios';
import {Button,Form,Navbar,Nav,Card,CardColumns,
  Dropdown, Table,ButtonGroup} from 'react-bootstrap';

  import {Header} from './Header';
  import config from './Config';
  
export class Category extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            categories: []
        }
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories = () => {
        axios.get(config.apiUrl + '/category').then(response=> {
            this.setState({
                categories: response.data
            })
        })
    }


    addCategory = () => {
        this.props.history.push('/add-category');
    }

    editCategory = (id) => {
        this.props.history.push('/edit-category/' + id);
    }

    


    render() {

        let totalBudget = 0;
       
        this.state.categories.map(category=> 
            totalBudget += category.monthlyBudget
        )
        
        return(

        <div>
             <Header/>
             <br/>
                <div class="col d-flex justify-content-center">

                <Card style={{ width: '60rem' }}>
                    <Card.Body>
                        <h3><small>View <b>{this.state.categories.length}</b> Categories, total budget : <b>{totalBudget}</b></small></h3>
                        <br/>
                        <Button variant="outline-primary" onClick={this.addCategory}>Add Category</Button>
                        <br/><br/>
                        <CardColumns>

                            {this.state.categories.map(c=> 
                                
                                <Card bg="light" style={{ width: '18rem', cursor: 'pointer' }} onClick={()=>this.editCategory(c.id)}>
                                    <Card.Header>{c.group.toUpperCase()}</Card.Header>
                                    <Card.Body>
                                        <Card.Title>{c.categoryName}</Card.Title>
                                        <Card.Text>
                                            <h1><small>{c.monthlyBudget}</small></h1>
                                            Budget
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
