const sequelize = require("../database/db.js");
const { DataTypes, Model } = require("sequelize");

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
        },
        description: { type: DataTypes.STRING(300) },
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
        checkout_id: {
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
        state: { type: DataTypes.ENUM("0","1"), comment: "0->Inactive,1->Active" }
    },
    {
        sequelize,
        modelName: 'Sale',
        tableName: 'sales'
    }
);

module.exports = Sale;