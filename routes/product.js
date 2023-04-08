const express = require('express');

const { 
    getProductById, 
    createProduct, 
    updateProduct, 
    getAllProducts, 
    deleteProduct } = require('../controllers/ProductsController');
const upload = require('../middleware/upload');

let app = express(); 

app.get('/products', getAllProducts);
app.get('/product/:id', getProductById);
app.post('/product', upload.single('image'), createProduct);
app.put('/product/:id', upload.single('image') ,updateProduct);

app.delete('/product/:id', deleteProduct);

module.exports = app;