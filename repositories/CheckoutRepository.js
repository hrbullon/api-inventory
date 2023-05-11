const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Checkout = require("../models/CheckoutModel");
const CheckoutRegister = require('../models/CheckoutRegisterModel');

class CheckoutRepository { 

    static async findByPk(id) {
        return await Checkout.findByPk(id);
    }
    
    static async findAll() {
        return await Checkout.findAll({
            attributes: ["id", "name"]
        });
    }

    static async create(req) {
        return await Checkout.create(req.body);
    }

    static async update(body, id) {
        return await Checkout.update(body, { where: { id: id } });
    }
    
    static async delete(id) {
        return await Checkout.destroy({ where: { id: id } });
    }
}


module.exports = CheckoutRepository;