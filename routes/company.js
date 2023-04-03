const express = require('express');

const { 
    getCompanyById, 
    createCompany, 
    updateCompany, 
    getAllCompanies, 
    deleteCompany } = require('../controllers/CompaniesController');

let app = express(); 

app.get('/companies', getAllCompanies);
app.get('/company/:id', getCompanyById);
app.post('/company', createCompany);
app.put('/company/:id', updateCompany);
app.delete('/company/:id', deleteCompany);

module.exports = app;