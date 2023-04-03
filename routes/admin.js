const express = require('express');

const { getCompanyById, updateCompany } = require('../controllers/CompaniesController');

let app = express(); 

app.get('/admin/:id', getCompanyById);
app.put('/admin/update/:id', updateCompany);

module.exports = app;