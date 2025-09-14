const express = require("express");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const auth = require("../middleware/auth");
const router = express.Router();

// Book a train
router.post("/:trainId", auth, async (req, res) => {
  try {
    const { date, seats } = req.body;
    const { trainId } = req.params;

    const train = await Train.findByPk(trainId);
    if (!train) return res.status(404).json({ msg: "Train not found" });

    if (train.seats_available < seats) {
      return res.status(400).json({ msg: "Not enough seats available" });
    }

    // Create booking
    const booking = await Booking.create({
      train_id: trainId,
      user_id: req.user.user_id,
      travel_date: date,
      seats_booked: seats,
      status: "Booked",
    });

    // Decrease available seats in Train table
    await train.update({ seats_available: train.seats_available - seats });

    res.json({ msg: "Booking successful", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

