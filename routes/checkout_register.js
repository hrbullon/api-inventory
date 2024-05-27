const express = require('express');

const { findAllByCheckoutSessionId, checkStartedTransaction } = require('../controllers/CheckoutRegisterController');

let app = express(); 

app.get('/checkout_register/:checkoutSessionId', findAllByCheckoutSessionId);
app.get('/checkout_register/check/:checkoutId', checkStartedTransaction);

module.exports = app;