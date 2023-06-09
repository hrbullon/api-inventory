const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Category extends Model {
    getName() {
        return this.name.toUpperCase();
    }
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: 'category_id' });
    }
}

Category.init({
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
    modelName: 'Category', // We need to choose the model name
    tableName: 'categories'
});

module.exports = Category