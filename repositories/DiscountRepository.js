require('dotenv').config();

const { IS_NULL } = require('../const/variables');
const Discount = require("../models/DiscountModel");

class DiscountRepository { 

    static async getAllDiscountsBySale(saleId) {
        return await Discount.findAll({
            where: {sale_id: saleId, deletedAt: IS_NULL}
        });
    }

    static async findById(id) {
        return await Discount.findByPk(id);
    };
    
    static async create(data) {
        data.percentage = ((data.discount*100)/data.total_amount_sale).toFixed(2);
        return await Discount.create(data);
    };
    
    static async destroy(id) {
        return await Discount.destroy({
          where: { id: id} 
        });
    };
}

module.exports = DiscountRepository