const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Train = require("./Train");

const Booking = sequelize.define("Booking", {
  booking_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  train_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Train,
      key: "train_id",
    },
  },
  travel_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  seats_available: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Booked",
  },
});

// associations
Train.hasMany(Booking, { foreignKey: "train_id" });
Booking.belongsTo(Train, { foreignKey: "train_id" });

module.exports = Booking;

