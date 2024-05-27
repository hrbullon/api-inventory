const express = require('express');

const { 
    getAllTransactionBySessionPOS, 
    createTransaction, 
    getTransactionSummary,
    closeCkeckoutTransaction
} = require('../controllers/TransactionsController');

let app = express(); 

app.post('/transaction', createTransaction);
app.post('/transaction/checkout/close', closeCkeckoutTransaction);
app.get('/transactions/:sessionPOS', getAllTransactionBySessionPOS);
app.get('/transaction/summary/:sessionPOS/:date', getTransactionSummary);


module.exports = app;