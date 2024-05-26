const CheckoutRegisterRepository = require("../repositories/CheckoutRegisterRepository");

const getSummay = async (checkoutSessionId) => {

    const openChash = await CheckoutRegisterRepository.getTotalAmountOpenCash(checkoutSessionId);

}

module.exports = { getSummay };
