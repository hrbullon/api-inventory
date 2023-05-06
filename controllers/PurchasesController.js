const jwt = require('jsonwebtoken');

const Product = require("../models/ProductModel");
const Purchase = require("../models/PurchaseModel");
const PurchaseDetails = require("../models/PurchaseDetailsModel");

const ProductRepository = require('../repositories/ProductRepository');
const PurchaseRepository = require('../repositories/PurchaseRepository');

const getAllPurchases = async (req, res) => {
    try {
        const purchases = await PurchaseRepository.findAll(req);
        res.json({ message: "Ok", purchases });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getPurchaseById = async (req, res) => {
    try {
        const purchase = await PurchaseRepository.findByPk(req.params.id);
        res.json({ message: "Ok", purchase });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createPurchase = async (req, res) => {
    try {

        //Getting Headers and Body
        const token = req.headers.token;

        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);

        //Getting details
        const details = req.body.purchase_details;

        let purchase = await PurchaseRepository.create(req, decodedToken.user.id);
        let added = await PurchaseRepository.createDetails(purchase, details);

        if(added){
            //Increment stock on products
            await ProductRepository.updateDetails(details, "increment");
        }
        res.status(201).json({ message: "Ok", purchase });

    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateDetails = (items, type) => {
    items.map( item => {
        Product.findByPk(item.product_id)
        .then(product => {
            if(type == "increment"){
                product.increment('quantity', { by: item.quantity });
            }

            if(type == "decrement"){
                product.decrement('quantity', { by: item.quantity });
            }
            
            if(item.salePrice !== "" && product.price !== item.salePrice){
                product.price = item.salePrice;
                product.save();
            }
        });
    });
}

const deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        
        let purchase = await Purchase.findByPk(id,{
            include: [ PurchaseDetails ]
        });

        if(purchase){
            //Decrement stock on products
            updateDetails(purchase.PurchaseDetails, "decrement");

            //Chage state of purchase
            purchase = await Purchase.update({ state: "0"}, { where: { id }});
        }else{
            return res.status(404).json({ message: "Error - Compra no encontrada" });
        }

        res.json({ message: "Ok", purchase });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getPurchaseById,
    createPurchase,
    getAllPurchases,
    deletePurchase
}