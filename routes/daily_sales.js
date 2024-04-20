const express = require('express');

const { getAllDailySales } = require('../controllers/DailySalesController');

let app = express(); 

app.get('/daily_sales', getAllDailySales);

module.exports = app;