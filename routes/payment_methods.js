const express = require('express');

const { 
    getPaymentMethodById, 
    createPaymentMethod, 
    updatePaymentMethod, 
    getAllPaymentMethods, 
    deletePaymentMethod, 
    } = require('../controllers/PaymentMethodsController');

let app = express(); 

app.get('/payment_methods', getAllPaymentMethods);
app.get('/payment_methods/:id', getPaymentMethodById);
app.post('/payment_methods', createPaymentMethod);
app.put('/payment_methods/:id', updatePaymentMethod);
app.delete('/payment_methods/:id', deletePaymentMethod);

module.exports = app;