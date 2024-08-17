const moment = require("moment/moment");

const { handleError, successResponse } = require('../utils/utils');

const CheckoutRegisterRepository = require('../repositories/CheckoutRegisterRepository');

const { 
    TRANSACTION_TYPE_CHECKOUT_OPEN, 
    TRANSACTION_TYPE_CHECKOUT_CLOSE, 
    PAYMENT_METHOD_CASH,
    TRANSACTION_TYPE_CHECKOUT_IN_CASH} = require('../const/variables');

const CheckoutRepository = require('../repositories/CheckoutRepository');
const CheckoutSessionRepository = require('../repositories/CheckourSessionRepository');
const PaymentRepository = require("../repositories/PaymentsRepository");
const DailySalesRepository = require("../repositories/DailySalesRepository");

const findAllByCheckoutSessionId = async (req, res) => {
    try {
        const { checkoutSessionId } = req.params;
        const checkout_register_items = await CheckoutRegisterRepository.findAllByCheckoutSessionId(checkoutSessionId);
        
        successResponse( res,  { checkout_register_items } );

    } catch (error) {
        
        handleError( res, error.message )
    }
}

const createCheckoutOpen = async (req, res) => {
    try {

        let { amount, user_id, checkout_id } = req.body;

        req.body.total_amount_in = amount;
        req.body.total_amount_out = 0;

        let checkout = await CheckoutRepository.findByPk(checkout_id);

        if(checkout){

            let date = moment().format("YYYY-MM-DD");
            let starting_time = moment();

            const session = { checkout_id: checkout_id, user_id, date, starting_time, state: 1 };
            const sessionPOS = await CheckoutSessionRepository.create(session);
            
            req.body.checkout_id = checkout_id;
            req.body.checkout_session_id = sessionPOS.id;

            const checkout_register = await CheckoutRegisterRepository.create(req.body);

            successResponse( res, { checkout_register });

        }else{
            handleError(res, { message: "Checkout invalid ID" });
        }

    } catch (error) {
        handleError(res, error);
    }
} 

const createInAndOutCash = async (req, res) => {
    try {

        let { amount, transaction_id } = req.body;

        if(transaction_id == TRANSACTION_TYPE_CHECKOUT_IN_CASH){
            req.body.total_amount_in = amount;
            req.body.total_amount_out = 0;
        }else{
            req.body.total_amount_in = 0;
            req.body.total_amount_out = amount;
        }

        let checkoutSession = await CheckoutSessionRepository.findByPk(req.body.checkout_session_id);

        if(checkoutSession){

            let date = moment().format("YYYY-MM-DD");
            req.body.date = date;
            req.body.user_id = checkoutSession.user_id;

            const checkout_register = await CheckoutRegisterRepository.create(req.body);

            successResponse( res, { checkout_register });

        }else{
            handleError(res, { message: "Checkout invalid ID" });
        }

    } catch (error) {
        handleError(res, error);
    }
} 

const checkStartedTransaction = async (req, res) => {
    try {
        let { checkoutSessionId } = req.params;
 
        let transaction = null;

        
        const started = await CheckoutRegisterRepository.
        findOneByCheckoutId(checkoutSessionId, 
            TRANSACTION_TYPE_CHECKOUT_OPEN
        );

        const closed = await CheckoutRegisterRepository.
        findOneByCheckoutId(checkoutSessionId, 
            TRANSACTION_TYPE_CHECKOUT_CLOSE
        );
   
        if(started && !closed){
            transaction = started;
            successResponse( res,  { checkout_register: started } );
        }else{
            successResponse( res,  { checkout_register: false } );
        } 

    } catch (error) {
        handleError( res, error.message )
    }
}

const closeCheckoutRegisterTransaction = async (req, res) => {

    try {
        
        const { checkoutSessionId } = req.body;

        const checkoutClosed = await CheckoutRegisterRepository.findOneByCheckoutId(checkoutSessionId, TRANSACTION_TYPE_CHECKOUT_CLOSE);
    
        //Check Checkout Closed
        if(!checkoutClosed){
            
            let today = moment().format("YYYY-MM-DD");

            const checkoutStarted = await CheckoutRegisterRepository.findOneByCheckoutId(checkoutSessionId, TRANSACTION_TYPE_CHECKOUT_OPEN);
            const summary = await getSummaryTransaction(checkoutSessionId);
            
            const dailySale = {
                date:  today,
                checkout_session_id: checkoutSessionId,
                ...summary,
            }

            const transaction = {
                date: today,
                checkout_session_id:checkoutSessionId,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_CLOSE,
                note: checkoutStarted.note.replace('Apertura','Cierre'),
                total_amount_in: 0,
                total_amount_out: summary.total_amount_cash_ending
            }
    
            await CheckoutRegisterRepository.create(transaction);
            const checkoutClosed = await DailySalesRepository.create(dailySale);

            successResponse( res, { checkoutClosed });

        }else{
            handleError(res, { error: { message: `Error, la caja ya ha sido cerrada`} } );
        }

    }catch (error) {
        handleError(res, error);
    }
}

const getCheckoutRegisterSummary = async (req, res) => {
    try {
        const summary = await getSummaryTransaction(req.params.checkoutSessionId);
        res.json({ message: "Ok", summary });

    } catch (error) {
        res.json({ message: error.message });
    }
}

const getSummaryTransaction = async (checkoutSessionId) => {

    const transactions = await CheckoutRegisterRepository.getSummary(checkoutSessionId);
    const payments_cash = await PaymentRepository.summaryPaymentsBySession(checkoutSessionId, PAYMENT_METHOD_CASH)
    
    const { 
        total_amount_cash_starting, 
        total_amount_change, 
        total_amount_in_cash, 
        total_amount_out_cash,
        total_amount_sales,
        real_total_sale,
        total_amount_cancelled } = transactions;

    let total_amount = payments_cash.length > 0? payments_cash[0].getDataValue('total_amount') : 0;
    let total_amount_payments = total_amount !== null? parseFloat(total_amount) : 0;

    let total_amount_cash_ending = ( total_amount_change+total_amount_cash_starting+total_amount_payments+total_amount_in_cash)-total_amount_out_cash;
    
    let summary = { 
        ...transactions, 
        total_amount_cash_ending, 
        total_amount_sales,
        real_total_sale,
        total_amount_cancelled
    };
    
    return summary;
}

module.exports = { 
    findAllByCheckoutSessionId,
    checkStartedTransaction,
    createCheckoutOpen,
    createInAndOutCash,
    getCheckoutRegisterSummary,
    closeCheckoutRegisterTransaction
}