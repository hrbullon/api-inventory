const { Op } = require('sequelize');

const Product = require("../models/ProductModel");
const filterFileType = require("../utils/utils");
const Category = require("../models/CategoryModel");

require('dotenv').config();

const getAllProducts = async (req, res) => {
    try {

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

        res.json({ message: "Ok", products });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [Category]
        });
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const createProduct = async (req, res) => {
    try {
        
        const model = req.body;

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

        const product = await Product.create(model);

        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
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
        
        const product = await Product.update(req.body, {
            where: {
              id: req.params.id
            }
        });

        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.destroy({
            where: {
              id: req.params.id
            }
        });
        res.json({ message: "Ok", product });
    } catch (error) {
        res.json({ message: error.message });
    }
}


module.exports = {
    getProductById,
    createProduct,
    updateProduct,
    getAllProducts,
    deleteProduct
}