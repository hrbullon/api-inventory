const express = require('express');

const { login } = require('../controllers/AuthController');

let app = express(); 

app.post('/auth/login', login);

module.exports = app;