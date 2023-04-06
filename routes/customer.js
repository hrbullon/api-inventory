const express = require('express');

const { 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    getAllCustomers, 
    deleteCustomer, 
    getCustomerByDni} = require('../controllers/CustomersController');

let app = express(); 

app.get('/customers', getAllCustomers);
app.get('/customer/:id', getCustomerById);
app.get('/customer/dni/:dni', getCustomerByDni);
app.post('/customer', createCustomer);
app.put('/customer/:id', updateCustomer);
app.delete('/customer/:id', deleteCustomer);

module.exports = app;