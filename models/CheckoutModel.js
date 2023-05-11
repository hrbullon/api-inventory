const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Checkout extends Model {
    static associate(models) {
        Checkout.hasMany(models.CheckoutRegister, { foreignKey: 'checkout_id' });
    }
}

Checkout.init({
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Checkout', // We need to choose the model name
    tableName: 'checkouts'
});

module.exports = Checkout