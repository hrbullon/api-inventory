const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

class Discount extends Model {}

Discount.init({
    sale_id: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    percentage: { 
        type: DataTypes.DECIMAL(3,2),
        allowNull: true
    },
    amount: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        comment:'Base amount'
    },
    discount: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true, 
        comment: 'Permite marcar registros como eliminados pero no eliminarlos físicamente'
    }

},{
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Discount', // We need to choose the model name
    tableName: 'discounts'
});

module.exports = Discount;
