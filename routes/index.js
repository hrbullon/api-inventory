const express = require('express');

const app = express();

app.use( require('./admin') );
app.use( require('./category') );
app.use( require('./exchange') );
app.use( require('./company') );
app.use( require('./customer') );
app.use( require('./product') );
app.use( require('./user') );
app.use( require('./sale') );
app.use( require('./purchase') );
app.use( require('./payment_methods') );

module.exports = app;