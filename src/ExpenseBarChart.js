
import React, {Component} from 'react';
import {Doughnut, Bar} from 'react-chartjs-2';
import {Card} from 'react-materialize';
import axios from 'axios';
import config from './Config';
import {Link} from 'react-router-dom';

export class ExpenseBarChart extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            color: '',
            expenseData: []
        }
    }

    componentDidMount() {
        
        let expense = this.props.match.params.expense;
        let rgb = this.props.match.params.rgb;

        this.getYearlyExpense(expense, rgb);
    
    }

    getMonthInitial = (month) => {
        
        let initial = '';
        switch(month) {
            case 1 :
                initial = 'JAN';
                break;
            case 2 :
                initial = 'FEB';
                break;
            case 3 :
                initial = 'MAR';
                break;
            case 4 :
                initial = 'APR';
                break;
            case 5 :
                initial = 'MAY';
                break;
            case 6 :
                initial = 'JUN';
                break;
            case 7 :
                initial = 'JUL';
                break;
            case 8 :
                initial = 'AUG';
                break;
            case 9 :
                initial = 'SEP';
                break;
            case 10 :
                initial = 'OCT';
                break;
            case 11 :
                initial = 'NOV';
                break;
            case 12 :
                initial = 'DES';
                break;
        }
        return initial;
    }


    getYearlyExpense = (categoryName, rgbColor) => {
               
        
        axios.get(config.apiUrl + "/api/expense/getyearly/" + categoryName).then(response => {
            
            console.log(response.data);

            let yearlyExpenses = [];
            for(let i=0;i<response.data.length;i++) {

                let expense = {};
                expense.label = this.getMonthInitial(response.data[i].month);
                expense.data = response.data[i].amount;

                yearlyExpenses.push(expense);
            }

            console.log(yearlyExpenses);


            this.setState({
                title: categoryName,
                expenseData: yearlyExpenses,
                color: rgbColor
            })        
        
        })
    }


    render() {

        const data = {
            labels: this.state.expenseData.map(expense=>expense.label),
            datasets: [{
                data: this.state.expenseData.map(expense=>expense.data),
                backgroundColor: this.state.color,
            }]
        };

        const option = {
            legend: {
                display: false
            }
        }

        let totalAmount = 0;
        for(let i=0; i< this.state.expenseData.length; i++) {
            totalAmount += this.state.expenseData[i].data;
        }

        totalAmount = totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        
        return (
            <div className="container">
                <Card>

                    <Link to="/chart"><i class="material-icons white">arrow_back</i></Link>   
                    <br/><br/>
                    <span class="card-title">View <b>{this.state.expenseData.length}</b> month {this.state.title} spent, total : <b>{totalAmount}</b></span>
                    <br/><br/>
                    <Bar data={data} options={option}/>
                </Card>

            </div>
        )
    }
}

