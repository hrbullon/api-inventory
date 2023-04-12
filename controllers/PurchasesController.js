const PurchaseDetails = require("../models/PurchaseDetailsModel");
const Purchase = require("../models/PurchaseModel");

const getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll({
            include: [ PurchaseDetails ]
        });
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

        const details = req.body.purchase_details;
        
        delete req.body.code;
        delete req.body.purchase_details;

        const model = { ...req.body };

        model.user_id = 1;
        model.state = "1";
        
        const purchase = await Purchase.create(model);
        const detailsModel = [];
       
        details.map( detail => {
            const item = { purchase_id: purchase.id, ...detail  };
            detailsModel.push(item);
        })
        
        await PurchaseDetails.bulkCreate(detailsModel);
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