const express = require('express');

const { 
    getProductById, 
    createProduct, 
    updateProduct, 
    getAllProducts, 
    deleteProduct, 
    getAllProductsWithStock } = require('../controllers/ProductsController');

const upload = require('../middleware/upload');

const { verifyAdminRole } = require('../middleware/authenticated');

let app = express(); 

app.get('/products', getAllProducts);
app.get('/products/stock', getAllProductsWithStock);
app.get('/product/:id', getProductById);
app.post('/product', [ verifyAdminRole, upload.single('image') ], createProduct);
app.put('/product/:id', [ verifyAdminRole, upload.single('image') ] ,updateProduct);

app.delete('/product/:id', verifyAdminRole, deleteProduct);

module.exports = app;