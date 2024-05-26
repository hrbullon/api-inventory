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
app.use( require('./checkout') );
app.use( require('./transaction') );
app.use( require('./payment') );
app.use( require('./payment_methods') );
app.use( require('./daily_sales') );
app.use( require('./checkout_register') );

module.exports = app;