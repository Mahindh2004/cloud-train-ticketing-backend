const express = require("express");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/:trainId", auth, async (req, res) => {
  try {
    const { date } = req.body;
    const { trainId } = req.params;

    let booking = await Booking.findOne({
      where: { train_id: trainId, travel_date: date },
    });

    if (!booking) {
      const train = await Train.findByPk(trainId);
      if (!train) return res.status(404).json({ msg: "Train not found" });

      booking = await Booking.create({
        train_id: trainId,
        travel_date: date,
        seats_available: train.total_seats,
      });
    }

    if (booking.seats_available <= 0) {
      return res.status(400).json({ msg: "No seats available" });
    }

    booking.seats_available -= 1;
    await booking.save();

    res.json({ msg: "Ticket booked", booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

