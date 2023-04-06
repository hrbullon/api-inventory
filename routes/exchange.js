const express = require('express');

const { 
    getAllExchanges, 
    getExchangeById, 
    createExchange, 
    updateExchange, 
    deleteExchange } = require('../controllers/ExchangesController');

let app = express(); 

app.get('/exchanges', getAllExchanges);
app.get('/exchange/:id', getExchangeById);
app.post('/exchange', createExchange);
app.put('/exchange/:id', updateExchange);
app.delete('/exchange/:id', deleteExchange);

module.exports = app;