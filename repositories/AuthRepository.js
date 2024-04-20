const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require("../models/UserModel");
const Company = require('../models/CompanyModel');

const { MESSAGE_OK } = require('../const/variables');

class AuthRepository { 
    
    static async login({ account, password }) {
        
        let response = { user: null, message: '' }

        const user = await User.findOne({
            where: { account: account },
            include: [ Company ],
            attributes: { exclude: ['createdAt','updatedAt'] }
        });

        if (!user) {
            response = { ...response, message: 'Usuario o contraseña incorrectos' };
        }

        if (user && user.state == "0") {
            response = { ...response, message: 'Usuario inactivo, comunícaquese con el administrador!' };
        }

        if (user && user.state == "1") {
            if(!bcrypt.compareSync(password, user.password)){
                response = { ...response, message: 'Usuario o contraseña incorrectos' };
            }else{
                response = { user: user, message: MESSAGE_OK };
            }
        }

        if(response.message == MESSAGE_OK) {
            user.password = "┌∩┐(◣_◢)┌∩┐";
            user.role = (user.role == "1")? "ADM_ROLE" : "STD_ROLE";
        }
        
        return response;
    } 
}

module.exports = AuthRepository;