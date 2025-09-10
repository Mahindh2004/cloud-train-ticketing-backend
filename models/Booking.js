const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Train = require("./Train");

const Booking = sequelize.define("Booking", {
  booking_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  status: { type: DataTypes.STRING, defaultValue: "Booked" }
});

User.hasMany(Booking, { foreignKey: "user_id" });
Booking.belongsTo(User, { foreignKey: "user_id" });

Train.hasMany(Booking, { foreignKey: "train_id" });
Booking.belongsTo(Train, { foreignKey: "train_id" });

module.exports = Booking;
