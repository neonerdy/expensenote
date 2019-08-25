import React, {Component} from 'react';
import axios from 'axios';
import {Card} from 'react-bootstrap';
import config from './Config';
import {Header} from './Header';
import {Doughnut} from 'react-chartjs-2';



export class Chart extends Component
{

    constructor(props) {
        super(props);
        this.state = {
            expenseData: [],
            expenseColor: [],
        }
    }

    componentDidMount() {
        this.getMonthlyExpenses();
    }

    getMonthlyExpenses  = () => {
        axios.get(config.apiUrl + '/expense/monthly').then(response => {
           
            let totalExpenses = 0;

            for(let i=0;i<response.data.length;i++) {
                totalExpenses += parseFloat(response.data[i].total);
            }

            let expenses=[];

            for(let i=0;i<response.data.length;i++) {
            
                let percentage = ((response.data[i].total/totalExpenses) * 100).toFixed(0);
                let expense = {};
            
                expense.categoryName = response.data[i].category_name + ' ( ' + percentage + '% )';
                expense.total = parseFloat(response.data[i].total);
                
                expenses.push(expense);
            }
            
            this.setState({
                expenseData: expenses
            })

            this.getRandomColor();

        })       
    }


    getRandomColor = () => {

        let graphColors = [];

        for(let i=0;i<this.state.expenseData.length;i++) {

            let randomR = Math.floor((Math.random() * 255));
            let randomG = Math.floor((Math.random() * 255));
            let randomB = Math.floor((Math.random() * 255));
    
            let graphBackground = "rgb(" 
                    + randomR + ", " 
                    + randomG + ", " 
                    + randomB + ")";
                
            let hue = Math.floor(Math.random() * 360);
            let pastel = 'hsl(' + hue + ', 100%, 80%)';

            graphColors.push(graphBackground);
        }

        this.setState({
            expenseColor: graphColors
        })
        
    }




    render() {

        let totalExpense = 0;
        this.state.expenseData.map(e=> 
            totalExpense += totalExpense + parseFloat(e.total)    
        )

        const data = {
            labels: this.state.expenseData.map(expense=>expense.categoryName),
            datasets: [{
                data: this.state.expenseData.map(expense=>expense.total),
                backgroundColor: this.state.expenseColor,
            }]
        };

        return(
            <div>

                <Header/>
                <br/>
                <div class="col d-flex justify-content-center">
                    <Card style={{ width: '60rem' }}>
                        <Card.Body>

                            <h3><small>View <b>{this.state.expenseData.length}</b> Expenses, total amount : <b>{totalExpense}</b></small></h3>
                            <br/>

                            <div id="expense">
                              <Doughnut data={data}/>
                            </div>

                            
                        </Card.Body>
                    </Card>
            
                </div>

                </div>

        )
    }



}