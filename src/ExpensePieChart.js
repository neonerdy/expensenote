
import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {Card} from 'react-materialize';
import axios from 'axios';
import config from './Config';


export class ExpensePieChart extends Component 
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

    getMonthlyExpenses = () => {
       
        axios.get(config.apiUrl + "/api/expense/getmonthly").then(response=> {
            
            let totalExpenses = 0;

            for(let i=0;i<response.data.length;i++) {
                totalExpenses += response.data[i].amount;
            }

            let expenses=[];

            for(let i=0;i<response.data.length;i++) {
            
                let percentage = (response.data[i].amount/totalExpenses) * 100;
                let expense = {};

                //expense.categoryName = response.data[i].categoryName + ' (' + percentage.toFixed(0) + ' %)';
                expense.categoryName = response.data[i].categoryName;
                expense.amount = response.data[i].amount;
                
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

            graphColors.push(graphBackground);
        }

        this.setState({
            expenseColor: graphColors
        })
        
    }


    expenseTabClick =() => {
        this.setState({
            title: 'Expenses'
        })
    }



    render() {

        let totalAmount = 0;
        for(let i=0; i< this.state.expenseData.length; i++) {
            totalAmount += this.state.expenseData[i].amount;
        }

        totalAmount = totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        const data = {
            labels: this.state.expenseData.map(expense=>expense.categoryName),
            datasets: [{
                data: this.state.expenseData.map(expense=>expense.amount),
                backgroundColor: this.state.expenseColor,
               
            }]
        };

        return(
            <div className="container">
                <Card>
                   <span class="card-title">View <b>{this.state.expenseData.length}</b> Expenses, total amount :  <b>{totalAmount}</b> </span>
                   <br/><br/>
         
                   <div id="expense">
                        <Doughnut data={data}  onElementsClick={elems => {
                             if (elems[0] != undefined)
                            {
                                this.props.history.push("/chart-bar/" + encodeURI(elems[0]._model.label) + "/" + elems[0]._model.backgroundColor);
                            }
                        }} />

                    </div>


                </Card>
            </div>
        )
    }

} 