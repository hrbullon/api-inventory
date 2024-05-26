
const { handleError, successResponse } = require('../utils/utils');

const CheckoutRegisterRepository = require('../repositories/CheckoutRegisterRepository');

const findAllByCheckoutSessionId = async (req, res) => {
    try {
        const { checkoutSessionId } = req.params;
        const checkout_register_items = await CheckoutRegisterRepository.findAllByCheckoutSessionId(checkoutSessionId);
        
        successResponse( res,  checkout_register_items );

    } catch (error) {
        
        handleError( res, error.message )
    }
} 

module.exports = { 
    findAllByCheckoutSessionId
}