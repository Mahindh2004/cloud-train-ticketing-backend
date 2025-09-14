const express = require("express");
const { Op } = require("sequelize");
const Train = require("../models/Train");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
const router = express.Router();

// Add Train (Admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });

    const train = await Train.create(req.body);
    res.json(train);
  } catch (err) {
    console.error("Error adding train:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get Trains with seats availability for any date
router.get("/", async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const travelDate = date || new Date().toISOString().split("T")[0];

    const trains = await Train.findAll({
      where: {
        ...(source && { source: { [Op.like]: `%${source}%` } }),
        ...(destination && { destination: { [Op.like]: `%${destination}%` } }),
      },
    });

    if (!trains.length) return res.json([]); // return empty array if no trains

    const results = await Promise.all(
      trains.map(async (train) => {
        // Try to find booking for that date
        let booking = await Booking.findOne({ where: { train_id: train.train_id, travel_date: travelDate } });

        // If booking not found, create a default system booking
        if (!booking) {
          // Make sure user_id 1 exists, otherwise set to first user in DB
          const userId = 1; 
          booking = await Booking.create({
            train_id: train.train_id,
            travel_date: travelDate,
            seats_available: train.total_seats,
            status: "Booked",
            user_id: userId,
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
    console.error("Error fetching trains:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;




