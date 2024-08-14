const  Sequelize  = require("sequelize");

const Payment = require("../models/PaymentModel");
const PaymentMethod = require("../models/PaymentMethodModel");
const PaymentDetails = require("../models/PaymentDetailsModel");
const { PAYMENT_DELETED_FALSE } = require("../const/variables");

class PaymentRepository { 

    static async findByPk(id) {
        return await Payment.findByPk(id);
    }

    static async findAllBySale(saleId) { 

        const payments = await Payment.findAll({
            attributes: ['id','reference','exchange_amount','total_amount','total_amount_converted'],
            where: { deleted: PAYMENT_DELETED_FALSE },
            include: [ 
                {
                    model: PaymentDetails,
                    attributes: {
                        exclude: ["PaymentDetails"]
                    },
                    where: {
                        sale_id: saleId
                    }
                },
                {
                    model: PaymentMethod,
                    attributes: ['description']
                }
            ],
            order: [ [ 'id', 'ASC' ]]
        });

        return payments;
    }

    static async create(data){
        const model = data;
        return await Payment.create(model);
    }
    
    static async delete(id){

        const payment = await this.findByPk(id);

        if(payment){
            payment.deleted = "1";
            return payment.save();
        }else{
            return false;
        }
    }

    static async get_total_amount_paid_by_sale(saleId){

        return await PaymentDetails.findOne({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('PaymentDetails.total_amount')), 'total_amount'],
                [Sequelize.fn('SUM', Sequelize.col('PaymentDetails.total_amount_converted')), 'total_amount_converted']
            ],
            include: [
                {
                    model: Payment,
                    where: { deleted: PAYMENT_DELETED_FALSE }
                }
            ],
            where: {
                sale_id: saleId,
            }    
        });
    }

    static async summaryPaymentsBySession(checkoutSessionId, payment_method_id = "") {

        const condition = payment_method_id ?
                { checkout_session_id: checkoutSessionId, payment_method_id, deleted: PAYMENT_DELETED_FALSE } :   
                { checkout_session_id: checkoutSessionId, deleted: PAYMENT_DELETED_FALSE };

        const payments = await Payment.findAll({
            attributes: [
                [Sequelize.literal('PaymentMethod.description'), 'payment_method'],
                [Sequelize.fn('SUM', Sequelize.col('Payment.total_amount')), 'total_amount'],
                [Sequelize.fn('SUM', Sequelize.col('Payment.total_amount_converted')), 'total_amount_converted'],

            ],
            where: condition,
            include: [
                {
                    model: PaymentMethod,
                    attributes: []
                }
            ],
            group: ['payment_method_id'],
        });

        return payments;
    }
} 

module.exports = PaymentRepository