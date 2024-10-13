const { Op } = require('sequelize');

const { filterFileType } = require('../utils/utils');

require('dotenv').config();

const Category = require("../models/CategoryModel");
const Product = require("../models/ProductModel");

const { 
    PRODUCT_INCREMENT, 
    PRODUCT_DECREMENT, 
    PRODUCT_STATE_DELETED, 
    PRODUCT_STATE_ACTIVE } = require('../const/variables');

class ProductRepository { 

    static async findByPk(id){
        return await Product.findByPk(id, {
            include: [Category]
        });
    }

    static async findAll(req){
        
        let condition = null;
        let { search } = req.query;

        if(Object.entries(req.query).length > 0 ){
            condition = { 
                [Op.or]: [
                    { name: { [Op.like]: `%${search}%` } },
                    { code: { [Op.like]: `%${search}%` } },
                    { description: { [Op.like]: `%${search}%` } },
                    { price: { [Op.like]: `%${search}%` } },
                    { brand: { [Op.like]: `%${search}%` } },
                    { model: { [Op.like]: `%${search}%` } }
                ]
            }
        }    

        const products = await Product.findAll({
            where: condition,
            order: [['name', 'ASC']],
            attributes: ['id','code','name','quantity','price','image']
        });

        return products;
    }

    static async findAllWithStock(){

        const products = await Product.findAll({
            where: {
                quantity: {
                  [Op.gt]: 0, // Apply the condition for quantity greater than 0
                },
            },
            order: [['name', 'ASC']],
            attributes: ['id','code','name','quantity','price','image']
        });

        return products;
    }

    static async updateDetails(item, type){

        return Product.findByPk(item.product_id)
        .then(product => {
            
            if(type == PRODUCT_DECREMENT){
                product.decrement('quantity', { by: item.quantity });
            }
            
            if(type == PRODUCT_INCREMENT){
                product.increment('quantity', { by: item.quantity });
            }
        });
        
    }

    static async incrementStock(products) {

        products.map( item => {

            Product.findByPk(item.product_id)
            .then(product => {
                product.increment('quantity', { by: item.quantity });
            });
        })

    }

    static async create(req){
        
        const model = req.body;
        model.state = PRODUCT_STATE_ACTIVE;

        //Is there file
        if(req.file !== undefined){
            const uploadedFile = filterFileType(req.file);
            //Is valid fileType
            if(!uploadedFile.error){
                model.image = `${process.env.BASE_URL}/images/${uploadedFile.fileName}`
            }
        }else{
            model.image = "https://placehold.co/400";
        }

        if(model.category_id == ""){
            model.category_id = 0;
        }
        
        if(model.code == ""){
            model.code = "S/I";
        }

        return await Product.create(model);
    }

    static async update(req){
        
        const model = req.body;
        
        //Is there file
        if(req.file !== undefined){
            const uploadedFile = filterFileType(req.file);
            //Is valid fileType
            if(!uploadedFile.error){
                model.image = `${process.env.BASE_URL}/images/${uploadedFile.fileName}`
            }
        }else{
            delete model.image;
        }

        if(model.category_id == ""){
            model.category_id = 0;
        }
        
        if(model.code == ""){
            model.code = "S/I";
        }
        
        return await Product.update(req.body, {
            where: {
              id: req.params.id
            }
        });
    }

    static async delete(id) {
        return await Product.update({ state: PRODUCT_STATE_DELETED },{ where: { id } });
    }
}

module.exports = ProductRepository