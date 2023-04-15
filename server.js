const express = require('express');
const path = require('path');

require('dotenv').config();

const appExpress = express();

appExpress.use(express.static(path.join(__dirname, 'build')));

// Start the server
const server = require('http').createServer(appExpress);

const cors = require('cors');

const bodyParser = require('body-parser');


//Parse application/x-www-form-urlencoded
appExpress.use(bodyParser.urlencoded({extended: false}));

//Parse application/json
appExpress.use(bodyParser.json());

//CORS is enabled for all origins
appExpress.use(cors());

// Define images routes before middleware authenticated to skip validation
appExpress.get('/images/:image', (req, res) => {
    res.sendFile(__dirname + `/uploads/${req.params.image}`);
});

appExpress.use( require('./routes/auth') );

//Authenticated Middleware
appExpress.use( require('./middleware/authenticated').verifyToken );

//Routes
appExpress.use( require('./routes/index') );

appExpress.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

//Database Connection and Syncronize all models
require('./models/index'); 

server.listen(process.env.PORT, () => {
    console.log('Listen on: ', process.env.PORT);
});