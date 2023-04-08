const sequelize = require("../database/db.js");
const { Sequelize, DataTypes, Model } = require("sequelize");

const Customer = require("./CustomerModel.js");

class Sale extends Model {
    static associate(models) {
        Sale.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        Sale.hasMany(models.SaleDetails, { foreignKey: 'sale_id' });
    }
}
  
Sale.init(
    {   
        code: { type: DataTypes.STRING(10) },
        date: { 
            type: DataTypes.DATEONLY(),
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        customer_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            references: {
                model: Customer,
                key: 'id',
            },
            onDelete:'cascade',
            onUpdate:'cascade'
        },
        user_id: {
            type: DataTypes.INTEGER(),
            allowNull: false
        },
        exchange_amount:{
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        total_amount: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        total_amount_converted: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
    },
    {
        sequelize,
        modelName: 'Sale',
        tableName: 'sales'
    }
);

module.exports = Sale;