const bcrypt = require('bcrypt');


const User = require("../models/UserModel");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ message: "Ok", users });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id,{
            attributes: { exclude: ['password','createdAt','updatedAt'] }
        });
        res.json({ message: "Ok", user });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const { password } = req.body;
        const model = req.body;
        model.password = bcrypt.hashSync(password, 10);

        const user = await User.create(model);
        res.json({ message: "Ok", user });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {

        const { password } = req.body;
        const model = req.body;
        
        if(password !== ""){
            model.password = bcrypt.hashSync(password, 10);
        }else{
            delete model.password;
        }

        const user = await User.update(model, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", user });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await User.update({
            state: req.params.action
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