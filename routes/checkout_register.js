const express = require('express');

const { 
    findAllByCheckoutSessionId, 
    checkStartedTransaction, 
    createCheckoutOpen, 
    createInAndOutCash,
    getCheckoutRegisterSummary,
    closeCheckoutRegisterTransaction} = require('../controllers/CheckoutRegisterController');

let app = express(); 

app.get('/checkout_register/:checkoutSessionId', findAllByCheckoutSessionId);
app.get('/checkout_register/summary/:checkoutSessionId', getCheckoutRegisterSummary);
app.get('/checkout_register/check/:checkoutSessionId', checkStartedTransaction);
app.post('/checkout_register/create_checkout_open', createCheckoutOpen);
app.post('/checkout_register/create_cash_transaction', createInAndOutCash);
app.post('/checkout_register/checkout/close', closeCheckoutRegisterTransaction);


module.exports = app;