const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Train = sequelize.define(
  "Train",
  {
    train_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    train_name: { type: DataTypes.STRING, allowNull: false },
    source: { type: DataTypes.STRING, allowNull: false },
    destination: { type: DataTypes.STRING, allowNull: false },
    departure_time: { type: DataTypes.STRING, allowNull: false },
    arrival_time: { type: DataTypes.STRING, allowNull: false },
    base_fare: { type: DataTypes.INTEGER, allowNull: false },
    total_seats: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "Trains",
    timestamps: false,
  }
);

module.exports = Train;



