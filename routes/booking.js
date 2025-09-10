const express = require("express");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const auth = require("../middleware/auth");
const router = express.Router();

// Book a Train
router.post("/:train_id", auth, async (req, res) => {
  try {
    const train = await Train.findByPk(req.params.train_id);
    if (!train || train.seats_available <= 0) {
      return res.status(400).json({ msg: "No seats available" });
    }

    train.seats_available -= 1;
    await train.save();

    const booking = await Booking.create({
      user_id: req.user.id,
      train_id: train.train_id,
      status: "Booked"
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View My Bookings
router.get("/", auth, async (req, res) => {
  const bookings = await Booking.findAll({ where: { user_id: req.user.id }, include: [Train] });
  res.json(bookings);
});

// Cancel Booking
router.put("/cancel/:id", auth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.id);
  if (!booking || booking.user_id !== req.user.id) return res.status(403).json({ msg: "Not authorized" });

  booking.status = "Cancelled";
  await booking.save();
  res.json(booking);
});

module.exports = router;
