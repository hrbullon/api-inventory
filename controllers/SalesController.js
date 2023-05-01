const jwt = require('jsonwebtoken');

//Repositroy
const SaleRepository = require('../repositories/SaleRepository');
const ProductRepository = require('../repositories/ProductRepository');

const getAllSales = async (req, res) => {
    try {
        let sales = null;
        if(!req.params.details){
            sales = await SaleRepository.findAll(req);
        }else{
            sales = await SaleRepository.findAllDetails(req);
        }
        return res.json({ message: "Ok", sales });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getSaleById = async (req, res) => {
    try {
        const sale = await SaleRepository.findByPk(req.params.id);
        res.json({ message: "Ok", sale });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createSale = async (req, res) => {
    try {

        //Getting Headers and Body
        const token = req.headers.token;

        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);

        //Getting details
        const details = req.body.sale_details;

        let sale = await SaleRepository.create(req, decodedToken.user.id);
        let added = await SaleRepository.createDetails(sale, details);

        if(added){
            //Decrement stock on products
            await ProductRepository.updateDetails(details, "decrement");
        }
        
        res.json({ message: "Ok", sale });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        
        let sale = await SaleRepository.findByPk(id);

        if(sale){
            //Decrement stock on products
            await ProductRepository.updateDetails(sale.SaleDetails, "increment");

            //Chage state of sale
            sale = await SaleRepository.changeState(id);
        }else{
            return res.status(404).json({ message: "Error - Venta no encontrada" });
        }

        res.json({ message: "Ok", sale });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    deleteSale
}