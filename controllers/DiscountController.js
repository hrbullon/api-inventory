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
    try 
    {
        const { sale_id, discount, discount_converted } = req.body;
        const sale = await SaleRepository.findByPk(sale_id);

        req.body.total_amount_sale = sale.total_amount;
        req.body.total_amount_sale_converted = sale.total_amount_converted;

        const created = await DiscountRepository.create(req.body);
        
        const updated = await SaleRepository.updateDiscountAmount({ 
            saleId: sale_id, 
            discount, 
            discountConverted: discount_converted 
        });

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
            const updated = await SaleRepository.substractDiscountAmount({
                saleId: discount.sale_id, 
                discount: discount.discount, 
                discountConverted: discount.discount_converted
            });

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