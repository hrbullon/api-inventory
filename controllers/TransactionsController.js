const jwt = require('jsonwebtoken');
const moment = require("moment/moment");

const PaymentsRepository = require("../repositories/PaymentsRepository");
const TransactionRepository = require("../repositories/TransactionRepository");

const { PAYMENT_METHOD_CASH, TRANSACTION_TYPE_CHECKOUT_CLOSE, TRANSACTION_TYPE_CHECKOUT_OPEN, TRANSACTION_TYPE_CHECKOUT_IN_CASH } = require("../const/variables");
const DailySalesRepository = require('../repositories/DailySalesRepository');
const CheckoutSessionRepository = require('../repositories/CheckourSessionRepository');
const CheckoutRepository = require('../repositories/CheckoutRepository');

const getAllTransactionBySessionPOS = async (req, res) => {
    try {
        const transactions = await TransactionRepository.findTransactionBySessionPOS(req.params.sessionPOS);
        console.log(transactions);
        res.json({ message: "Ok", transactions });
    } catch (error) {
        res.json({ message: error.message });
    }
} 

const getTransactionSummary = async (req, res) => {
    try {
        const summary = await getSummaryTransaction(req.params.sessionPOS, req.params.date);
        res.json({ message: "Ok", summary });

    } catch (error) {
        res.json({ message: error.message });
    }
}

const getSummaryTransaction = async (sessionPOS, date) => {

    const transactions = await TransactionRepository.getTransactionSummary(sessionPOS);
    const payments_cash = await PaymentsRepository.summaryPaymentsBySession(sessionPOS, PAYMENT_METHOD_CASH)
    
    const { 
        total_amount_cash_starting, 
        total_amount_change, 
        total_amount_in_cash, 
        total_amount_out_cash } = transactions;

    let total_amount = payments_cash[0].getDataValue('total_amount');
    let total_amount_payments = total_amount !== null? parseFloat(total_amount) : 0;

    let total_amount_cash_ending = ( total_amount_change+total_amount_cash_starting+total_amount_payments+total_amount_in_cash)-total_amount_out_cash;

    let summary = { ...transactions, total_amount_cash_ending };
    return summary;
}

const createTransaction = async (req, res) => {
    try {

        let { transaction_id, amount, user_id, checkout_id } = req.body;

        let total_amount_in = (transaction_id == TRANSACTION_TYPE_CHECKOUT_OPEN || transaction_id == TRANSACTION_TYPE_CHECKOUT_IN_CASH)? amount : 0;
        let total_amount_out = (transaction_id == TRANSACTION_TYPE_CHECKOUT_OPEN || transaction_id == TRANSACTION_TYPE_CHECKOUT_IN_CASH)? 0 : amount;

        req.body.total_amount_in = total_amount_in;
        req.body.total_amount_out = total_amount_out;

        let checkout = await CheckoutRepository.findByPk(checkout_id);

        if(transaction_id == TRANSACTION_TYPE_CHECKOUT_OPEN){

            let date = moment().format("YYYY-MM-DD");
            let starting_time = moment();

            const session = { checkout_id: checkout.id, user_id, date, starting_time, state: 1 };
            const sessionPOS = await CheckoutSessionRepository.create(session);
            req.body.checkout_session_id = sessionPOS.id;
        }

        const transaction = await TransactionRepository.create(req.body);
        res.json({ message: "Ok", transaction });

    } catch (error) {
        res.json({ message: error.message });
    }
} 

const checkStartedTransaction = async (req, res) => {
    try {
        let { checkoutId } = req.params;

        let transaction = null;
        
        const started = await TransactionRepository.checkExistTransaction(checkoutId, TRANSACTION_TYPE_CHECKOUT_OPEN);
        const closed = await TransactionRepository.checkExistTransaction(checkoutId, TRANSACTION_TYPE_CHECKOUT_CLOSE);
        
        if(started && !closed){
            transaction = started;
        }
        
        if(started && closed){
            transaction = closed;
        }

        res.json({ message: "Ok", transaction });
    } catch (error) {
        res.json({ message: error.message });
    }
} 

const closeCkeckoutTransaction = async (req, res) => {
    try {
        
        //Getting Headers and Body
        const token = req.headers.token;
        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);

        const { sessionPOS, date } = req.body;

        const checkoutClosed = await TransactionRepository.checkExistTransaction(sessionPOS, TRANSACTION_TYPE_CHECKOUT_CLOSE);
        
        //Check Checkout Closed
        if(!checkoutClosed){

            const checkoutStarted = await TransactionRepository.checkExistTransaction(sessionPOS, TRANSACTION_TYPE_CHECKOUT_OPEN);
            const summary = await getSummaryTransaction(sessionPOS, date);
            
            const dailySale = {
                date:  date,
                user_id: decodedToken.user.id,
                checkout_id: checkoutId,
                ...summary,
            }
    
            const transaction = {
                checkout_id: checkoutId,
                user_id: decodedToken.user.id,
                date: date,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_CLOSE,
                note: checkoutStarted.note.replace('Apertura','Cierre'),
                total_amount_in: 0,
                total_amount_out: summary.total_amount_cash_ending
            }
    
            //Create transaction (CHECKOUT_CLOSE)
            await TransactionRepository.create(transaction);
            //Create DailySale
            const checkoutClosed = await DailySalesRepository.create(dailySale);
            res.json({ message: "Ok", checkoutClosed });
        }else{
            res.json({ message: `Error, la caja ya ha sido cerrada`});
        }

    }catch (error) {
        res.json({ message: error.message });
    }
}

module.exports = { 
    createTransaction,
    getAllTransactionBySessionPOS,
    checkStartedTransaction,
    getTransactionSummary,
    closeCkeckoutTransaction
}