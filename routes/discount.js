const express = require('express');

const { deleteDiscount, createDiscount, getAllDiscountsBySale } = require('../controllers/DiscountController');

let app = express(); 

app.get('/discounts/:saleId', getAllDiscountsBySale);
app.post('/discount', createDiscount);
app.delete('/discount/:id', deleteDiscount);

module.exports = app;