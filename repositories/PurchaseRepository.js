const moment = require("moment/moment");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Purchase = require('../models/PurchaseModel');
const PurchaseDetails = require("../models/PurchaseDetailsModel");

class PurchaseRepository { 

    static async findByPk(id) {
        return await Purchase.findByPk(id,{
            include: [ PurchaseDetails ]
        });
    }

    static async findAll(req) {

        let condition = null;
        let today = moment().format("YYYY-MM-DD");
        let { code, document, start_date, end_date } = req.query;
            
        if(Object.entries(req.query).length > 0){
            
            condition = {
                code: { [Op.like]: `%${code}%` },
                document: { [Op.like]: `%${document}%` },
                [Op.and]: [
                    { date: (start_date)? { [Op.gte]: start_date } : { [Op.lte]: today } },
                    { date: (end_date)? { [Op.lte]: end_date } : { [Op.lte]: today } }
                ]
            }
        }

        const sales = await Purchase.findAll(
            { 
                where: condition,
                attributes: { exclude: [ 'createdAt', 'updatedAt' ]},
                include: [ PurchaseDetails ],
                order: [ [ 'id', 'DESC' ]]
            }
        );

        return sales;
    }

    static async create(req, user) {
        
        delete req.body.code;
        delete req.body.purchase_details;

        const model = { ...req.body };
        model.user_id = user;
        model.state = "1";

        return await Purchase.create(model);
    }

    static async createDetails(purchase, details) { 
        
        const detailsModel = [];
       
        details.map( detail => {
            const item = { purchase_id: purchase.id, ...detail  };
            detailsModel.push(item);
        })
        
        return await PurchaseDetails.bulkCreate(detailsModel);
    }
}

module.exports = PurchaseRepository;
