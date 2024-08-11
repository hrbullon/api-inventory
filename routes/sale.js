const express = require('express');

const { 
    getAllSales, 
    getSaleById, 
    createSale, 
    deleteSale, 
    closeSale, 
    deleteSaleDetails,
    summarySalesBySession,
    createSaleDetails} = require('../controllers/SalesController');

let app = express(); 

app.get('/sales/:details?', getAllSales);
app.post('/sales/details', createSaleDetails);
app.get('/sale/:id', getSaleById);
app.post('/sales', createSale);
app.delete('/sales/:id', deleteSale);
app.delete('/sales/:id/details/:detail', deleteSaleDetails);
app.post('/sales/close', closeSale);
app.get('/sales/summary/:checkout_session_id', summarySalesBySession);

module.exports = app;