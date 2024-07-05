const express = require('express');

const { 
    getAllSales, 
    getSaleById, 
    createSale, 
    deleteSale, 
    closeSale, 
    summarySalesBySession} = require('../controllers/SalesController');

let app = express(); 

app.get('/sales/:details?', getAllSales);
app.get('/sales/:id', getSaleById);
app.post('/sales', createSale);
app.delete('/sales/:id', deleteSale);
app.post('/sales/close', closeSale);
app.get('/sales/summary/:checkout_session_id', summarySalesBySession);

module.exports = app;