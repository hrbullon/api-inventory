const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Transaction extends Model {
    static associate(models) {
        Transaction.hasMany(models.CheckoutRegister, { foreignKey: 'transaction_id' });
    }
}

Transaction.init({
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Transaction', // We need to choose the model name
    tableName: 'transactions'
});

sequelize.sync()
.then(() => {

  const transactions = [
    {
      name: "CHECKOUT_OPEN",
      description: "Abrir caja"
    },
    {
      name: "CHECKOUT_CLOSE",
      description: "Cerrar caja"
    },
    {
      name: "CHECKOUT_IN_CASH",
      description: "Ingreso de efectivo"
    },
    {
      name: "CHECKOUT_OUT_CASH",
      description: "Retiro de efectivo"
    },
    {
      name: "CHECKOUT_SALE",
      description: "Venta registrada"
    },
    {
      name: "CHECKOUT_CANCEL_SALE",
      description: "Venta anulada"
    }
  ];

  return Transaction.bulkCreate(transactions, { ignoreDuplicates: true });

});

module.exports = Transaction