const User = require("../models/UserModel");
const Checkout = require("../models/CheckoutModel");
const CheckoutRegister = require("../models/CheckoutRegisterModel");
const Transaction = require("../models/TransactionModel");

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
}

module.exports = TransactionRepository;