const jwt = require('jsonwebtoken');
const moment = require("moment/moment");

const { handleError, successResponse } = require('../utils/utils');

const SaleRepository = require('../repositories/SaleRepository');
const PaymentsRepository = require('../repositories/PaymentsRepository');
const PaymentsDetailsRepository = require('../repositories/PaymentsDetailsRepository');

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
            checkout_id:1,//Still to get a multi chekout register
            user_id: decodedToken.user.id
        } 

        const payment = await PaymentsRepository.create(paymentModel);
        await PaymentsDetailsRepository.createDetails(payment.id, payment_details).then( () => {

            payment_details.map( async (item) => {
                let totalPayed = 0;
                let payments = await PaymentsRepository.findAllBySale(item.sale_id);
                //Get total amount payed by sale
                totalPayed = payments.reduce((acum, payment) => (acum + Number(payment.total_amount)), 0);
                totalPayed += Number(item.total_amount);
                await SaleRepository.updateTotalPayedAndChange(item.sale_id, totalPayed);
            });

        });

        res.json({ message: "Ok", payment } );

    } catch (error) {
        handleError(res, error);
    }
}

const summaryPaymentsBySession = async (req, res) => {

    const { sessionPOST, date } = req.params;
    const summary = await PaymentsRepository.summaryPaymentsBySession(sessionPOST, date);
    res.json({ message: "Ok", summary } );
}

module.exports = {
    getAllPaymentsBySale,
    createPayment,
    summaryPaymentsBySession
}