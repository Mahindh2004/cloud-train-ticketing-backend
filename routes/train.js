const express = require("express");
const { Op } = require("sequelize");
const Train = require("../models/Train");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
const router = express.Router();

// Add Train (Admin Only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const train = await Train.create(req.body);
    res.json(train);
  } catch (err) {
    console.error("Error adding train:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Trains with date-wise availability
router.get("/", async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const travelDate = date || new Date().toISOString().split("T")[0];

    // Fetch trains with optional filters
    const trains = await Train.findAll({
      where: {
        ...(source && { source: { [Op.like]: `%${source}%` } }),
        ...(destination && { destination: { [Op.like]: `%${destination}%` } }),
      },
    });

    // For each train, get or create booking for the travel date
    const results = await Promise.all(
      trains.map(async (train) => {
        let booking = await Booking.findOne({
          where: { train_id: train.train_id, travel_date: travelDate },
        });

        if (!booking) {
          // Create default booking
          booking = await Booking.create({
            train_id: train.train_id,
            travel_date: travelDate,
            seats_available: train.total_seats,
            status: "Booked",
            user_id: 1, // default system user
          });
        }

        return {
          ...train.toJSON(),
          travel_date: booking.travel_date,
          seats_available: booking.seats_available,
        };
      })
    );

    res.json(results);
  } catch (err) {
    console.error("Error fetching trains:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



