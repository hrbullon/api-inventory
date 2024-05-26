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

class CheckoutRegisterRepository {

    static async findOneById(id) {
        return await CheckoutRegister.findByPk({
            where: { 
                id: id,
            }
        });
    }

    //findTransactionBySessionPOS
    static async findAllByCheckoutSessionId(checkoutSessionId) {
        
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

    //checkExistTransaction
    static async findOneByCheckoutId(CheckoutId, type_transaction) {
        
        return await CheckoutRegister.findOne({
            where: {
                checkout_id: CheckoutId,
                transaction_id: type_transaction,
            }
        })
    }

    static async getTotalAmountOpenCash(checkoutSessionId) {

        const openChash = await CheckoutRegister.findAll({
            attributes: ['total_amount'],
            where: {                
                checkout_session_id: checkoutSessionId,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_OPEN },
        });

        return openChash;
    }

    static async getQuantityAndTotalSales(checkoutSessionId) {
        
        const sales = await CheckoutRegister.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('*')), 'count_sales'],
                [Sequelize.fn('SUM', Sequelize.col('CheckoutRegister.total_amount')), 'total_amount_sales'],
            ],
            where: {                
                checkout_session_id: checkoutSessionId,
                transaction_id: TRANSACTION_TYPE_SALE },
        });
        
        return {
            countSales: parseFloat(sales[0].getDataValue('count_sales')),
            total_amount_sales: parseFloat(sales[0].getDataValue('total_amount_sales'))
        }
    }

    //getTotalAmountInOut
    static async getSumTotalAmount(condition) {
        
        const result = await CheckoutRegister.findAll({
            attributes: [
                [
                    Sequelize.fn('SUM', 
                    Sequelize.col(`CheckoutRegister.total_amount`)), 
                    'total_amount'//Alias
                ],
            ],
            where: {                
                checkout_session_id: condition.checkoutSessionId,
                transaction_id: condition.transactionType 
            },
        });

        let total_amount = result[0].getDataValue('total_amount');
        return total_amount !== null? parseFloat(total_amount) : 0;
    }
    //getTransactionSummary
    static async getSummary(checkoutSessionId) {

        const openChash = await CheckoutRegister.findAll({
            attributes: ['total_amount'],
            where: {                
                checkout_session_id: checkoutSessionId,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_OPEN 
            },
        });
        
        /***** Get total sales (count)*****/
        const sales = await CheckoutRegister.findAll({
            attributes: [
                [
                    Sequelize.fn('COUNT', 
                    Sequelize.col('*')), 
                    'count_sales' //Alias
                ],
                [   Sequelize.fn('SUM', 
                    Sequelize.col('CheckoutRegister.total_amount')), 
                    'total_amount_sales' //Alias
                ],
            ],
            where: {                
                checkout_session_id: checkoutSessionId,
                transaction_id: TRANSACTION_TYPE_SALE 
            },
        });

        const transactionTypeChange = {
            checkoutSessionId, 
            transactionType: TRANSACTION_TYPE_CHANGE
        };
        
        const transactionTypeInCash = {
            checkoutSessionId, 
            transactionType: TRANSACTION_TYPE_CHECKOUT_IN_CASH
        };
        
        const transactionTypeOutCash = {
            checkoutSessionId, 
            transactionType: TRANSACTION_TYPE_CHECKOUT_OUT_CASH
        };

        let total_amount_sales = parseFloat(sales[0].getDataValue('total_amount_sales'));

        return { 
            total_amount_cash_starting: parseFloat(openChash[0].getDataValue('total_amount')),
            count_sales: parseFloat(sales[0].getDataValue('count_sales')),
            total_amount_sales,
            total_amount_change: await this.getSumTotalAmount(transactionTypeChange),
            total_amount_in_cash: await this.getSumTotalAmount(transactionTypeInCash),
            total_amount_out_cash: await this.getSumTotalAmount(transactionTypeOutCash),
            real_total_sale: (parseFloat(total_amount_change)+parseFloat(total_amount_sales))
         };
    }
}

module.exports = CheckoutRegisterRepository;