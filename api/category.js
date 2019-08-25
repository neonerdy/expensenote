
const config = require('./config');
const uuid = require('uuid');
const Pool = require('pg').Pool
const pool = new Pool(config);

module.exports = {

    
    mapCategory : (results, i) => {

        let category = {}

        category.id = results.rows[i].id;
        category.categoryName = results.rows[i].category_name;
        category.group = results.rows[i].group;
        category.monthlyBudget = parseFloat(results.rows[i].monthly_budget);

        return category;

    },

    mapCategories : (results) => {

        let categories = [];

        for(let i=0; i<results.rowCount; i++) {
            let category = module.exports.mapCategory(results,i);
            categories.push(category);
        }
        return categories;

    },


    getCategories : (req,res) => {

        pool.query('SELECT * FROM categories ORDER BY category_name', (err,results)=> {
            if (err) throw err;
            let categories = module.exports.mapCategories(results);
            res.json(categories);
        })

    },

    getCategoryById : (req,res) => {

        let id = req.params.id;

        pool.query('SELECT * FROM categories WHERE id=$1', [id], (err,results)=> {
            if (err) throw err;
            let category = module.exports.mapCategory(results,0);
            res.json(category);
        })

    },


    saveCategory : (req,res) => {

        let category = {
            id: uuid.v4(),
            categoryName: req.body.categoryName,
            group: req.body.group,
            monthlyBudget: req.body.monthlyBudget =='' ? 0 : req.body.monthlyBudget 
        }

        let sql = 'INSERT INTO categories (id,category_name,"group",monthly_budget) VALUES ($1,$2,$3,$4)';
        let values = [category.id,category.categoryName,category.group,category.monthlyBudget];

        pool.query(sql,values, (err,result)=> {
            if (err) throw err;
            res.json(result);
        })
    
    },


    updateCategory : (req,res) => {
      
        let category = {
            id: req.body.id,
            categoryName: req.body.categoryName,
            group: req.body.group,
            monthlyBudget: req.body.monthlyBudget == '' ? 0 : req.body.monthlyBudget 
        }

        console.log(category);

        let sql = 'UPDATE categories SET category_name=$2,"group"=$3,monthly_budget=$4 WHERE id=$1';
        let values = [category.id,category.categoryName,category.group,category.monthlyBudget];

        pool.query(sql,values, (err,result)=> {
            if (err) throw err;
            res.json(result);
        })
    },


    deleteCategory : (req,res) => {

        let id = req.params.id;

        pool.query('DELETE FROM categories WHERE id=$1', [id], (err,result)=> {
            if (err) throw err;
            res.json(result);
        })

    }












}