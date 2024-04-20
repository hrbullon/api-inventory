
const { handleError, successResponse } = require('../utils/utils');

const CategoryRepository = require('../repositories/CategoryRepository');

const getAllCategories = async (req, res) => {
    try {

        const { search } = req.query;
        const categories = await CategoryRepository.findAll({ search });
        successResponse( res, { categories });

    } catch (error) {
        handleError(res, error);
    }
}

const getCategoryById = async (req, res) => {
    try {
        
        const { id } = req.params;
        const category = await CategoryRepository.findByPk({ id });
        successResponse( res, { category });

    } catch (error) {
        handleError(res, error);
    }
}

const createCategory = async (req, res) => {
    try {
        
        const category = await CategoryRepository.create({ model: req.body });
        successResponse( res, { category });

    } catch (error) {
        handleError(res, error);
    }
}

const updateCategory = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { body } = req;

        const category = CategoryRepository.update({ model: body, id: id });
        successResponse( res, { category });

    } catch (error) {
        handleError(res, error);
    }
}

module.exports = {
    getCategoryById,
    createCategory,
    updateCategory,
    getAllCategories
}