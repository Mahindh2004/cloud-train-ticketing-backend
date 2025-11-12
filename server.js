const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");
const User = require("./models/User");
const Train = require("./models/Train");
const Booking = require("./models/Booking");

const authRoutes = require("./routes/auth");
const trainRoutes = require("./routes/train");
const bookingRoutes = require("./routes/booking");

const app = express();
app.use(cors({
  origin: "*",  // or "http://localhost:3000"
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/bookings", bookingRoutes);

sequelize.sync().then(() => console.log("✅ Database synced"));

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));




