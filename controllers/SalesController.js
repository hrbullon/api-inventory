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
const PaymentRepository = require('../repositories/PaymentsRepository');
const DiscountRepository = require('../repositories/DiscountRepository');

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
        const { checkout_id } = req.body;

        if(checkout_id){
            const checkout = await CheckoutRepository.findByCode(checkout_id);
            req.body.checkout_id = checkout.id;
        }

        let sale = await SaleRepository.create(req, decodedToken.user.id);
        
        successResponse( res, { sale });

    } catch (error) {
        handleError(res, error);
    }
}

const createSaleDetails = async (req, res) => {

    try { 

        let added = await SaleDetailsRepository.create(req.body);
    
        if(added){
            //Decrement stock on products
            await ProductRepository.updateDetails(added, PRODUCT_DECREMENT);
            const sale = await SaleRepository.findByPk(req.body.sale_id);  
            const saleUpdated = await SaleRepository.updateTotalAmountSale(req.body.sale_id, sale.SaleDetails);  
            
            successResponse( res, { sale:  saleUpdated });
        }

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
            sale.description = req.body.description;
            await sale.save();
            
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


        if(sale){

            //Increment stock on products
            await ProductRepository.incrementStock(sale.SaleDetails);

            //Chage states of sale and payments
            await SaleRepository.changeState(id, SALE_STATE_CANCELLED);
            await PaymentRepository.cancelBySale(id);
            await DiscountRepository.cancelBySale(id);
            
            const model = {
                date: sale.date,
                checkout_session_id: sale.checkout_session_id,
                user_id: decodedToken.user.id,
                transaction_id: TRANSACTION_TYPE_CHECKOUT_CANCEL_SALE,
                note: `Venta - ${sale.code} - (ANULADA)`,
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

const deleteSaleDetails = async (req, res) => {
    try {
        const { id, detail } = req.params;

        const destroyed = await SaleRepository.deleteSaleDetails(id, detail);
        const sale = await SaleRepository.findByPk(id);  
        await SaleRepository.updateTotalAmountSale(id, sale.SaleDetails);  

        successResponse( res, { deleted: destroyed } );

    } catch (error) {
        handleError( res, error );
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
    createSaleDetails,
    deleteSaleDetails,
    summarySalesBySession
}