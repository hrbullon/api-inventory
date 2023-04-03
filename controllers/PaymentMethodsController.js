const PaymentMethod = require("../models/PaymentMethodModel");

const getAllPaymentMethods = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.findAll();
        res.json({ message: "Ok", paymentMethods });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getPaymentMethodById = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.findByPk(req.params.id);
        res.json({ message: "Ok", paymentMethods });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createPaymentMethod = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.create(req.body);
        res.json({ message: "Ok", paymentMethods });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updatePaymentMethod = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.update(req.body, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", paymentMethods });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deletePaymentMethod = async (req, res) => {
    try {
        const paymentMethods = await PaymentMethod.destroy({
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", paymentMethods });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getPaymentMethodById,
    createPaymentMethod,
    updatePaymentMethod,
    getAllPaymentMethods,
    deletePaymentMethod
}