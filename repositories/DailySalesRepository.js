const Sequelize = require('sequelize');

const DailySales = require('../models/DailySalesModel');
const Checkout = require('../models/CheckoutModel');
const User = require('../models/UserModel');

class DailySalesRepository { 

    static async getAllDailySales(body){
        return await DailySales.findAll(
            { 
                attributes: { exclude: [ 'createdAt', 'updatedAt' ]},
                include: [ 
                    {
                        model: Checkout
                    },
                    {
                        attributes:['id','firstname','lastname','account'],
                        model: User
                    },
                 ],
                order: [ [ 'id', 'DESC' ]]
            }
        );
    }

    static async create(model){
       return await DailySales.create(model);
    }
}

module.exports = DailySalesRepository;