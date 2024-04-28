const CheckoutRegister = require("../models/CheckoutRegisterModel");
const Transaction = require("../models/TransactionModel");

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

    static async findTransactionBySessionPOS(checkoutSessionId) {
        
        return await CheckoutRegister.findAll({
            where: { 
                checkout_session_id: checkoutSessionId,
            },
            include: [ 
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

    static async getTotalAmountInOut(checkoutSessionId, type_transaction) {
        
        const result = await CheckoutRegister.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col(`CheckoutRegister.total_amount`)), 'total_amount'],
            ],
            where: {                
                checkout_session_id: checkoutSessionId,
                transaction_id: type_transaction },
        });

        let total_amount = result[0].getDataValue('total_amount');
        return total_amount !== null? parseFloat(total_amount) : 0;
    }

    static async getTransactionSummary(checkoutSessionId) {

        const openChash = await CheckoutRegister.findAll({
            attributes: ['total_amount'],
            where: {                
                checkout_session_id: checkoutSessionId,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_OPEN },
        });
        
        /***** Get total sales (count)*****/
        const sales = await CheckoutRegister.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'count_sales'],
                [Sequelize.fn('SUM', Sequelize.col('CheckoutRegister.total_amount')), 'total_amount_sales'],
            ],
            where: {                
                checkout_session_id: checkoutSessionId,
                transaction_id: TRANSACTION_TYPE_SALE },
        });

        const total_amount_change = await this.getTotalAmountInOut(checkoutSessionId, TRANSACTION_TYPE_CHANGE);
        let total_amount_sales = parseFloat(sales[0].getDataValue('total_amount_sales'));

        const total_amount_in_cash = await this.getTotalAmountInOut(checkoutSessionId, TRANSACTION_TYPE_CHECKOUT_IN_CASH);
        const total_amount_out_cash = await this.getTotalAmountInOut(checkoutSessionId, TRANSACTION_TYPE_CHECKOUT_OUT_CASH);

        let real_total_sale = (parseFloat(total_amount_change)+parseFloat(total_amount_sales));

        return { 
            total_amount_cash_starting: parseFloat(openChash[0].getDataValue('total_amount')),
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