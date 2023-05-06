const { Op } = require('sequelize');
const Exchange = require("../models/ExchangeModel");
const ExchangeRepository = require('../repositories/ExchangeRepository');

const getAllExchanges = async (req, res) => {
    try {
        const exchanges = await ExchangeRepository.findAll(req);
        res.json({ message: "Ok", exchanges });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getExchangeById = async (req, res) => {
    try {
        const exchange = await ExchangeRepository.findByPk(req.params.id);
        res.json({ message: "Ok", exchange });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createExchange = async (req, res) => {
    try {
        const exchange = await ExchangeRepository.save(req);
        res.status(201).json({ message: "Ok", exchange });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateExchange = async (req, res) => {
    try {
        const exchange = await ExchangeRepository.save(req, req.params.id);
        res.json({ message: "Ok", exchange });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteExchange = async (req, res) => {
    try {
        const exchange = await ExchangeRepository.destroy(req.params.id);
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