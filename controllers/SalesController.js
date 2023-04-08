const moment = require("moment/moment");
const Customer = require("../models/CustomerModel");
const SaleDetails = require("../models/SaleDetailsModel");
const Sale = require("../models/SaleModel");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const getAllSales = async (req, res) => {
    try {
        if(!req.params.details){
            const sales = await Sale.findAll(
                { 
                    include: [Customer, SaleDetails],
                    order: [ [ 'createdAt', 'DESC' ]]
                }
            );
            res.json({ message: "Ok", sales });
        }else{

            let condition;

            if(req.params.details == "month"){

                // Get the current year and month
                const year = new Date().getFullYear();
                const month = new Date().getMonth() + 1;

                condition = {
                    date: {
                        [Op.and]: [
                            { [Op.gte]: new Date(year, month - 1, 1) }, // Start of current month
                            { [Op.lt]: new Date(year, month, 1) } // Start of next month
                        ]
                    }
                }

            }

            if(req.params.details == "today"){
                const date = moment().format("YYYY-MM-DD");
                condition = { date: date }
            }

            const sales = await SaleDetails.findAll({
               include: [ {
                model: Sale,
                where: condition
               }],
            });

            res.json({ message: "Ok", sales });
        }
        
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getSaleById = async (req, res) => {
    try {
        const sale = await Sale.findByPk(req.params.id,
            { include: [Customer, SaleDetails] }
        );
        res.json({ message: "Ok", sale });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createSale = async (req, res) => {
    try {

        const { total_amount, exchange_amount} = req.body;
        const details = req.body.sale_details;
        
        delete req.body.sale_details;
        delete req.body.code;
        delete req.body.date;

        const model = { ...req.body };
        model.total_amount_converted = (total_amount/exchange_amount);
        model.user_id = 1;

        const sale = await Sale.create(model);
        const detailsModel = [];
       
        details.map( detail => {
            const item = { sale_id: sale.id, ...detail  };
            detailsModel.push(item);
        })
        
        await SaleDetails.bulkCreate(detailsModel);
        
        res.json({ message: "Ok", sale });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const details = req.body.sale_details;

        delete req.body.sale_details;
        const model = { ...req.body };

        const sale = await Sale.update(model, { where: { id:id }});
        await SaleDetails.destroy({ where: { sale_id:id }});

        const detailsModel = [];
       
        details.map( detail => {
            const item = { sale_id: req.params.id, ...detail  };
            detailsModel.push(item);
        })
        
        await SaleDetails.bulkCreate(detailsModel);

        res.json({ message: "Ok", sale });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteSale = async (req, res) => {
    try {
        const sale = await Sale.destroy({
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", sale });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
}