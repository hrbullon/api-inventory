const express = require('express');

const { 
    getAllSales, 
    getSaleById, 
    createSale, 
    updateSale, 
    deleteSale } = require('../controllers/SalesController');

let app = express(); 

app.get('/sales', getAllSales);
app.get('/sales/:id', getSaleById);
app.post('/sales', createSale);
app.put('/sales/:id', updateSale);
app.delete('/sales/:id', deleteSale);

module.exports = app;