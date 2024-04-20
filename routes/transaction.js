const express = require('express');

const { 
    getAllTransactionBySessionPOS, 
    createTransaction, 
    checkStartedTransaction,  
    getTransactionSummary,
    closeCkeckoutTransaction
} = require('../controllers/TransactionsController');

let app = express(); 

app.post('/transaction', createTransaction);
app.post('/transaction/sessionPOS/close', closeCkeckoutTransaction);
app.get('/transactions/:sessionPOS', getAllTransactionBySessionPOS);
app.get('/transaction/check/:checkoutId', checkStartedTransaction);
app.get('/transaction/summary/:sessionPOS/:date', getTransactionSummary);


module.exports = app;