const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

class DailySales extends Model {
    static associate(models) {
        DailySales.belongsTo(models.CheckoutSession, { foreignKey: 'checkout_session_id' });
    }
}

DailySales.init({
    // Model attributes are defined here
    date: { 
        type: DataTypes.DATEONLY(),
        allowNull: false
    },
    checkout_session_id: {
        type: DataTypes.CHAR(36),
        allowNull: false
    },
    count_sales: {
        type: DataTypes.INTEGER(),
        allowNull: false
    },
    total_amount_cash_starting: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    total_amount_sales: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    total_amount_change: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    total_amount_in_cash: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    total_amount_out_cash: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    real_total_sale: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
    total_amount_cash_ending: { 
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'DailySales', // We need to choose the model name
    tableName: 'daily_sales'
});

module.exports = DailySales;