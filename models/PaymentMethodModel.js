const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class PaymentMethod extends Model {
    getName() {
        return this.name.toUpperCase();
    }
    static associate(models) {
      PaymentMethod.hasMany(models.Payment, { foreignKey: 'payment_method_id' });
  }
}

PaymentMethod.init({
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'PaymentMethod', // We need to choose the model name
    tableName: 'payment_methods'
});

module.exports = PaymentMethod