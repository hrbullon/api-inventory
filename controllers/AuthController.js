const jwt = require('jsonwebtoken');
require('dotenv').config();

const { MESSAGE_OK } = require('../const/variables');

const AuthRepository = require('../repositories/AuthRepository');

const { handleUnauthorized, successResponse, handleError } = require('../utils/utils');

const login = async (req, res) => {

    try {

        let token = null;
        let { account, password } = req.body;

        const { user, message } = await AuthRepository.login({ account, password });

        if(user && message == MESSAGE_OK){
            
            token = jwt.sign({
                user: user
            }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRE });
            
            return successResponse( res, { message: message, user: user, token });
        } 

        handleUnauthorized( res,  { message: message, user: user, token })

    } catch (error) {
        handleError( res, error );
    }
}

module.exports = {
    login
}