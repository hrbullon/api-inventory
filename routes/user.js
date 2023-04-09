const express = require('express');

const { getUserById, createUser, updateUser, getAllUsers, deleteUser } = require('../controllers/UsersController');

let app = express(); 

app.get('/users', getAllUsers);
app.get('/user/:id', getUserById);
app.post('/user', createUser);
app.put('/user/:id', updateUser);
app.delete('/user/:action/:id/', deleteUser);

module.exports = app;