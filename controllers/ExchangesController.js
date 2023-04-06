const Exchange = require("../models/ExchangeModel");

const getAllExchanges = async (req, res) => {
    try {
        const exchanges = await Exchange.findAll();
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