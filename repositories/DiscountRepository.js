require('dotenv').config();

const { IS_NULL, DISCOUNT_STATE_CANCELLED, DISCOUNT_STATE_ACTIVE } = require('../const/variables');
const Discount = require("../models/DiscountModel");

class DiscountRepository { 

    static async getAllDiscountsBySale(saleId) {
        return await Discount.findAll({
            where: {sale_id: saleId, deletedAt: IS_NULL}
        });
    }
    
    static async getAllDiscountsByCheckouSession(checkoutSessionId) {
        return await Discount.findAll({
            where: {
                checkout_session_id: checkoutSessionId, 
                state: DISCOUNT_STATE_ACTIVE,
                deletedAt: IS_NULL
            }
        });
    }

    static async findById(id) {
        return await Discount.findByPk(id);
    };
    
    static async create(data) {
        data.state = DISCOUNT_STATE_ACTIVE;
        data.percentage = ((data.discount*100)/data.total_amount_sale).toFixed(2);
        return await Discount.create(data);
    };
    
    static async destroy(id) {
        return await Discount.destroy({
          where: { id: id} 
        });
    };
    
    static async cancelBySale(saleId){

        return await Discount.update({
            state: DISCOUNT_STATE_CANCELLED
        },{ 
            where: { sale_id: saleId } 
        });
    }
}

module.exports = DiscountRepository