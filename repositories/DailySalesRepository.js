const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require("moment/moment");

const DailySales = require('../models/DailySalesModel');
const Checkout = require('../models/CheckoutModel');
const User = require('../models/UserModel');
const CheckoutSession = require('../models/CheckOutSessionModel');

class DailySalesRepository { 

    static async getAllDailySales(params){

        const { per_page, sort, order } = params;
        const result = await this.getDataQuery({ params: params, orderBy: order, sortDirection: sort ,limit: per_page });

        let dailySales = [];
     
        result.rows.map( item => {
            
            let { firstname, lastname } = item.CheckoutSession.User;

            dailySales.push({
                id: String(item.id),
                date: String(item.date),
                checkout_session_id: String(item.checkout_session_id),
                count_sales: String(item.count_sales),
                total_amount_cash_starting: String(item.total_amount_cash_starting),
                total_amount_sales: String(item.total_amount_sales-item.total_amount_cancelled),
                total_amount_change: String(item.total_amount_change),
                total_amount_in_cash: String(item.total_amount_in_cash),
                total_amount_out_cash: String(item.total_amount_out_cash),
                real_total_sale: String(item.real_total_sale-item.total_amount_cancelled),
                total_amount_cash_ending: String(item.total_amount_cash_ending),
                user: `${firstname} ${lastname}`,
                checkout: String(item.CheckoutSession.Checkout.name)
            });

        });

        const response = {
            sort: sort,
            order: order,
            per_page: per_page,
            totalItems: result.count,
            totalPages: Math.ceil(result.count / per_page),
            items: dailySales,
        }

        return response;
    }

    static getDataQuery = async ({ params, orderBy = 'id', sortDirection = 'DESC', limit = "-1" }) => {
        
        let today = moment().format("YYYY-MM-DD");
        
        let query = { 
            include:[
                {
                    model: CheckoutSession,
                    attributes: ['id','date'],
                    include: [
                        { 
                            model: Checkout, 
                            attributes: ['name'],
                            where: {
                                name: { [Op.like]: `%${params.checkout_register}%` }
                            }
                        },
                        {
                            model: User, 
                            attributes: ['firstname','lastname'],
                            where: {
                                firstname: { [Op.like]: `%${params.user}%` }
                            }
                        },
                    ],
                    required: true,
                }
            ],
            attributes: { exclude: [ 'createdAt', 'updatedAt' ]},
            where: {
                [Op.and]: [
                    { date: (params.start_date)? { [Op.gte]: params.start_date } : { [Op.lte]: today } },
                    { date: (params.end_date)? { [Op.lte]: params.end_date } : { [Op.lte]: today } }
                ]
            },
            order: [ [ orderBy, sortDirection ]]
        }

        if(limit !== "-1"){
            query.limit = Number(limit);
            const offset = (params.page - 1) * limit;
            query.offset = offset;
        }

        return await DailySales.findAndCountAll(query);
    }

    static async create(model){
       return await DailySales.create(model);
    }
}

module.exports = DailySalesRepository;