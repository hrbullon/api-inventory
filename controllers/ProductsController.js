
const { handleError, successResponse } = require('../utils/utils');

const ProductRepository = require('../repositories/ProductRepository');

const getAllProducts = async (req, res) => {
    try {
        const products = await ProductRepository.findAll(req);
        successResponse( res, { products });

    } catch (error) {
        handleError(res, error);
    }
}

const getAllProductsWithStock = async (req, res) => {
    try {
        const products = await ProductRepository.findAllWithStock(req);
        successResponse( res, { products });

    } catch (error) {
        handleError(res, error);
    }
}

const getProductById = async (req, res) => {
    try {

        const product = await ProductRepository.findByPk(req.params.id);
        successResponse( res, { product });

    } catch (error) {
        handleError(res, error);
    }
}

const createProduct = async (req, res) => {
    try {

        const product = await ProductRepository.create(req);
        successResponse( res, { product });

    } catch (error) {
        handleError(res, error);
    }
}

const updateProduct = async (req, res) => {
    try {

        const product = ProductRepository.update(req, req.params.id);
        successResponse( res, { product });

    } catch (error) {
        handleError(res, error);
    }
}

const deleteProduct = async (req, res) => {
    try {

        const product = ProductRepository.delete(req.params.id);
        successResponse( res, { product });

    } catch (error) {
        handleError(res, error);
    }
}


module.exports = {
    getProductById,
    createProduct,
    updateProduct,
    getAllProducts,
    deleteProduct,
    getAllProductsWithStock
}