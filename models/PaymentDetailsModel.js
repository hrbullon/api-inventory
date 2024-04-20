const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class PaymentDetails extends Model {
    static associate(models) {
        PaymentDetails.belongsTo(models.Payment, { foreignKey: 'payment_id' });
        PaymentDetails.belongsTo(models.Sale, { foreignKey: 'sale_id' });
    }
}

PaymentDetails.init({
    // Model attributes are defined here
    payment_id: { 
        type: DataTypes.INTEGER(),
        defaultValue: 0,
        allowNull: false
    },
    sale_id: { 
        type: DataTypes.INTEGER(),
        defaultValue: 0,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    total_amount_converted: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'PaymentDetails', // We need to choose the model name
    tableName: 'payments_details'
});

module.exports = PaymentDetails