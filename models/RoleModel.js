const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

class Role extends Model {
    static associate(models) {
        Role.hasMany(models.RoleUser, { foreignKey: 'role_id' });
    }
}

Role.init({
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
    modelName: 'Role', // We need to choose the model name
    tableName: 'roles'
});

module.exports = Role