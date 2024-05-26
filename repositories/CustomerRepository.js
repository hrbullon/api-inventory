const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Customer = require("../models/CustomerModel");

class CustomerRepository { 

    static async findByPk(id) {
        return await Customer.findByPk(id,{
            attributes: { exclude: ['createdAt','updatedAt'] }
        });
    }
    
    static async findByDNI(dni) {
        return await Customer.findOne({
            where: {
                dni: dni
            }
        });
    }

    static async findAll(params) {

        let condition = null;
        let { dni, name, phone, email } = params.query;
        
        if(Object.entries(params.query).length > 0 ){
            condition = { 
                dni: { [Op.like]: `%${dni}%` },
                name: { [Op.like]: `%${name}%` }, 
                phone: { [Op.like]: `%${phone}%` },
                email: { [Op.like]: `%${email}%` },
            };
        }

        return await Customer.findAll({
            where: condition,
            attributes: ['id','dni','name','phone','email','address'],
            order: [ [ 'id', 'DESC' ]]
        });
    }

    static async create(data){
        return await Customer.create(data);
    }

    static async update(data, id){
        return await Customer.update(data, {
            where: {
              id: id
            }
        });
    }

    static async destroy(id){
        
        const customer = await this.findByPk(id);

        if(customer){
            //Apply Soft Delete
        }else{
            return await Customer.destroy({
                where: {
                  id: id
                }
            });
        }
    }
}

module.exports = CustomerRepository;