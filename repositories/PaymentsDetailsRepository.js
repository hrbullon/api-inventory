const PaymentDetails = require("../models/PaymentDetailsModel");

class PaymentDetailsRepository { 

    static async create(paymentId, details) {
        
        details.forEach(async (detail) => {
            let item = { ...detail, payment_id: paymentId }
            await PaymentDetails.create(item);
        });
    }

} 

module.exports = PaymentDetailsRepository