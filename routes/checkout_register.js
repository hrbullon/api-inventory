const express = require('express');

const { findAllByCheckoutSessionId } = require('../controllers/CheckoutRegisterController');

let app = express(); 

app.get('/checkout_register/:checkoutSessionId', findAllByCheckoutSessionId);

module.exports = app;