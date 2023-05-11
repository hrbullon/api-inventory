const CheckoutRepository = require('../repositories/CheckoutRepository');

const getAllCheckouts = async (req, res) => {
    try {
        const checkouts = await CheckoutRepository.findAll(req);
        res.json({ message: "Ok", checkouts });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getCheckoutById = async (req, res) => {
    try {
        const checkout = await CheckoutRepository.findByPk(req.params.id);
        res.json({ message: "Ok", checkout });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createCheckout = async (req, res) => {
    try {
        const checkout = await CheckoutRepository.create(req);
        res.json({ message: "Ok", checkout });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateCheckout = async (req, res) => {
    try {
        const checkout = await CheckoutRepository.update(req.body, req.params.id);
        res.json({ message: "Ok", checkout });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteCheckout = async (req, res) => {
    try {
        const checkout = await CheckoutRepository.delete(req.params.id);
        res.json({ message: "Ok", checkout });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getCheckoutById,
    createCheckout,
    updateCheckout,
    getAllCheckouts,
    deleteCheckout
}