const { Op } = require('sequelize');

const CustomerRepository = require('../repositories/CustomerRepository');

const { successResponse, handleError } = require('../utils/utils');

const getAllCustomers = async (req, res) => {
    try {
        const customers = await CustomerRepository.findAll(req);
        successResponse( res, { customers: customers } );
    } catch (error) {
        handleError( res, error );
    }
}

const getCustomerById = async (req, res) => {
    try {
        const customer = await CustomerRepository.findByPk(req.params.id);
        successResponse( res, { customer: customer } );
    } catch (error) {
        handleError( res, error );
    }
}

const getCustomerByDni = async (req, res) => {
    try {
        const customer = await CustomerRepository.findByDNI(req.params.dni);
        successResponse( res, { customer: customer } );
    } catch (error) {
        handleError( res, error );
    }
}

const createCustomer = async (req, res) => {
    try {
        const customer = await CustomerRepository.create(req.body);
        successResponse( res, { customer: customer } );
    } catch (error) {
        handleError( res, error );
    }
}

const updateCustomer = async (req, res) => {
    try {
        const customer = await CustomerRepository.update(req.body, req.params.id);
        successResponse( res, { customer: customer } );
    } catch (error) {
        handleError( res, error );
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const customer = await CustomerRepository.destroy(req.params.id);
        successResponse( res, { customer: customer } );
    } catch (error) {
        handleError( res, error );
    }
}

module.exports = {
    getCustomerById,
    getCustomerByDni,
    createCustomer,
    updateCustomer,
    getAllCustomers,
    deleteCustomer
}