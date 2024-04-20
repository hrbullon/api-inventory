const jwt = require('jsonwebtoken');

const { handleError, successResponse, notFoundResponse } = require('../utils/utils');

const User = require("../models/UserModel");
const UserRepository = require('../repositories/UserRepository');

const getAllUsers = async (req, res) => {
    try {

        const users = await UserRepository.findAll(req);
        successResponse( res, { users });

    } catch (error) {
        handleError(res, error);
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await UserRepository.findByPk(req.params.id); 

        if(user){
            successResponse( res, { user });
        }else{
            notFoundResponse( res, {  user: null, message: "Error - Usuario no encontrado" }); 
        }
    } catch (error) {
        handleError(res, error);
    }
}

const createUser = async (req, res) => {
    try {

        const token = req.headers.token;
        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);
        const user = await UserRepository.create(req, decodedToken);
        
        successResponse( res, { user });

    } catch (error) {
        handleError(res, error);
    }
}

const updateUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        let user = User.findByPk(id);

        if(user){
            
            const user = await UserRepository.update(req, id);
            successResponse( res, { user });

        }else{
            notFoundResponse( res, {  user: null, message: "Error - Usuario no encontrado" }); 
        }

    } catch (error) {
        handleError(res, error);
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id, action } = req.params;

        const user = await User.update({
            state: action.toString()
        }, { where: { id: id } });

        successResponse( res, { user });
        
    } catch (error) {
        handleError(res, error);
    }
}


module.exports = {
    getUserById,
    createUser,
    updateUser,
    getAllUsers,
    deleteUser
}