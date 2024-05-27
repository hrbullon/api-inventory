const sequelize = require("../database/db.js")

const { DataTypes, Model, Sequelize } = require("sequelize");

class CheckoutRegister extends Model {
    static associate(models) {
      CheckoutRegister.belongsTo(models.CheckoutSession, { foreignKey: 'checkout_session_id' });
      CheckoutRegister.belongsTo(models.Transaction, { foreignKey: 'transaction_id' });
      CheckoutRegister.belongsTo(models.User, { foreignKey: 'user_id' });
    }
}

CheckoutRegister.init({
    // Model attributes are defined here
    checkout_session_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
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
    total_amount_in: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: true
    },
    total_amount_out: {
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