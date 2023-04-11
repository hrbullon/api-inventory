const bcrypt = require('bcrypt');

const sequelize = require("../database/db.js")
const { DataTypes, Model } = require("sequelize");

class User extends Model {
    static associate(models){
        User.hasMany(models.RoleUser, { foreignKey: 'user_id' });
    }
}

User.init({
    // Model attributes are defined here
    dni: { 
        type: DataTypes.STRING(20),
        allowNull: false
    },
    firstname: { 
        type: DataTypes.STRING(45),
        allowNull: false
    },
    lastname: { 
        type: DataTypes.STRING(45),
        allowNull: false
    },
    email: { type: DataTypes.STRING(45) },
    phone: { type: DataTypes.STRING(12) },
    address: { type: DataTypes.STRING(100) },
    account: { type: DataTypes.STRING(45) },
    role: { type: DataTypes.TINYINT(1), comment: "1->admin,2->standar" },
    password: { type: DataTypes.STRING(100) },
    state: { type: DataTypes.ENUM("0","1"), comment: "0->Inactive,1->Active" }

  }, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
    tableName: 'users',
    exclude: ['password']
});

  
sequelize.sync()
.then(() => {
    return User.findOrCreate({
        where: { id: 1, account: "admin"},
        defaults: {
            dni:"V20000000",
            firstname:"John",
            lastname:"Doe",
            email:"mail@domain.com",
            phone:"12345678910",
            address:"My address",
            account:"admin",
            role:1,
            password: bcrypt.hashSync("adm123456", 10),
            state:1 }
    });
}).then(([record, created]) => {
    console.log(record.get({
    plain: true
}))
    console.log(created) })

module.exports = User;