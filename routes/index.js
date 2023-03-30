const express = require('express');

const app = express();

app.use( require('./category') );

module.exports = app;