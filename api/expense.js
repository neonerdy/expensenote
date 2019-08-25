
const config = require('./config');
const uuid = require('uuid');
const Pool = require('pg').Pool
const pool = new Pool(config);
const account = require('./account');

module.exports = {


    mapExpense : (results, i)=> {

        let expense = {};

        expense.id = results.rows[i].id;
        expense.date = results.rows[i].date;
        expense.categoryId = results.rows[i].category_id;
        expense.categoryGroup = results.rows[i].category_group;
        expense.categoryName = results.rows[i].category_name;
        expense.monthlyBudget = results.rows[i].monthly_budget;
        expense.accountId = results.rows[i].account_id;
        expense.accountName = results.rows[i].account_name;
        expense.amount = parseFloat(results.rows[i].amount);
        expense.description = results.rows[i].description;
        
        return expense;
    },


    mapExpenses : (results) => {

        let expenses = [];
        for(let i=0;i< results.rowCount; i++) {
            let expense = module.exports.mapExpense(results,i);
            expenses.push(expense);
        }
        return expenses;

    },


    getExpenses : (req,res) => {

        /*
        let filter = {
            month: req.body.month,
            year: req.body.year
        }
        */
        

        /*
        let sql = 'SELECT e.*, c.category_name, a.account_name FROM expenses e INNER JOIN categories c ON e.category_id = e.id '
            + 'INNER JOIN account a ON e.account_id = a.id WHERE EXTRACT(MONTH FROM date)=$1 AND EXTRACT(YEAR FROM date) = $2 '
            + 'ORDER BY date DESC';
        */

       let sql = 'SELECT e.*, c.group AS category_group,c.category_name, a.account_name, c.monthly_budget FROM expenses e INNER JOIN categories c ON e.category_id = c.id '
                + 'INNER JOIN accounts a ON e.account_id = a.id ORDER BY date DESC';
            
        
        //let values = [filter.month,filter.year];


        pool.query(sql, (err,results)=> {
            if (err) throw err;
            let expenses = module.exports.mapExpenses(results);
            res.json(expenses);
        })

    },


    getExpenseById : (req,res) => {

        let id = req.params.id;

        pool.query('SELECT * FROM expenses WHERE id=$1', [id], (err,results)=>{
            if (err) throw err;
            res.json(results.rows[0]);
        })

    },


    getMonthlyExpense : (req,res) => {

        let sql = 'SELECT c.category_name, SUM(e.amount) AS total FROM expenses e INNER JOIN categories '
                + 'c ON e.category_id = c.id GROUP BY c.id ORDER BY c.category_name';
        
                pool.query(sql, (err,results)=>{
            if (err) throw err;
            res.json(results.rows);
        })
    },


    saveExpense : (req,res) => {

        let expense = {
            id: uuid.v4(),
            date: new Date(),
            categoryId: req.body.categoryId,
            accountId: req.body.accountId,
            amount: req.body.amount,
            description: req.body.description
        }

        console.log(expense);

        let sql = 'INSERT INTO expenses (id,date,category_id,account_id,amount,description) VALUES ($1,$2,$3,$4,$5,$6)';
        let values = [expense.id,expense.date,expense.categoryId,expense.accountId,expense.amount,expense.description];

        pool.query(sql,values, (err,result)=> {
            if (err) throw err;

            account.getAccountBalance(expense.accountId, (err,result)=> {
                if (err) throw err;

                console.log("balance=" + result);
                console.log("amount=" + expense.amount);
                

                let accountBalance = parseFloat(result);
                let lastBalance = accountBalance - parseFloat(expense.amount);

                account.updateAccountBalance(expense.accountId, lastBalance, (err,result)=> {
                    if (err) throw err;
                })
           
            })

            res.json(result);
        
        })


    },


    updateExpense : (req,res) => {

        let expense = {
            id: req.body.id,
            date: req.body.date,
            categoryId: req.body.categoryId,
            accountId: req.body.accountId,
            amount: req.body.amount,
            description: req.body.description
        }

        let sql = 'UPDATE expenses SET date=$2,category_id=$3,account_id=$4,amount=$5,description=$6 WHERE id=$1';
        let values = [expense.id,expense.date,expense.categoryId,expense.accountId,expense.amount,expense.description];

        pool.query(sql,values, (err,result)=> {
            if (err) throw err;
            res.json(result);
        })

    },


    deleteExpense : (req,res) => {

        let id = req.params.id;
        let accountId = req.params.accountId;
        let amount = req.params.amount;


        pool.query('DELETE * FROM expenses WHERE id=$id', [id], (err,result)=> {

            account.getAccountBalance(accountId, (err,result)=> {
                if (err) throw err;

                let accountBalance = result;
                let lastBalance = accountBalance + amount;
                
                account.updateAccountBalance(accountId, lastBalance, (err,result)=> {
                    if (err) throw err;
                    res.json(result);
                })

            })

        })

    }





}