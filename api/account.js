
const config = require('./config');
const uuid = require('uuid');
const Pool = require('pg').Pool
const pool = new Pool(config);

module.exports = {

    mapAccount : (results,i) => {

        let account = {};

        account.id = results.rows[i].id;
        account.accountName = results.rows[i].account_name;
        account.type = results.rows[i].type;
        account.balance = parseFloat(results.rows[i].balance);
        account.description = results.rows[i].description;
        
        
        return account;
    },

    
    mapAccounts : (results) => {

        let accounts = [];

        for(let i=0; i<results.rowCount; i++) {
            let account = module.exports.mapAccount(results,i);
            accounts.push(account);
        }
        return accounts;
    },


    getAccounts : (req,res) => {

        pool.query('SELECT * FROM accounts ORDER BY type,account_name', (err,results)=> {
            if (err) throw err;
            let accounts = module.exports.mapAccounts(results);
            res.json(accounts);
        })
    },


    getAccountById : (req,res) => {

        let id = req.params.id;

        pool.query('SELECT * FROM accounts WHERE id=$1', [id], (err,results) => {
            if (err) throw err;
            let account = module.exports.mapAccount(results,0);
            res.json(account);
        })
    },


    getAccountBalance : (accountId, callback) => {

        pool.query('SELECT * FROM accounts WHERE id=$1', [accountId], (err,results)=> {
            callback(err,results.rows[0]);
        })

    },

    
    saveAccount : (req,res) => {

        let account = {
            id: uuid.v4(),
            accountName: req.body.accountName,
            type: req.body.type,
            description: req.body.description,
            balance: req.body.balance
        }
        
        let sql = 'INSERT INTO accounts (id,account_name,type,description,balance) VALUES ($1,$2,$3,$4,$5)';
        let values = [account.id,account.accountName,account.type,account.description,account.balance];
        
        pool.query(sql,values, (err,result)=> {
            if (err) throw err;
            res.json(result);
        })
        
    },


    updateAccount : (req,res) => {

        let account = {
            id: req.body.id,
            accountName: req.body.accountName,
            type: req.body.type,
            description: req.body.description,
            balance: req.body.balance
        }

        let sql = 'UPDATE accounts SET account_name=$2,type=$3,description=$4,balance=$5 WHERE id=$1';
        let values = [account.id,account.accountName,account.type,account.description,account.balance];
        
        pool.query(sql,values, (err,result)=> {
            if (err) throw err;
            res.json(result);
        })
    },

    
    updateAccountBalance : (accountId,lastBalance, callback) => {
        pool.query('UPDATE accounts SET balance=$1 WHERE account_id=$2',[accountId,lastBalance], (err,result)=> {
            callback(err,result);
        })
    },


    deleteAccount : (req,res) => {

        let id = req.params.id;
        
        pool.query('DELETE FROM accounts WHERE id=$1', [id], (err,result)=> {
            if (err) throw err;
            res.json(result);
        })
      
    },

   


   



}