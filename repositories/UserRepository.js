const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const Op = Sequelize.Op;

const User = require("../models/UserModel");

class UserRepository { 

    static async findByPk(id) {
        return await User.findByPk(id,{
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
    
    static async create(req, token){

        const { password } = req.body;
        const model = req.body;

        model.state = "1";
        model.company_id = token.user.company_id;
        model.password = bcrypt.hashSync(password, 10);

       return await User.create(model);
    }

    static async update(req, id){

        const { password } = req.body;
        const model = req.body;

        if(password !== ""){
            model.password = bcrypt.hashSync(password, 10);
        }else{
            delete model.password;
        }

        model.state = model.state.toString();
        return await User.update(model, { where: { id: id } });
    }
}

module.exports = UserRepository;