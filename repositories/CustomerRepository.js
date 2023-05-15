const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Customer = require("../models/CustomerModel");

class CustomerRepository { 

    static async findByPk(id) {
        return await Customer.findByPk(id,{
            attributes: { exclude: ['createdAt','updatedAt'] }
        });
    }
}

module.exports = CustomerRepository;