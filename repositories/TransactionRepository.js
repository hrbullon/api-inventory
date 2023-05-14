const User = require("../models/UserModel");
const Checkout = require("../models/CheckoutModel");
const CheckoutRegister = require("../models/CheckoutRegisterModel");
const Transaction = require("../models/TransactionModel");
const moment = require("moment/moment");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class TransactionRepository {

    static async findTransactionByCheckout(checkout_id) {
        return await CheckoutRegister.findAll({
            where: { id: checkout_id },
            include: [ Checkout, User, Transaction ]
        });
    }
    
    static async create(body) {
        return await CheckoutRegister.create(body);
    }

    static async checkStartedTransaction(CheckoutId) {
        
        let today = moment().format("YYYY-MM-DD");

        return await CheckoutRegister.findOne({
            where: {
                checkout_id: CheckoutId,
                transaction_id: "1",
                date_time: {
                    [Op.between]: [`${today} 00:00:00`,`${today} 23:59:59`]
                }
            }
        })
    }
}

module.exports = TransactionRepository;