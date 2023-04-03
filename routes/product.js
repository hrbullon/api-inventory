const express = require('express');

const { 
    getProductById, 
    createProduct, 
    updateProduct, 
    getAllProducts, 
    deleteProduct } = require('../controllers/ProductsController');

let app = express(); 

app.get('/products', getAllProducts);
app.get('/product/:id', getProductById);
app.post('/product', createProduct);
app.put('/product/:id', updateProduct);
app.delete('/product/:id', deleteProduct);

module.exports = app;