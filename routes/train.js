const express = require("express");
const Train = require("../models/Train");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");
const router = express.Router();

// Add Train (Admin Only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Access denied" });

  try {
    const train = await Train.create(req.body);
    res.json(train);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Trains with date-wise availability
router.get("/", async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    let trains = await Train.findAll({
      where: {
        ...(source && { source }),
        ...(destination && { destination }),
      },
    });

    const results = [];
    for (const train of trains) {
      let booking = await Booking.findOne({
        where: { train_id: train.train_id, travel_date: date },
      });

      if (!booking) {
        booking = await Booking.create({
          train_id: train.train_id,
          travel_date: date,
          seats_available: train.total_seats,
        });
      }

      results.push({
        ...train.toJSON(),
        travel_date: booking.travel_date,
        seats_available: booking.seats_available,
      });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

