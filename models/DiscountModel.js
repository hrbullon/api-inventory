const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

class Discount extends Model {}

Discount.init({
    sale_id: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    checkout_session_id: { 
        type: DataTypes.CHAR(36),
        allowNull: true
    },
    description: { type: DataTypes.STRING(300) },
    percentage: { 
        type: DataTypes.DECIMAL(3,2),
        allowNull: true
    },
    total_amount_sale: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        comment:'Base amount'
    },
    total_amount_sale_converted: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false,
        comment:'Base amount'
    },
    discount: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    discount_converted: { 
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
