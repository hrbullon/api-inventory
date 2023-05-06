const Product = require("../models/ProductModel");

class ProductRepository { 

    static async updateDetails(items, type){
        items.map( item => {
            Product.findByPk(item.product_id)
            .then(product => {
                if(type == "increment"){
                    product.increment('quantity', { by: item.quantity });

                    if(item.salePrice !== "" && product.price !== item.salePrice){
                        product.price = item.salePrice;
                        product.save();
                    }
                }
    
                if(type == "decrement"){
                    product.decrement('quantity', { by: item.quantity });
                }
            });
        });
    }
}

module.exports = ProductRepository