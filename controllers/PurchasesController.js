const jwt = require('jsonwebtoken');

const { handleError, successResponse } = require('../utils/utils');

const ProductRepository = require('../repositories/ProductRepository');
const PurchaseRepository = require('../repositories/PurchaseRepository');

const getAllPurchases = async (req, res) => {
    try {

        const purchases = await PurchaseRepository.findAll(req);
        successResponse( res, { purchases });

    } catch (error) {
        handleError(res, error);
    }
}

const getPurchaseById = async (req, res) => {
    try {

        const purchase = await PurchaseRepository.findByPk(req.params.id);
        successResponse( res, { purchase });

    } catch (error) {
        handleError(res, error);
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
        handleError(res, error);
    }
}

const deletePurchase = async (req, res) => {
    try {
        const { id } = req.params;
        
        let purchase = await PurchaseRepository.findByPk(id);

        if(purchase){
            //Decrement stock on products
            await ProductRepository.updateDetails(purchase.PurchaseDetails, "decrement");

            //Chage state of purchase
            purchase.state = "0";
            purchase.save();
        }else{
            return res.status(404).json({ message: "Error - Compra no encontrada" });
        }

        successResponse( res, { purchase });

    } catch (error) {
        handleError(res, error);
    }
}

module.exports = {
    getPurchaseById,
    createPurchase,
    getAllPurchases,
    deletePurchase
}