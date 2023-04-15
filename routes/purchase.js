const express = require('express');

const { 
    getPurchaseById, 
    createPurchase, 
    getAllPurchases, 
    deletePurchase } 
= require('../controllers/PurchasesController');

let app = express(); 

const route = "/purchases";

app.get(`${route}`, getAllPurchases);
app.get(`${route}/:id`, getPurchaseById);
app.post(`${route}`, createPurchase);
app.delete(`${route}/:id`, deletePurchase);

module.exports = app;