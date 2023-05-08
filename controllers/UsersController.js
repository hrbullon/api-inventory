const jwt = require('jsonwebtoken');

const User = require("../models/UserModel");
const UserRepository = require('../repositories/UserRepository');

const getAllUsers = async (req, res) => {
    try {
        const users = await UserRepository.findAll(req);
        res.json({ message: "Ok", users });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await UserRepository.findByPk(req.params.id); 

        if(user){
            res.json({ message: "Ok", user });
        }else{
            res.status(404).json({
                message: "No found",
                user: null
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    try {

        const token = req.headers.token;
        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);
        const user = await UserRepository.create(req, decodedToken);
        res.status(201).json({ message: "Ok", user });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        let user = User.findByPk(id);

        if(user){
            const user = await UserRepository.update(req, id);
            return res.json({ message: "Ok", user });
        }else{
            return res.status(404).json({ message: "Error - Usuario no encontrado" });
        }

    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id, action } = req.params;

        const user = await User.update({
            state: action.toString()
        }, { where: { id: id } });

        res.json({ message: "Ok", user });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getUserById,
    createUser,
    updateUser,
    getAllUsers,
    deleteUser
}