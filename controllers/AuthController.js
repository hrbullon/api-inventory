const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuthRepository = require('../repositories/AuthRepository');
const { HTTP_200, MESSAGE_OK, HTTP_400, HTTP_403 } = require('../const/variables');

const login = async (req, res) => {

    try {

        let token = null;
        let statusCode = HTTP_403;
        let { account, password } = req.body;

        const { user, message } = await AuthRepository.login({ account, password });

        if(user && message == MESSAGE_OK){
            
            token = jwt.sign({
                user: user
            }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRE });
            
            statusCode = HTTP_200;

        } else if(user && message !== MESSAGE_OK){
            statusCode = HTTP_403;
        }
       
        res.status(statusCode).json({ message: message, user: user, token });

    } catch (error) {
        res.status(HTTP_400).json({ message: error.message });
    }
}

module.exports = {
    login
}