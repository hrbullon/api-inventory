require('dotenv').config();

const Discount = require("../models/DiscountModel");

class DiscountRepository { 

    static async getAllDiscountsBySale(saleId) {
        return await Discount.findAll({
            where: {sale_id: saleId}
        });
    }

    static async create(data) {
        data.percentage = ((data.discount*100)/data.amount).toFixed(2);
        return await Discount.create(data);
    };
    
    static async destroy(id) {
        return await Discount.destroy({
          where: { id: id} 
        });
    };
}

module.exports = DiscountRepository