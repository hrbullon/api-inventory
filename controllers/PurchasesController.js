const jwt = require('jsonwebtoken');

const Product = require("../models/ProductModel");
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
        const token = req.headers.token;
        const details = req.body.purchase_details;
        
        delete req.body.code;
        delete req.body.purchase_details;

        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);

        const model = { ...req.body };
        model.user_id = decodedToken.user.id;
        model.state = "1";
        
        const purchase = await Purchase.create(model);
        const detailsModel = [];
       
        details.map( detail => {
            const item = { purchase_id: purchase.id, ...detail  };
            detailsModel.push(item);
        })
        
        await PurchaseDetails.bulkCreate(detailsModel);

        //Increment stock on products
        detailsModel.map( item => {
            Product.findByPk(item.product_id)
            .then(product => {
                product.increment('quantity', { by: item.quantity });
            });
        });

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