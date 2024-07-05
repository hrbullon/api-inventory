const moment = require("moment/moment");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Sale = require('../models/SaleModel');
const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const SaleDetails = require("../models/SaleDetailsModel");

class SaleDetailsRepository {

    static async findAll(req) { 
        
        let condition;
        let { code, product } = req.query;
        condition = this.getCondition(req);

        const sales = await SaleDetails.findAll({
            where: {
                code: { [Op.like]: `%${code}%`}, 
                description: { [Op.like] : `%${product}%` }
            },
            include: [ 
                {
                    model: Sale,
                    where: condition
                }
            ],
        });

        return sales;

    }

    static async create(sale, details) {

        const detailsModel = [];

        details.map( detail => {
            const item = { sale_id: sale.id, ...detail  };
            detailsModel.push(item);
        })
        
        return await SaleDetails.bulkCreate(detailsModel);
    }

    static async summarySalesBySession(checkoutSessionId) {

        const sales = await SaleDetails.findAll({
            attributes: [
              [Sequelize.literal('Product.name'), 'product'],
              [Sequelize.fn('SUM', Sequelize.col('SaleDetails.quantity')), 'quantity'],
              [Sequelize.fn('SUM', Sequelize.col('SaleDetails.subtotal_amount')), 'total_amount'],
              [Sequelize.fn('SUM', Sequelize.col('SaleDetails.subtotal_amount_converted')), 'total_amount_converted'],
            ],
            include: [
              {
                model: Sale,
                attributes: [],
                where: { checkout_session_id: checkoutSessionId },
              },
              {
                model: Product,
                attributes: [],
                include: [{ model: Category, attributes: ['name']}],
              },
            ],
            group: ['product_id'],
        });

        return sales;
    }

    static getCondition(req) {
    
        let condition = null;
        let { details } = req.params;
        let { sale_code } = req.query;

        let today = moment().format("YYYY-MM-DD");
    
        switch (details) {
            case "today":
                condition = {
                    code: { [Op.like]: `%${sale_code}%` }, 
                    date: today 
                }
            break;
            
            case "month":
                // Get the current year and month
                const year = new Date().getFullYear();
                const month = new Date().getMonth() + 1;
    
                condition = {
                    code: { [Op.like]: `%${sale_code}%` },
                    date: {
                        [Op.and]: [
                            { [Op.gte]: new Date(year, month - 1, 1) }, // Start of current month
                            { [Op.lt]: new Date(year, month, 1) } // Start of next month
                        ]
                    }
                }
            break;
        }
    
        return condition;
    }


}

module.exports = SaleDetailsRepository;