const User = require("../models/UserModel");
const Checkout = require("../models/CheckoutModel");
const CheckoutRegister = require("../models/CheckoutRegisterModel");
const Transaction = require("../models/TransactionModel");
const moment = require("moment/moment");

const Sequelize = require('sequelize');
const { 
    TRANSACTION_TYPE_SALE, 
    TRANSACTION_TYPE_CHANGE, 
    TRANSACTION_TYPE_CHECKOUT_OPEN, 
    TRANSACTION_TYPE_CHECKOUT_IN_CASH, 
    TRANSACTION_TYPE_CHECKOUT_OUT_CASH } = require("../const/variables");
const Op = Sequelize.Op;

class TransactionRepository {

    static async findOneById(id) {
        return await CheckoutRegister.findOne({
            where: { 
                id: id,
            }
        });
    }

    static async findTransactionBySessionPOS(sessionPOS) {
        
        //let today = moment().format("YYYY-MM-DD");
        
        return await CheckoutRegister.findAll({
            where: { 
                session_pos: sessionPOS,
            },
            include: [ 
                {
                    model: Checkout,
                    attributes:['id','name']
                },
                {
                    model: User,
                    attributes:['id','account','firstname','lastname']
                },
                {
                    model: Transaction,
                    attributes:['id','description','name']
                }
            ]
        });
    }
    
    static async create(body) {
        return await CheckoutRegister.create(body);
    }

    static async checkExistTransaction(CheckoutId, type_transaction) {
        
        return await CheckoutRegister.findOne({
            where: {
                checkout_id: CheckoutId,
                transaction_id: type_transaction,
            }
        })
    }

    static async getTotalAmountInOut(sessionPOS, date, type_transaction, column) {
        
        const result = await CheckoutRegister.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col(`CheckoutRegister.${column}`)), 'total_amount'],
            ],
            where: {                
                session_pos: sessionPOS,
                transaction_id: type_transaction },
        });

        let total_amount = result[0].getDataValue('total_amount');
        return total_amount !== null? parseFloat(total_amount) : 0;
    }

    static async getTransactionSummary(sessionPOS, date) {

        const openChash = await CheckoutRegister.findAll({
            attributes: ['total_amount_in'],
            where: {                
                session_pos: sessionPOS,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_OPEN },
        });
        
        /***** Get total sales (count)*****/
        const sales = await CheckoutRegister.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'count_sales'],
                [Sequelize.fn('SUM', Sequelize.col('CheckoutRegister.total_amount_in')), 'total_amount_sales'],
            ],
            where: {                
                session_pos: sessionPOS,
                transaction_id: TRANSACTION_TYPE_SALE },
        });

        const total_amount_change = await this.getTotalAmountInOut(sessionPOS, date, TRANSACTION_TYPE_CHANGE, 'total_amount_out');
        let total_amount_sales = parseFloat(sales[0].getDataValue('total_amount_sales'));

        const total_amount_in_cash = await this.getTotalAmountInOut(sessionPOS, date, TRANSACTION_TYPE_CHECKOUT_IN_CASH, 'total_amount_in');
        const total_amount_out_cash = await this.getTotalAmountInOut(sessionPOS, date, TRANSACTION_TYPE_CHECKOUT_OUT_CASH, 'total_amount_out');

        let real_total_sale = (parseFloat(total_amount_change)+parseFloat(total_amount_sales));

        return { 
            total_amount_cash_starting: parseFloat(openChash[0].getDataValue('total_amount_in')),
            count_sales: parseFloat(sales[0].getDataValue('count_sales')),
            total_amount_sales,
            total_amount_change,
            total_amount_in_cash,
            total_amount_out_cash,
            real_total_sale
         };
    }
}

module.exports = TransactionRepository;