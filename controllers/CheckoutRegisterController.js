
const { handleError, successResponse } = require('../utils/utils');

const CheckoutRegisterRepository = require('../repositories/CheckoutRegisterRepository');

const { TRANSACTION_TYPE_CHECKOUT_OPEN, CHECKOUT_SESSION_STATE_ACTIVE } = require('../const/variables');

const findAllByCheckoutSessionId = async (req, res) => {
    try {
        const { checkoutSessionId } = req.params;
        const checkout_register_items = await CheckoutRegisterRepository.findAllByCheckoutSessionId(checkoutSessionId);
        
        successResponse( res,  checkout_register_items );

    } catch (error) {
        
        handleError( res, error.message )
    }
} 

const checkStartedTransaction = async (req, res) => {
    try {
        let { checkoutId } = req.params;

        let transaction = null;
        
        const started = await CheckoutRegisterRepository.findOneByCheckoutId(checkoutId, TRANSACTION_TYPE_CHECKOUT_OPEN, CHECKOUT_SESSION_STATE_ACTIVE);
        //const closed = await CheckoutRegisterRepository.findOneByCheckoutId(checkoutId, TRANSACTION_TYPE_CHECKOUT_CLOSE);
        
        if(started && !closed){
            transaction = started;
        }
        
        /* if(started && closed){
            transaction = closed;
        } */

        successResponse( res,  { checkout_register: transaction } );

    } catch (error) {
        handleError( res, error.message )
    }
}     

module.exports = { 
    findAllByCheckoutSessionId,
    checkStartedTransaction
}