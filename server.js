const express = require('express');
const app = express();

require('dotenv').config();

// Start the server
const server = require('http').createServer(app);

const cors = require('cors');

const bodyParser = require('body-parser');

//Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//Parse application/json
app.use(bodyParser.json());

//CORS is enabled for all origins
app.use(cors());

// Define images routes before middleware authenticated to skip validation
app.get('/images/:image', (req, res) => {
    res.sendFile(__dirname + `/uploads/${req.params.image}`);
});

app.use( require('./routes/auth') );

//Authenticated Middleware
app.use( require('./middleware/authenticated').verifyToken );

//Routes
app.use( require('./routes/index') );

//Database Connection and Syncronize all models
require('./models/index'); 

server.listen(process.env.PORT, () => {
    console.log('Listen on: ', process.env.PORT);
});