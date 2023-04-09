const sequelize = require("../database/db.js")

const { DataTypes, Model } = require("sequelize");

const User = require("./UserModel.js");
const Role = require("./RoleModel.js");

class RoleUser extends Model {
    static associate(models) {
        RoleUser.belongsTo(models.User, { foreignKey: 'user_id' });
        RoleUser.belongsTo(models.Role, { foreignKey: 'role_id' });
    }
}

RoleUser.init({
    // Model attributes are defined here
    user_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete:'cascade',
        onUpdate:'cascade'
    },
    role_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        references: {
            model: Role,
            key: 'id',
        },
        onDelete:'cascade',
        onUpdate:'cascade'
    }
  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'RoleUser', // We need to choose the model name
    tableName: 'users_roles'
});

module.exports = RoleUser