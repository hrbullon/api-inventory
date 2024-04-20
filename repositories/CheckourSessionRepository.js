const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const CheckoutSession = require("../models/CheckOutSessionModel");

class CheckoutSessionRepository { 

    static async findByPk(id) {
        return await CheckoutSession.findByPk(id);
    }
    
    static async findAll() {
        return await CheckoutSession.findAll();
    }

    static async create(model) {
        return await CheckoutSession.create(model);
    }

    static async update(body, id) {
        return await CheckoutSession.update(body, { where: { id: id } });
    }
}


module.exports = CheckoutSessionRepository;