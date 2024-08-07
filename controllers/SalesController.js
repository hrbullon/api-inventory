const jwt = require('jsonwebtoken');

const { handleError, successResponse } = require('../utils/utils');

//Repositroy
const SaleRepository = require('../repositories/SaleRepository');
const ProductRepository = require('../repositories/ProductRepository');
const CustomerRepository = require('../repositories/CustomerRepository');
const CheckoutRepository = require('../repositories/CheckoutRepository');
const SaleDetailsRepository = require('../repositories/SaleDetailsRepository');

const { 
    SALE_STATE_PENDING, 
    SALE_STATE_COMPLETED,
    PRODUCT_DECREMENT,
    PRODUCT_INCREMENT,
    TRANSACTION_TYPE_CHECKOUT_CANCEL_SALE,
    SALE_STATE_CANCELLED} = require('../const/variables');
const CheckoutRegisterRepository = require('../repositories/CheckoutRegisterRepository');

const getAllSales = async (req, res) => {
    
    try {
    
        let sales = null;

        if(!req.params.details){
            sales = await SaleRepository.findAll(req);
        }else{
            sales = await SaleDetailsRepository.findAll(req);
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
        let added = await SaleDetailsRepository.create(sale, sale_details);

        if(added){
            //Decrement stock on products
            await ProductRepository.updateDetails(sale_details, PRODUCT_DECREMENT);
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

        const saleClone = { ...sale };

        if(sale.state == SALE_STATE_PENDING)
        {
            const totalAmountChange = sale.total_amount_change;
            
            sale = await SaleRepository.changeState(saleId, SALE_STATE_COMPLETED );
            await CheckoutRegisterRepository.createSalePaid(saleClone, decodedToken.user.id);

            if(totalAmountChange < 0){
                await CheckoutRegisterRepository.createSaleAmountChange(saleClone);
            }

            successResponse( res, { sale }); 
        }else{
            handleError(res, { message: "Error al cerrar una venta finalizada" });
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
        //Get data customer
        const customer = await CustomerRepository.findByPk(sale.customer_id);

        if(sale){
            //Decrement stock on products
            await ProductRepository.updateDetails(sale.SaleDetails, PRODUCT_INCREMENT);

            //Chage state of sale
            sale = await SaleRepository.changeState(id, SALE_STATE_CANCELLED);
            
            const model = {
                checkout_id: sale.checkout_id,
                user_id: decodedToken.user.id,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_CANCEL_SALE,
                note: `Venta - ${sale.code} - (ANULADA) - ${customer.name}`,
                total_amount_in: 0,
                total_amount_out: sale.total_amount
            };

            await CheckoutRegisterRepository.create(model)
            successResponse( res, { sale });

        }else{
            return res.status(404).json({ message: "Error - Venta no encontrada" });
        }

    } catch (error) {
        handleError(res, error);
    }
}

const summarySalesBySession = async (req, res) => {

    const { checkout_session_id } = req.params;
    const summary = await SaleDetailsRepository.summarySalesBySession(checkout_session_id);
    successResponse( res, { summary });

}


module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    deleteSale,
    closeSale,
    summarySalesBySession
}