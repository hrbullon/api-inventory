const express = require('express');

const { 
    getAllTransactionByCheckout, 
    createTransaction, 
    checkStartedTransaction  
} = require('../controllers/TransactionsController');

let app = express(); 

app.post('/transaction', createTransaction);
app.get('/transactions/:checkoutId', getAllTransactionByCheckout);
app.get('/transaction/check/:checkoutId', checkStartedTransaction);


module.exports = app;