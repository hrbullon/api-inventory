const jwt = require('jsonwebtoken');
const moment = require("moment/moment");

const { handleError, successResponse } = require('../utils/utils');

const SaleRepository = require('../repositories/SaleRepository');
const PaymentsRepository = require('../repositories/PaymentsRepository');
const PaymentsDetailsRepository = require('../repositories/PaymentsDetailsRepository');

const { PAYMENT_DELETED_FALSE } = require('../const/variables');

const getAllPaymentsBySale = async (req, res) => {
    try {
        
        const payments = await PaymentsRepository.findAllBySale(req.params.saleId);
        successResponse( res, { payments });
        
    } catch (error) {
        handleError(res, error);
    }
}

const createPayment = async (req, res) => {
    try {

        //Getting Headers and Body
        const token = req.headers.token;
        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);
        //Prepare payment model
        let { payment_details } = req.body;
        delete req.body.payment_details;
        
        let date = req.body.date? moment(req.body.date, 'DD-MM-YYYY').format('YYYY-MM-DD') : moment().format("YYYY-MM-DD");
        
        let paymentModel = {
            ...req.body,
            date,
            deleted: PAYMENT_DELETED_FALSE,
            checkout_id:1,//Still to get a multi chekout register
            user_id: decodedToken.user.id
        } 

        const payment = await PaymentsRepository.create(paymentModel);

        await PaymentsDetailsRepository.create(payment.id, payment_details).then( async () => {

            payment_details.map( async (item) => {
                
                let payments = await PaymentsRepository.findAllBySale(item.sale_id);
                
                //Get total amount paid by sale
                let totalAmountPaid = payments.reduce((acum, payment) =>{ return ( acum + Number(payment.total_amount)) }, 0);
                let totalAmountPaidConverted = payments.reduce((acum, payment) => { return (acum + Number(payment.total_amount_converted)) }, 0);
                
                totalAmountPaid += Number(item.total_amount);
                totalAmountPaidConverted += Number(item.total_amount_converted);

                const totalPaid = {
                    total_amount: totalAmountPaid,
                    total_amount_converted: totalAmountPaidConverted,
                }

                await SaleRepository.updateTotalPaidAndChange(item.sale_id, totalPaid);
            });
            
        });
        
        successResponse( res, { payment });

    } catch (error) {
        handleError(res, error);
    }
}

const deletePayment = async (req, res) => {

    const { id } = req.params;
    const { saleId } = req.params;

    const deleted = await PaymentsRepository.delete(id);
    
    const total_amount_paid = await PaymentsRepository.get_total_amount_paid_by_sale(saleId);

    if(total_amount_paid.total_amount > 0) {
        await SaleRepository.updateTotalPaidAndChange(saleId, total_amount_paid);        
    } else {
        await SaleRepository.resetTotalAmountPaidAndChange(saleId);
    }
    
    successResponse( res, { deleted });
} 

const summaryPaymentsBySession = async (req, res) => {

    const { checkout_session_id } = req.params;
    const summary = await PaymentsRepository.summaryPaymentsBySession(checkout_session_id);
    successResponse( res, { summary });
}

module.exports = {
    getAllPaymentsBySale,
    createPayment,
    deletePayment,
    summaryPaymentsBySession
}