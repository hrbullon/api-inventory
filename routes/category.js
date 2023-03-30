const express = require('express');

const { getCategoryById, createCategory, updateCategory, getAllCategories, deleteCategory } = require('../controllers/CategoriesController');

let app = express(); 

app.get('/categories', getAllCategories);
app.get('/category/:id', getCategoryById);
app.post('/category', createCategory);
app.put('/category/:id', updateCategory);
app.delete('/category/:id', deleteCategory);

module.exports = app;