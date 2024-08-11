const SaleRepository = require("../repositories/SaleRepository");
const DiscountRepository = require("../repositories/DiscountRepository");
const { handleError, successResponse } = require("../utils/utils");

const getAllDiscountsBySale = async (req, res) => {
    try {
        const discounts = await DiscountRepository.getAllDiscountsBySale(req.params.saleId);
        successResponse( res, { discounts: discounts } );
    } catch (error) {
        handleError( res, error );
    }
}

const createDiscount = async (req, res) => {
    try {
        const sale = await SaleRepository.findByPk(req.body.sale_id);

        req.body.total_amount_sale = sale.total_amount;
        req.body.total_amount_sale_converted = sale.total_amount_converted;

        const discount = await DiscountRepository.create(req.body);
        successResponse( res, { discount: discount } );
    } catch (error) {
        handleError( res, error );
    }
}

const deleteDiscount = async (req, res) => {
    try {
        const destroyed = await DiscountRepository.destroy(req.params.id);
        successResponse( res, { discount: destroyed } );
    } catch (error) {
        handleError( res, error );
    }
}

module.exports = {
    getAllDiscountsBySale,
    createDiscount, 
    deleteDiscount
}