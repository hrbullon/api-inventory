const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Checkout extends Model {}

Checkout.init({
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
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


  
sequelize.sync()
.then(() => {

  return Checkout.findOrCreate({
      where: { name: "POS001" },
      defaults: {
          name:"POS001"
      }
  });

});

module.exports = Checkout