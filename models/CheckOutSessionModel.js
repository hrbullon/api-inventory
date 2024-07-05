const sequelize = require("../database/db.js")

const { DataTypes, Model, Sequelize } = require("sequelize");

class CheckoutSession extends Model {
    static associate(models) {
        CheckoutSession.belongsTo(models.Checkout, { foreignKey: 'checkout_id' });
        CheckoutSession.belongsTo(models.User, { foreignKey: 'user_id' });
        CheckoutSession.hasMany(models.CheckoutRegister, { foreignKey: 'checkout_session_id' });
        CheckoutSession.hasMany(models.DailySales, { foreignKey: 'checkout_session_id' });
    }
}

CheckoutSession.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    checkout_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: Sequelize.NOW
    },
    starting_time: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },
    ending_time: {
      type: DataTypes.DATE,
    },
    state: {
      type: DataTypes.TINYINT,
      comment: '0->Paused, 1->Active, 2->Finished'
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'CheckoutSession', // We need to choose the model name
    tableName: 'checkout_session'
});

module.exports = CheckoutSession