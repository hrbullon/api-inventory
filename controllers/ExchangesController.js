const { Op } = require('sequelize');
const Exchange = require("../models/ExchangeModel");

const getAllExchanges = async (req, res) => {
    try {

        let condition = null;
        let { search, date } = req.query;

        if(Object.entries(req.query).length > 0 ){
           condition = {
                date: (date)? date : { [Op.gte]:0 },
                [Op.or]: [
                    { description: { [Op.substring]: search } }, //filter by description
                    { amount: { [Op.substring]: search } } //filter by amount
                ]
           }
        }

        const exchanges = await Exchange.findAll({
            where: condition,
            order: [ [ 'date', 'DESC' ]],
            limit: req.params.limit? parseInt(req.params.limit) : null
        });
        res.json({ message: "Ok", exchanges });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getExchangeById = async (req, res) => {
    try {
        const exchange = await Exchange.findByPk(req.params.id);
        res.json({ message: "Ok", exchange });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createExchange = async (req, res) => {
    try {
        const exchange = await Exchange.create(req.body);
        res.json({ message: "Ok", exchange });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateExchange = async (req, res) => {
    try {
        const exchange = await Exchange.update(req.body, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", exchange });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteExchange = async (req, res) => {
    try {
        const exchange = await Exchange.destroy({
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", exchange });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getExchangeById,
    createExchange,
    updateExchange,
    getAllExchanges,
    deleteExchange
}