const express = require("express");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const auth = require("../middleware/auth");
const router = express.Router();

// Book a train
router.post("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body; // booking date from frontend
    const userId = req.user.id; // from auth middleware

    const train = await Train.findByPk(id);
    if (!train) return res.status(404).json({ msg: "Train not found" });

    // Create booking
    const booking = await Booking.create({
      train_id: id,
      user_id: userId,
      travel_date: date,
      seats_available: train.seats_available - 1,
      status: "Booked",
    });

    // Decrease available seats
    await train.update({ seats_available: train.seats_available - 1 });

    res.json({ msg: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

