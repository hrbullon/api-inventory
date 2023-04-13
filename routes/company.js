const express = require('express');

const { 
    getCompanyById, 
    createCompany, 
    updateCompany, 
    getAllCompanies, 
    deleteCompany } = require('../controllers/CompaniesController');

let app = express(); 

app.get('/companies', getAllCompanies);
app.get('/companies/:id', getCompanyById);
app.post('/companies', createCompany);
app.put('/companies/:id', updateCompany);
app.delete('/companies/:id', deleteCompany);

module.exports = app;