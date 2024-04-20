
const { handleError, successResponse } = require('../utils/utils');

const ExchangeRepository = require('../repositories/ExchangeRepository');

const getAllExchanges = async (req, res) => {
    try {

        const exchanges = await ExchangeRepository.findAll(req);
        successResponse( res, { exchanges });

    } catch (error) {
        handleError(res, error);
    }
}

const getExchangeById = async (req, res) => {
    try {

        const exchange = await ExchangeRepository.findByPk(req.params.id);
        successResponse( res, { exchange });

    } catch (error) {
        handleError(res, error);
    }
}

const createExchange = async (req, res) => {
    try {

        const exchange = await ExchangeRepository.save(req);
        successResponse( res, { exchange });

    } catch (error) {
        handleError(res, error);
    }
}

const updateExchange = async (req, res) => {
    try {

        const exchange = await ExchangeRepository.save(req, req.params.id);
        successResponse( res, { exchange });

    } catch (error) {
        handleError(res, error);
    }
}

const deleteExchange = async (req, res) => {
    try {
        
        const exchange = await ExchangeRepository.destroy(req.params.id);
        successResponse( res, { exchange });

    } catch (error) {
        handleError(res, error);
    }
}

module.exports = {
    getExchangeById,
    createExchange,
    updateExchange,
    getAllExchanges,
    deleteExchange
}