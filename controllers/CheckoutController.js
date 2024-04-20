
const { handleError, successResponse } = require('../utils/utils');

const CheckoutRepository = require('../repositories/CheckoutRepository');

const getAllCheckouts = async (req, res) => {
    try {
        
        const checkouts = await CheckoutRepository.findAll(req);
        successResponse( res, { checkouts });

    } catch (error) {
        handleError(res, error);
    }
}

const getCheckoutById = async (req, res) => {
    try {

        const checkout = await CheckoutRepository.findByPk(req.params.id);
        successResponse( res, { checkout });

    } catch (error) {
        handleError(res, error);
    }
}

const createCheckout = async (req, res) => {
    try {

        const checkout = await CheckoutRepository.create(req);
        successResponse( res, { checkout });

    } catch (error) {
        handleError(res, error);
    }
}

const updateCheckout = async (req, res) => {
    try {
        
        const checkout = await CheckoutRepository.update(req.body, req.params.id);
        successResponse( res, { checkout });

    } catch (error) {
        handleError(res, error);
    }
}

const deleteCheckout = async (req, res) => {
    try {
        
        const checkout = await CheckoutRepository.delete(req.params.id);
        successResponse( res, { checkout });

    } catch (error) {
        handleError(res, error);
    }
}

module.exports = {
    getCheckoutById,
    createCheckout,
    updateCheckout,
    getAllCheckouts,
    deleteCheckout
}