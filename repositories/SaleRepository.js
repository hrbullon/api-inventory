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

    static async create(req, user) {

        delete req.body.sale_details;
        delete req.body.code;
        delete req.body.date;

        //Get Date
        const date = moment().format("YYYY-MM-DD");

        const model = { ...req.body };
        model.date = date;
        model.user_id = user;
        model.state = "0";

        return await Sale.create(model);
    }

    static async changeState(saleId, state) {
        return await Sale.update({ state: state }, { where: { id: saleId }});
    }

    static async updateTotalPayedAndChange(saleId, totalAmountPayed) {
        
        let sale = await Sale.findByPk(saleId);

        if(sale){
            
            let total_amount_change = (Number(sale.total_amount) - totalAmountPayed);
            
            return await Sale.update(
                { total_amount_payed: totalAmountPayed, total_amount_change }, 
                { where: { id: saleId }}
            );

        } else {
            throw Error("No se ha encontrado la venta solicitada");
        }
    }
}

module.exports = SaleRepository;
