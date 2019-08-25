
const express = require('express');
const app = express();
const cors = require('cors');
const category = require('./category');
const account = require('./account');
const expense = require('./expense');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//account

app.get('/account', (req,res)=> {
    account.getAccounts(req,res);
})

app.get('/account/:id', (req,res)=> {
    account.getAccountById(req,res);
})

app.post('/account/save', (req,res)=> {
    account.saveAccount(req,res);
})

app.put('/account/update', (req,res)=> {
    account.updateAccount(req,res);
})

app.delete('/account/delete/:id', (req,res)=> {
    account.deleteAccount(req,res);
})



//category

app.get('/category', (req,res)=> {
    category.getCategories(req,res);
})

app.get('/category/:id', (req,res) => {
    category.getCategoryById(req,res);
})

app.post('/category/save', (req,res)=> {
    category.saveCategory(req,res);
})

app.put('/category/update', (req,res) => {
    category.updateCategory(req,res);
})

app.delete('/category/delete/:id', (req,res)=> {
    category.deleteCategory(req,res);
})


//expense

app.get('/expense', (req,res)=> {
    expense.getExpenses(req,res);
})

app.get('/expense/:id', (req,res)=> {
    expense.getExpenseById(req,res);
})

app.get('/expense/sum/monthly', (req,res)=> {
    expense.getMonthlyExpense(req,res);
})

app.post('/expense/save', (req,res)=> {
    expense.saveExpense(req,res);
})

app.put('/expense/update', (req,res)=> {
    expense.updateExpense(req,res);
})

app.post('/expense/delete', (req,res)=> {
    expense.deleteExpense(req,res);
})





app.listen(9000,()=> {
    console.log('Server started on 9000 port');
})