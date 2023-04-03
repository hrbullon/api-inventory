const Product = require("../models/ProductModel");

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json({ message: "Ok", products });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.update(req.body, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.destroy({
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getProductById,
    createProduct,
    updateProduct,
    getAllProducts,
    deleteProduct
}