const express = require("express");
const { Op } = require("sequelize");
const Train = require("../models/Train");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * Add Train (Admin only)
 */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const train = await Train.create(req.body);
    res.json(train);
  } catch (err) {
    console.error("Error adding train:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get Trains with availability for a given date
 */
router.get("/", async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const travelDate = date || new Date().toISOString().split("T")[0];

    // Find trains by optional source/destination
    const trains = await Train.findAll({
      where: {
        ...(source && { source: { [Op.like]: `%${source}%` } }),
        ...(destination && { destination: { [Op.like]: `%${destination}%` } }),
      },
    });

    if (!trains.length) {
      return res.json([]); // no trains found
    }

    // Compute availability for each train
    const results = await Promise.all(
      trains.map(async (train) => {
        // How many seats already booked for this train/date
        const totalBooked = await Booking.sum("seats_booked", {
          where: { train_id: train.train_id, travel_date: travelDate },
        });

        const seatsAvailable = train.seats_available - (totalBooked || 0);

        return {
          ...train.toJSON(),
          travel_date: travelDate,
          seats_available: seatsAvailable,
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







