const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

class ProductDetails extends Model {
    static associate(models) {
        ProductDetails.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
}

ProductDetails.init({
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: { type: DataTypes.STRING(300) },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},
{
    sequelize,
    modelName: 'ProductDetails',
    tableName: 'products_details'
});

module.exports = ProductDetails;