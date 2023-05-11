const express = require('express');

const { getCheckoutById, createCheckout, updateCheckout, getAllCheckouts, deleteCheckout } = require('../controllers/CheckoutController');

let app = express(); 

app.get('/checkouts', getAllCheckouts);
app.get('/checkout/:id', getCheckoutById);
app.post('/checkout', createCheckout);
app.put('/checkout/:id', updateCheckout);
app.delete('/checkout/:id', deleteCheckout);

module.exports = app;