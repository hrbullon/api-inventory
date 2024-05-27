const sequelize = require("../database/db.js");
const { DataTypes, Model } = require("sequelize");

const Customer = require("./CustomerModel.js");

class Sale extends Model {
    static associate(models) {
        Sale.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        Sale.hasMany(models.SaleDetails, { foreignKey: 'sale_id' });
        Sale.hasMany(models.PaymentDetails, { foreignKey: 'sale_id' });
    }
}
  
Sale.init(
    {   
        code: { type: DataTypes.STRING(10) },
        type_of_sale: { type: DataTypes.ENUM("1","2"), comment: "1->Contado,1->Crédito" } ,
        checkout_session_id: { 
            type: DataTypes.CHAR(36),
            allowNull: true
        },
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
        exchange_amount:{
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        total_amount: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        total_amount_paid: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: true
        },
        total_amount_change: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: true
        },
        total_amount_converted: {
            type: DataTypes.DECIMAL(12,2),
            allowNull: false
        },
        state: { type: DataTypes.ENUM("0","1","2"), comment: "0->Pending,1->Finished,2->Canceled" }
    },
    {
        sequelize,
        modelName: 'Sale',
        tableName: 'sales'
    }
);

module.exports = Sale;