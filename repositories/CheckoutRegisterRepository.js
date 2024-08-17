const CheckoutRegister = require("../models/CheckoutRegisterModel");
const Transaction = require("../models/TransactionModel");

const Sequelize = require('sequelize');

const { 
    TRANSACTION_TYPE_SALE, 
    TRANSACTION_TYPE_CHANGE, 
    TRANSACTION_TYPE_CHECKOUT_OPEN, 
    TRANSACTION_TYPE_CHECKOUT_IN_CASH, 
    TRANSACTION_TYPE_CHECKOUT_OUT_CASH, 
    CHECKOUT_SALE,
    TRANSACTION_TYPE_CHECKOUT_CANCEL_SALE} = require("../const/variables");
const CheckoutSession = require("../models/CheckOutSessionModel");

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

    static async createSalePaid(sale, userId) {

        const { code, checkout_session_id, total_amount_paid } = sale.dataValues;

        const model = {
            checkout_session_id: checkout_session_id,
            user_id: userId,
            transaction_id: CHECKOUT_SALE,
            note: `Venta - ${code} - (COBRADA)`,
            total_amount_in: total_amount_paid,
            total_amount_out: 0
        };

        return await this.create(model);
    }

    static async createSaleAmountChange(sale){

        const { code, total_amount_change, checkout_session_id } = sale.dataValues;

        const model = {
            note: `Cambio/Vuelto - ${code}`,
            total_amount_in: 0,
            transaction_id:TRANSACTION_TYPE_CHANGE,
            total_amount_out:total_amount_change,
            checkout_session_id: checkout_session_id
        };

        return await this.create(model);
    }
    
    static async create(body) {
        return await CheckoutRegister.create(body);
    }

    //checkExistTransaction
    static async findOneByCheckoutId(checkoutSessionId, type_transaction, checkout_session_state = false) {
        
        return await CheckoutRegister.findOne({
            include: [
                {
                    model: CheckoutSession,
                    where: {
                        id: checkoutSessionId,
                    }
                }
            ],
            where: {
                checkout_session_id: checkoutSessionId,
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
                [Sequelize.fn('SUM', Sequelize.col('CheckoutRegister.total_amount_in')), 'total_amount_sales'],
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

    static async getTotalAmountByTransaction({ column, transaction_type, checkout_session_id }){
        
        return await CheckoutRegister.findAll({
            attributes: [
                [
                    Sequelize.fn('COUNT', 
                    Sequelize.col('*')), 
                    'quantity'
                ],
                [   Sequelize.fn('SUM', 
                    Sequelize.col(`CheckoutRegister.${ column }`)), 
                    'total_amount'
                ],
            ],
            where: {                
                checkout_session_id: checkout_session_id,
                transaction_id: transaction_type 
            },
        });
    }

    //getTotalAmountInOut
    static async getSumTotalAmount(condition, field) {
        
        const result = await CheckoutRegister.findAll({
            attributes: [
                [
                    Sequelize.fn('SUM', 
                    Sequelize.col(`CheckoutRegister.${field}`)), 
                    'total_amount'//Alias
                ],
            ],
            where: {                
                checkout_session_id: condition.checkoutSessionId,
                transaction_id: condition.transactionType 
            },
        });

        let total_amount = result[0].getDataValue('total_amount');
        return total_amount? parseFloat(total_amount) : 0;
    }
    //getTransactionSummary
    static async getSummary(checkoutSessionId) {

        const openChash = await CheckoutRegister.findAll({
            attributes: ['total_amount_in'],
            where: {                
                checkout_session_id: checkoutSessionId,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_OPEN 
            },
        });
        
        /***** Get total sales (count)*****/
        const sales = await this.getTotalAmountByTransaction({
            column: 'total_amount_in', 
            transaction_type: TRANSACTION_TYPE_SALE, 
            checkout_session_id: checkoutSessionId
        });
        
        /***** Get total cancelled sales****/
        const cancelled_sales = await this.getTotalAmountByTransaction({
            column: 'total_amount_out', 
            transaction_type: TRANSACTION_TYPE_CHECKOUT_CANCEL_SALE, 
            checkout_session_id: checkoutSessionId
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

        let total_amount_sales_result = sales[0].getDataValue('total_amount');
        let total_amount_sales = (total_amount_sales_result)? parseFloat(total_amount_sales_result) : 0;
        let total_amount_cancelled_result = cancelled_sales[0].getDataValue('total_amount');
        let total_amount_cancelled = (total_amount_cancelled_result)? parseFloat(total_amount_cancelled_result) : 0;

        return { 
            total_amount_cash_starting: parseFloat(openChash[0].getDataValue('total_amount_in')),
            count_sales: parseFloat(sales[0].getDataValue('quantity')-cancelled_sales[0].getDataValue('quantity')),
            total_amount_sales,
            total_amount_cancelled,
            total_amount_change: await this.getSumTotalAmount(transactionTypeChange,'total_amount_out'),
            total_amount_in_cash: await this.getSumTotalAmount(transactionTypeInCash,'total_amount_in'),
            total_amount_out_cash: await this.getSumTotalAmount(transactionTypeOutCash, 'total_amount_out'),
            real_total_sale: (parseFloat(0)+parseFloat(total_amount_sales))
         };
    }
}

module.exports = CheckoutRegisterRepository;