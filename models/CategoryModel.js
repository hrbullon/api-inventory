const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Category extends Model {
    getDescription() {
        return this.description.toUpperCase();
    }
}

Category.init({
    // Model attributes are defined here
    description: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Category', // We need to choose the model name
    tableName: 'categories'
});

module.exports = Category