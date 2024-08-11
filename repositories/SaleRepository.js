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
    
    static async resetTotalAmountPaidAndChange(saleId) {
        return await Sale.update({ total_amount_paid: 0, total_amount_change: 0 }, { where: { id: saleId }});
    }

    static async updateTotalAmountSale(saleId, details) {
        
        let sale = await Sale.findByPk(saleId);

        if(sale){
            
            const totalAmount = details.reduce((acum, item) => acum + item.subtotal_amount, 0);
            const totalAmountConverted = details.reduce((acum, item) => acum + item.subtotal_amount_converted, 0);
            
            await Sale.update(
                { total_amount: totalAmount, total_amount_converted: totalAmountConverted }, 
                { where: { id: saleId }}
            );

            return await this.findByPk(saleId);

        } else {
            throw Error("No se ha encontrado la venta solicitada");
        }
    }

    static async updateTotalPayedAndChange(saleId, totalAmountPaid) {
        
        let sale = await Sale.findByPk(saleId);

        if(sale){
            
            let total_amount_change = totalAmountPaid > 0 ? (Number(sale.total_amount) - totalAmountPaid) : 0;
            
            return await Sale.update(
                { total_amount_paid: totalAmountPaid, total_amount_change }, 
                { where: { id: saleId }}
            );

        } else {
            throw Error("No se ha encontrado la venta solicitada");
        }
    }

    static async deleteSaleDetails(sale, detail) {
        return await SaleDetails.destroy({
            where: { id: detail, sale_id: sale} 
        });
    }
}

module.exports = SaleRepository;
