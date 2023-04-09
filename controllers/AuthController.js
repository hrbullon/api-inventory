const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require("../models/UserModel");

const login = async (req, res) => {

    try {

        let body = req.body;
    
        const user = await User.findOne({
            where: { account: body.account },
            attributes: { exclude: ['createdAt','updatedAt'] }
        });

        if (!user) {
            return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
        }

        if (!bcrypt.compareSync(body.password, user.password)) {
            return res.status(400).json({ message: "Usuario o contraseña incorrectos" });
        }

        let token = jwt.sign({
            user: user
        }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRE });
       
        res.json({ message: "Ok", user, token });
    } catch (error) {
        res.json({ message: error.message });
    }
}

module.exports = {
    login
}