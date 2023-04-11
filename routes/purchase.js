const express = require('express');

const { 
    getPurchaseById, 
    createPurchase, 
    updatePurchase, 
    getAllPurchases, 
    deletePurchase } 
= require('../controllers/PurchasesController');

let app = express(); 

const route = "/purchases";

app.get(`${route}`, getAllPurchases);
app.get(`${route}/:id`, getPurchaseById);
app.post(`${route}`, createPurchase);
app.put(`${route}/:id`, updatePurchase);
app.delete(`${route}/:action/:id`, deletePurchase);

module.exports = app;