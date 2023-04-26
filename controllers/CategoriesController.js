const { Op } = require('sequelize');
const Category = require("../models/CategoryModel");

const getAllCategories = async (req, res) => {
    try {

        const search = req.query.search;
        const condition = search? { name: { [Op.like]: `%${search}%` } } : null;
        const categories = await Category.findAll({ where: condition, order: [ [ 'id', 'DESC' ]] });
        
        res.json({ message: "Ok", categories });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        res.json({ message: "Ok", category });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.json({ message: "Ok", category });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.update(req.body, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", category });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.destroy({
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", category });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getCategoryById,
    createCategory,
    updateCategory,
    getAllCategories,
    deleteCategory
}