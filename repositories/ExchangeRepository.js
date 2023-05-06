const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Exchange = require("../models/ExchangeModel");

class ExchangeRepository { 

    static async findByPk(id) {
        return await Exchange.findByPk(id,{
            attributes: { exclude: ['createdAt','updatedAt'] }
        });
    }

    static async findAll(req) { 
        
        let condition = null;
        let { search, date } = req.query;

        if(Object.entries(req.query).length > 0 ){
           condition = {
                date: (date)? date : { [Op.gte]:0 },
                [Op.or]: [
                    { description: { [Op.substring]: search } }, //filter by description
                    { amount: { [Op.substring]: search } } //filter by amount
                ]
           }
        }

        const exchanges = await Exchange.findAll({
            where: condition,
            attributes: [ "id", "date", "amount", "description" ],
            order: [ [ 'date', 'DESC' ]]
        });

        return exchanges;
    }

    
    static async save(req, id = null){

        let exchange = null;
        const { body } = req;

        //Create
        if(!id){
            exchange = await Exchange.create(body);
        }else{//Update
            exchange = await Exchange.update(body, { where: {id: id } });
        }

        return exchange;
    }

    static async destroy(id) {
        return await Exchange.destroy({ where: {id: id } });
    }
}

module.exports = ExchangeRepository