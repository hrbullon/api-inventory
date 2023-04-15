const express = require('express');

const { 
    getAllSales, 
    getSaleById, 
    createSale, 
    deleteSale } = require('../controllers/SalesController');

let app = express(); 

app.get('/sales/:details?', getAllSales);
app.get('/sales/:id', getSaleById);
app.post('/sales', createSale);
app.delete('/sales/:id', deleteSale);

module.exports = app;