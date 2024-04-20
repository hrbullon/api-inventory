const jwt = require('jsonwebtoken');

const { handleError, successResponse } = require('../utils/utils');

//Repositroy
const SaleRepository = require('../repositories/SaleRepository');
const ProductRepository = require('../repositories/ProductRepository');
const CustomerRepository = require('../repositories/CustomerRepository');
const TransactionRepository = require('../repositories/TransactionRepository');

const { SALE_STATE_COMPLETED, CHECKOUT_SALE, TRANSACTION_TYPE_CHANGE } = require('../const/variables');
const CheckoutRepository = require('../repositories/CheckoutRepository');

const getAllSales = async (req, res) => {
    try {
        let sales = null;

        if(!req.params.details){
            sales = await SaleRepository.findAll(req);
        }else{
            sales = await SaleRepository.findAllDetails(req);
        }

        successResponse( res, { sales });

    } catch (error) {
        handleError(res, error);
    }
}

const getSaleById = async (req, res) => {
    try {

        const sale = await SaleRepository.findByPk(req.params.id);
        successResponse( res, { sale });
        
    } catch (error) {
        handleError(res, error);
    }
}

const createSale = async (req, res) => {
    try {

        //Getting Headers and Body
        const token = req.headers.token;

        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);
        const { checkout_id, sale_details } = req.body;

        if(checkout_id){
            const checkout = await CheckoutRepository.findByCode(checkout_id);
            req.body.checkout_id = checkout.id;
        }

        let sale = await SaleRepository.create(req, decodedToken.user.id);
        let added = await SaleRepository.createDetails(sale, sale_details);

        if(added){
            //Decrement stock on products
            await ProductRepository.updateDetails(sale_details, "decrement");
        }
        
        successResponse( res, { sale });

    } catch (error) {
        handleError(res, error);
    }
}

const closeSale = async (req, res) => {
    
    try { 

        //Getting Headers and Body
        const token = req.headers.token;

        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);
        
        const saleId = req.body.sale_id;  
        let sale = await SaleRepository.findByPk(saleId);
        let { code, checkout_id, total_amount_payed, total_amount_change, state } = sale;

        if(state != "1")
        {
            sale = await SaleRepository.changeState(saleId, SALE_STATE_COMPLETED );
            
            const model = {
                checkout_id: checkout_id,
                user_id: decodedToken.user.id,
                transaction_id: CHECKOUT_SALE,
                note: `Venta - ${code} - (COBRADA)`,
                total_amount_in: total_amount_payed,
                total_amount_out: 0
            };
    
            await TransactionRepository.create(model);
    
            if(total_amount_change < 0){
    
                model.note = `Cambio/Vuelto - ${code}`;
                model.total_amount_in = 0;
                model.transaction_id = TRANSACTION_TYPE_CHANGE,
                model.total_amount_out = total_amount_change;
    
                await TransactionRepository.create(model);
            }

            res.json({ message: "Ok", sale });
        }else{
            res.json({ message: "Error al cerrar una venta finalizada" });
        }

    } catch (error) {
        handleError(res, error);
    }    
}

const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        //Getting Headers and Body
        const token = req.headers.token;

        //Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SEED);
        
        let sale = await SaleRepository.findByPk(id);
        let { code, checkout_id, total_amount } = sale;
        //Get data customer
        const customer = await CustomerRepository.findByPk(sale.customer_id);

        if(sale){
            //Decrement stock on products
            await ProductRepository.updateDetails(sale.SaleDetails, "increment");

            //Chage state of sale
            sale = await SaleRepository.changeState(id);
            
            const model = {
                checkout_id: checkout_id,
                user_id: decodedToken.user.id,
                transaction_id: 6,
                note: `Venta - ${code} - (ANULADA) - ${customer.name}`,
                total_amount_in: sale.total_amount,
                total_amount_out: 0
            };

            await TransactionRepository.create(model);

        }else{
            return res.status(404).json({ message: "Error - Venta no encontrada" });
        }

        res.json({ message: "Ok", sale });
    } catch (error) {
        handleError(res, error);
    }
}

const summarySalesByDate = async (req, res) => {

    const { date } = req.params;
    const summary = await SaleRepository.summarySalesByDate(date);
    res.json( { message: "ok", summary});

}


module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    deleteSale,
    closeSale,
    summarySalesByDate
}