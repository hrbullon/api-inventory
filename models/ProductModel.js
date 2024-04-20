const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

class Product extends Model {
    static associate(models) {
        Product.hasMany(models.SaleDetails, { foreignKey: 'product_id' });
        Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    }
}

Product.init({
    code: { type: DataTypes.STRING(20) },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    description: { type: DataTypes.STRING(300) },
    category_id: { 
        type: DataTypes.INTEGER(),
        defaultValue: 0
    },
    brand: { type: DataTypes.STRING(45) },
    model: { type: DataTypes.STRING(45) },
    price: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        defaultValue: 0
    },
    image: { type: DataTypes.STRING(150)},
    state: { 
        type: DataTypes.TINYINT(1),
        comment: "0->Inactive, 1->Active"
    }
},
{
    sequelize,
    modelName: 'Product',
    tableName: 'products'
});

module.exports = Product;


