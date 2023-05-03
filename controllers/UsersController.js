const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        res.json({ message: "Ok", user });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    try {

        const token = req.headers.token;

        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);

        const { password } = req.body;
        const model = req.body;

        model.state = "1";
        model.company_id = decodedToken.user.company_id;
        model.password = bcrypt.hashSync(password, 10);

        const user = await User.create(model);
        res.json({ message: "Ok", user });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { password } = req.body;
        const model = req.body;
        
        let user = User.findByPk(id);

        if(user){
            if(password !== ""){
                model.password = bcrypt.hashSync(password, 10);
            }else{
                delete model.password;
            }

            model.state = model.state.toString();

            user = await User.update(model, {
                where: {
                  id: req.params.id
                }
            });

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
        const user = await User.update({
            state: req.params.action.toString()
        }, {
            where: {
              id: req.params.id
            }
        });
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