const express = require('express');

const { 
    deleteDiscount, 
    createDiscount, 
    getAllDiscountsBySale, 
    getAllDiscountsByCheckouSession 
} = require('../controllers/DiscountController');

let app = express(); 

app.get('/discounts/:saleId', getAllDiscountsBySale);
app.get('/discounts/session/:checkoutSessionId', getAllDiscountsByCheckouSession);
app.post('/discount', createDiscount);
app.delete('/discount/:id', deleteDiscount);

module.exports = app;