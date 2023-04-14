const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

const db = {};

let sequelize = require('../database/db');

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

sequelize.sync(); // update database on case on changes

//Create Triggers
sequelize.query("DROP TRIGGER IF EXISTS BEFORE_INSERT_SALES");
sequelize.query("DROP TRIGGER IF EXISTS BEFORE_INSERT_PURCHASES");

sequelize.query(`
CREATE TRIGGER BEFORE_INSERT_SALES
BEFORE INSERT ON sales
FOR EACH ROW
BEGIN
  DECLARE next_id INT;
  SET next_id = (SELECT COUNT(id) FROM sales);
  SET NEW.code = LPAD((next_id+1), 6, '0');
END;
`);

sequelize.query(`
CREATE TRIGGER BEFORE_INSERT_PURCHASES
BEFORE INSERT ON purchases
FOR EACH ROW
BEGIN
  DECLARE next_id INT;
  SET next_id = (SELECT COUNT(id) FROM purchases);
  SET NEW.code = LPAD((next_id+1), 6, '0');
END;
`);

module.exports = db;