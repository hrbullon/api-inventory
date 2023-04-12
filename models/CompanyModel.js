const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Company extends Model {
  static associate(models){
    Company.hasMany(models.User, { foreignKey: 'company_id' });
  }
}

Company.init({
    // Model attributes are defined here
    name: { 
        type: DataTypes.STRING(45),
        allowNull: false
    },
    legal_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    dni: { 
        type: DataTypes.STRING(20),
        allowNull: false
    },
    address: { type: DataTypes.STRING(300) },
    email: { type: DataTypes.STRING(45) },
    phone: { type: DataTypes.STRING(12) },
    web: { type: DataTypes.STRING(60) }

  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Company', // We need to choose the model name
    tableName: 'companies'
});

module.exports = Company