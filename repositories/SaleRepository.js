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

    static async findDetail(id){
        return await SaleDetails.findByPk(id);
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

        model.discount = 0;
        model.discount_converted = 0;

        model.total_amount_paid = 0;
        model.total_amount_paid_converted = 0;
        model.total_amount_change = 0;

        return await Sale.create(model);
    }

    static async changeState(saleId, state) {
        return await Sale.update({ state: state }, { where: { id: saleId }});
    }
    
    static async resetTotalAmountPaidAndChange(saleId) {
        return await Sale.update({ 
            total_amount_paid: 0, 
            total_amount_paid_converted: 0, 
            total_amount_change: 0 
        }, { where: { id: saleId }});
    }

    static async updateTotalAmountSale(saleId, details) {
        
        let sale = await Sale.findByPk(saleId);

        if(sale){
            
            const totalAmount = details.reduce((acum, item) => acum + Number(item.subtotal_amount), 0);
            const totalAmountConverted = details.reduce((acum, item) => acum + Number(item.subtotal_amount_converted), 0);
            
            await Sale.update(
                { 
                    subtotal_amount: totalAmount, 
                    subtotal_amount_converted: totalAmountConverted,
                    total_amount: (totalAmount-Number(sale.discount_amount)), 
                    total_amount_converted: (totalAmountConverted-Number(sale.discount_amount_converted))
                }, 
                { where: { id: saleId }}
            );

            return await this.findByPk(saleId);

        } else {
            throw Error("No se ha encontrado la venta solicitada");
        }
    }

    static async updateDiscountAmount({ saleId, discount, discountConverted }){

        let sale = await this.findByPk(saleId)

        if(sale){

            let discount_amount = (Number(sale.discount_amount)+discount);
            let discount_amount_converted = (Number(sale.discount_amount_converted)+discountConverted);
    
            sale.discount_amount = discount_amount;
            sale.discount_amount_converted = discount_amount_converted;
    
            sale.total_amount = Number(sale.subtotal_amount)-discount_amount;
            sale.total_amount_converted = Number(sale.subtotal_amount_converted)-discount_amount_converted;
            
            return sale.save();
        }
    }

    static async substractDiscountAmount({ saleId, discount, discountConverted }) {

        const sale = await this.findByPk(saleId);

        if(sale){
            
            sale.discount_amount = Number(sale.discount_amount)-Number(discount);
            sale.discount_amount_converted = Number(sale.discount_amount_converted)-Number(discountConverted);
            sale.total_amount = Number(sale.total_amount)+Number(discount);
            sale.total_amount_converted = Number(sale.total_amount_converted)+Number(discountConverted);
            
            return await sale.save();
        }
    }

    static async updateTotalPaidAndChange(saleId, totalAmountPaid) {
        
        let sale = await Sale.findByPk(saleId);

        if(sale){

            let total_amount_change = totalAmountPaid.total_amount > 0 ? (Number(sale.total_amount) - totalAmountPaid.total_amount) : 0;
            let totalPaid = (totalAmountPaid.total_amount)? totalAmountPaid.total_amount : 0;
            let totalPaidConverted = (totalAmountPaid.total_amount_converted)? totalAmountPaid.total_amount_converted : 0;

            return await Sale.update(
                { 
                    total_amount_paid: totalPaid, 
                    total_amount_paid_converted: totalPaidConverted,
                    total_amount_change 
                }, 
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
