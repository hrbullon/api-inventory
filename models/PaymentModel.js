const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Payment extends Model {

    static associate(models) {

        Payment.belongsTo(models.Customer, { foreignKey: 'customer_id' });
        Payment.belongsTo(models.PaymentMethod, { foreignKey: 'payment_method_id' });
        Payment.belongsTo(models.User, { foreignKey: 'user_id' });

        Payment.hasMany(models.PaymentDetails, { foreignKey: 'payment_id' });
    }
}

Payment.init({
    // Model attributes are defined here
    checkout_session_id: { 
        type: DataTypes.CHAR(36),
        allowNull: true
    },
    customer_id: { 
        type: DataTypes.INTEGER(),
        defaultValue: 0,
        allowNull: false
    },
    payment_method_id: { 
        type: DataTypes.INTEGER(),
        defaultValue: 0,
        allowNull: false
    },
    user_id: { 
        type: DataTypes.INTEGER(),
        defaultValue: 0,
        allowNull: false,
        comment: "Payment created by that user" 
    },
    date: {
        type: DataTypes.DATEONLY(),
        allowNull: false
    },
    reference: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    exchange_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    total_amount_converted: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
    },
    deleted: { type: DataTypes.ENUM("0","1"), comment: "0->Active,1->Deleted" },
    state: { type: DataTypes.ENUM("0","1","2"), comment: "0->Pending,1->Approved,2->Cancelled" }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Payment', // We need to choose the model name
    tableName: 'payments'
});

module.exports = Payment