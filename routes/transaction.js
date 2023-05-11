const express = require('express');

const { getAllTransactionByCheckout, createTransaction } = require('../controllers/TransactionsController');

let app = express(); 

app.get('/transactions/:checkoutId', getAllTransactionByCheckout);
app.post('/transaction', createTransaction);


module.exports = app;