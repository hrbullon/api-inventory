const Purchase = require("../models/PurchaseModel");

const getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll();
        res.json({ message: "Ok", purchases });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getPurchaseById = async (req, res) => {
    try {
        const purchase = await Purchase.findByPk(req.params.id);
        res.json({ message: "Ok", purchase });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createPurchase = async (req, res) => {
    try {
        const purchase = await Purchase.create(req.body);
        res.status(201).json({ message: "Ok", purchase });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updatePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.update(req.body, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", purchase });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deletePurchase = async (req, res) => {
    try {
        const purchase = await Purchase.update({
            state: req.params.action
        }, {
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", purchase });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getPurchaseById,
    createPurchase,
    updatePurchase,
    getAllPurchases,
    deletePurchase
}