const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

const Sale = require("./SaleModel.js");
const Product = require("./ProductModel.js");

class SaleDetails extends Model {
    static associate(models){
        SaleDetails.belongsTo(models.Sale, { foreignKey: 'sale_id' });
        SaleDetails.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
}
  
SaleDetails.init(
    {   
        sale_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            references: {
                model: Sale,
                key: 'id',
            },
            onDelete:'cascade',
            onUpdate:'cascade'
        },
        product_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            references: {
                model: Product,
                key: 'id',
            },
            onDelete:'cascade',
            onUpdate:'cascade'
        },
        code: {
            type: DataTypes.STRING(150)
        },
        serial: {
            type: DataTypes.STRING(150)
        },
        description: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        quantity: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        subtotal_amount: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        price_converted: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        subtotal_amount_converted: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'SaleDetails',
        tableName: 'sales_details'
    }
);

module.exports = SaleDetails;