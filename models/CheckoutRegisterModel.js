const sequelize = require("../database/db.js")

const { DataTypes, Model, Sequelize } = require("sequelize");

class CheckoutRegister extends Model {
    static associate(models) {
      CheckoutRegister.belongsTo(models.Checkout, { foreignKey: 'checkout_id' });
      CheckoutRegister.belongsTo(models.Transaction, { foreignKey: 'transaction_id' });
      CheckoutRegister.belongsTo(models.User, { foreignKey: 'checkout_id' });
    }
}

CheckoutRegister.init({
    // Model attributes are defined here
    checkout_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_time: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'CheckoutRegister', // We need to choose the model name
    tableName: 'checkout_register'
});

module.exports = CheckoutRegister