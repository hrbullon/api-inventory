const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Exchange extends Model {}

Exchange.init({
    // Model attributes are defined here
    date: {
      type: DataTypes.DATEONLY(),
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Exchange', // We need to choose the model name
    tableName: 'exchanges'
});

module.exports = Exchange;