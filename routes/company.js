const express = require('express');

const { 
    getCompanyById, 
    createCompany, 
    updateCompany, 
    getAllCompanies } = require('../controllers/CompaniesController');

let app = express(); 

app.get('/companies', getAllCompanies);
app.get('/companies/:id', getCompanyById);
app.post('/companies', createCompany);
app.put('/companies/:id', updateCompany);

module.exports = app;