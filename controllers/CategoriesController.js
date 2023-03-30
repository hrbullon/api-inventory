const Category = require("../models/CategoryModel");

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
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