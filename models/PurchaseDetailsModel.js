const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

const Product = require("./ProductModel.js");
const Purchase = require("./PurchaseModel.js");

class PurchaseDetails extends Model {
    static associate(models){
        PurchaseDetails.belongsTo(models.Sale, { foreignKey: 'purchase_id' });
        PurchaseDetails.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
}
  
PurchaseDetails.init(
    {   
        purchase_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            references: {
                model: Purchase,
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
        salePrice: { type: DataTypes.DECIMAL(12,2) },
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
        modelName: 'PurchaseDetails',
        tableName: 'purchase_details'
    }
);

module.exports = PurchaseDetails;