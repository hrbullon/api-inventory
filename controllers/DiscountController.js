const SaleRepository = require("../repositories/SaleRepository");
const DiscountRepository = require("../repositories/DiscountRepository");
const { handleError, successResponse } = require("../utils/utils");
const { formatToDecimal } = require("../helpers/util");

const getAllDiscountsBySale = async (req, res) => {
    try {
        const discounts = await DiscountRepository.getAllDiscountsBySale(req.params.saleId);
        successResponse( res, { discounts: discounts } );
    } catch (error) {
        handleError( res, error );
    }
}

const createDiscount = async (req, res) => {
    try 
    {
        const { sale_id, discount, discount_converted } = req.body;
        const sale = await SaleRepository.findByPk(sale_id);

        req.body.total_amount_sale = sale.total_amount;
        req.body.total_amount_sale_converted = sale.total_amount_converted;

        const created = await DiscountRepository.create(req.body);

        await SaleRepository.updateDiscountAmount(sale_id, discount, discount_converted);

        successResponse( res, { discount: created } );

    } catch (error) {
        handleError( res, error );
    }
}

const deleteDiscount = async (req, res) => {
    try {
        
        const discount = await DiscountRepository.findById(req.params.id);

        if(discount)
        {
            const sale = await SaleRepository.findByPk(discount.sale_id);

            sale.discount_amount = Number(sale.discount_amount)-Number(discount.discount);
            sale.discount_amount_converted = Number(sale.discount_amount_converted)-Number(discount.discount_converted);
            sale.total_amount = Number(sale.total_amount)+Number(discount.discount);
            sale.total_amount_converted = Number(sale.total_amount_converted)+Number(discount.discount_converted);
            
            sale.save();

            const destroyed = await DiscountRepository.destroy(req.params.id);
            successResponse( res, { discount: destroyed } );
        }


    } catch (error) {
        handleError( res, error );
    }
}

module.exports = {
    getAllDiscountsBySale,
    createDiscount, 
    deleteDiscount
}