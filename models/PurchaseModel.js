const sequelize = require("../database/db.js");
const { DataTypes, Model } = require("sequelize");

class Purchase extends Model {
  static associate(models) {
      Purchase.hasMany(models.PurchaseDetails, { foreignKey: 'purchase_id' });
  }
}

Purchase.init({ 
      code: {
        type: DataTypes.STRING(45),
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY(),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      user_id: {
        type: DataTypes.INTEGER(),
        allowNull: false
      },
      total_amount: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
      },
      state: { type: DataTypes.ENUM("0","1"), comment: "0->Inactive,1->Active" }
    }, 
    {
        sequelize,
        modelName: 'Purchase',
        tableName: 'purchases'
    }
);

module.exports = Purchase;