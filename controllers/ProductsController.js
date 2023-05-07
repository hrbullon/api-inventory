const ProductRepository = require('../repositories/ProductRepository');

const getAllProducts = async (req, res) => {
    try {
        const products = await ProductRepository.findAll(req);
        res.json({ message: "Ok", products });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await ProductRepository.findByPk(req.params.id);
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createProduct = async (req, res) => {
    try {
        const product = await ProductRepository.create(req);
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = ProductRepository.update(req, req.params.id);
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = ProductRepository.delete(req.params.id);
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