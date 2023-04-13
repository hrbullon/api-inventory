const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');

require('dotenv').config();

let mainWindow

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

function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600
    })
  
    // Carga la aplicación web de Node.js y Express en la ventana de navegador de Electron
    mainWindow.loadURL('http://localhost:8000')
  
    mainWindow.on('closed', function () {
      mainWindow = null
    })
}

server.listen(process.env.PORT, () => {

    if(app){
        app.whenReady().then(createWindow)
    
        app.on('window-all-closed', function () {
            if (process.platform !== 'darwin') app.quit()
        })
    
        app.on('activate', function () {
            if (mainWindow === null) createWindow()
        })
    }

    console.log('Listen on: ', process.env.PORT);
});