const PaymentDetails = require("../models/PaymentDetailsModel");

class PaymentsRepository { 

    static async createDetails(paymentId, details) {
        
        details.forEach(async (detail) => {
            let item = { ...detail, payment_id: paymentId }
            await PaymentDetails.create(item);
        });
    }

} 

module.exports = PaymentsRepository