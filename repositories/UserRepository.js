const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const User = require("../models/UserModel");

class UserRepository { 

    static async findByPk(id) {
        return await User.findByPk(req.params.id,{
            attributes: { exclude: ['password','createdAt','updatedAt'] }
        });
    }

    static async findAll(req) { 
        
        const { dni, firstname, lastname, account } = req.query;

        const filter = {}
            
        if (dni) {
            filter.dni = { [Op.like]: `%${dni}%` };
        }
        if (firstname) {
            filter.firstname = { [Op.like]: `%${firstname}%` };
        }
        if (lastname) {
            filter.lastname = { [Op.like]: `%${lastname}%` };
        }
        if (account) {
            filter.account = { [Op.like]: `%${account}%` };
        }
        
        const users = await  User.findAll(
            { 
                attributes: ['id','dni','firstname','lastname','account','state'],
                order: [ [ 'id', 'DESC' ]],
                where: filter
            }
        );

        return users;
    }
}

module.exports = UserRepository;