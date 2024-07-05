const Sequelize = require('sequelize');

const DailySales = require('../models/DailySalesModel');
const Checkout = require('../models/CheckoutModel');
const User = require('../models/UserModel');
const CheckoutSession = require('../models/CheckOutSessionModel');

class DailySalesRepository { 

    static async getAllDailySales(){

        const result = await DailySales.findAll(
            { 
                include:[
                    {
                        model: CheckoutSession,
                        attributes: ['id','date'],
                        include: [
                            { model: Checkout, attributes: ['name'] },
                            { model: User, attributes: ['firstname','lastname'] },
                        ]
                    }
                ],
                attributes: { exclude: [ 'createdAt', 'updatedAt' ]},
                order: [ [ 'id', 'DESC' ]]
            }
        );

        let dailySales = [];
        
        result.map( item => {
            
            let { firstname, lastname } = item.CheckoutSession.User;

            dailySales.push({
                id: item.id,
                date: item.date,
                checkout_session_id: item.checkout_session_id,
                count_sales: item.count_sales,
                total_amount_cash_starting: item.total_amount_cash_starting,
                total_amount_sales: item.total_amount_sales,
                total_amount_change: item.total_amount_change,
                total_amount_in_cash: item.total_amount_in_cash,
                total_amount_out_cash: item.total_amount_out_cash,
                real_total_sale: item.real_total_sale,
                total_amount_cash_ending: item.total_amount_cash_ending,
                user: `${firstname}  ${lastname}`,
                checkout: item.CheckoutSession.Checkout.name
            });

        });

        return dailySales;
    }

    static async create(model){
       return await DailySales.create(model);
    }
}

module.exports = DailySalesRepository;