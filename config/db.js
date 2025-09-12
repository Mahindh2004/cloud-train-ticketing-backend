const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,     // train_ticketing
  process.env.DB_USER,     // trainuser
  process.env.DB_PASSWORD, // yourpassword
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false
  }
);

module.exports = sequelize;

