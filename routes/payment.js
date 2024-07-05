const express = require('express');

const { createPayment, getAllPaymentsBySale, summaryPaymentsBySession } = require('../controllers/PaymentsController');

let app = express(); 

app.get('/payments/:saleId', getAllPaymentsBySale);
app.post('/payment', createPayment);
app.get('/payments/summary/:checkout_session_id', summaryPaymentsBySession);


module.exports = app;