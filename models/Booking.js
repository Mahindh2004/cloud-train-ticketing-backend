const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Train = require("./Train");
const User = require("./User");

const Booking = sequelize.define(
  "Booking",
  {
    booking_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "Booked" },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "user_id" } },
    train_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Train, key: "train_id" } },
    travel_date: { type: DataTypes.DATEONLY, allowNull: false },
    seats_booked: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "Bookings", timestamps: false }
);

// Associations
Train.hasMany(Booking, { foreignKey: "train_id" });
Booking.belongsTo(Train, { foreignKey: "train_id" });
User.hasMany(Booking, { foreignKey: "user_id" });
Booking.belongsTo(User, { foreignKey: "user_id" });

module.exports = Booking;




