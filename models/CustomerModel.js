const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

class Customer extends Model {
  static associate(models){
    Customer.hasMany(models.Sale, { foreignKey: 'customer_id' });
  }
}

Customer.init({
    // Model attributes are defined here
    firstname: { 
        type: DataTypes.STRING(45),
        allowNull: false
    },
    lastname: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    dni: { 
        type: DataTypes.STRING(20),
        allowNull: false
    },
    address: { type: DataTypes.STRING(100) },
    email: { type: DataTypes.STRING(45) },
    phone: { type: DataTypes.STRING(12) }

  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Customer', // We need to choose the model name
    tableName: 'customers'
});

module.exports = Customer;