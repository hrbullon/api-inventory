const moment = require("moment/moment");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Sale = require('../models/SaleModel');
const Customer = require("../models/CustomerModel");
const SaleDetails = require("../models/SaleDetailsModel");

class SaleRepository { 

    static async findByPk(id) {
        return await Sale.findByPk(id,{
            include: [ Customer, SaleDetails ]
        });
    }

    static async findAll(req) {

        let condition = null;
        let today = moment().format("YYYY-MM-DD");
        let { code, customer, start_date, end_date } = req.query;
            
        if(Object.entries(req.query).length > 0){
            
            condition = {
                code: { [Op.like]: `%${code}%` },
                [Op.and]: [
                    { date: (start_date)? { [Op.gte]: start_date } : { [Op.lte]: today } },
                    { date: (end_date)? { [Op.lte]: end_date } : { [Op.lte]: today } }
                ]
            }
        }

        const sales = await Sale.findAll(
            { 
                where: condition,
                attributes: { exclude: [ 'createdAt', 'updatedAt' ]},
                include: [
                    {
                        model: Customer,
                        where: {
                          name: { [Op.like]: `%${customer}%` }
                        }
                    },
                    { model: SaleDetails }
                ],
                order: [ [ 'id', 'DESC' ]]
            }
        );

        return sales;
    }

    static async findAllDetails(req) { 
        
        let condition;
        let { code, product } = req.query;
        condition = this.getCondition(req);

        const sales = await SaleDetails.findAll({
            where: {
                code: { [Op.like] : `%${code}%` },
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

    static async create(req, user) {

        delete req.body.sale_details;
        delete req.body.code;
        delete req.body.date;

        //Get Date
        const date = moment().format("YYYY-MM-DD");

        const model = { ...req.body };
        model.date = date;
        model.user_id = user;
        model.state = "1";

        return await Sale.create(model);
    }

    static async changeState(id) {
        return await Sale.update({ state: "0"}, { where: { id }});
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

    static async createDetails(sale, details) {

        const detailsModel = [];

        details.map( detail => {
            const item = { sale_id: sale.id, ...detail  };
            detailsModel.push(item);
        })
        
        return await SaleDetails.bulkCreate(detailsModel);
    }
}

module.exports = SaleRepository;
