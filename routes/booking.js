const express = require("express");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const auth = require("../middleware/auth");
const router = express.Router();

// -----------------------------
// Book a Train
// -----------------------------
router.post("/:trainId", auth, async (req, res) => {
  try {
    const { date, seats } = req.body;
    const { trainId } = req.params;

    const train = await Train.findByPk(trainId);
    if (!train) return res.status(404).json({ msg: "Train not found" });

    // Check available seats
    if (train.total_seats < seats) {
      return res.status(400).json({ msg: "Not enough seats available" });
    }

    // Create booking
    const booking = await Booking.create({
      train_id: trainId,
      user_id: req.user.user_id, // from JWT
      travel_date: date,
      seats_booked: seats,
      status: "Booked",
    });

    // Update seat count
    await train.update({ total_seats: train.total_seats - seats });

    res.json({ msg: "Booking successful", booking });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Get All Bookings for User
// -----------------------------
router.get("/", auth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.user_id },
      include: [{ model: Train }],
      order: [["booking_id", "DESC"]],
    });

    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// Cancel Booking
// -----------------------------
router.put("/cancel/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { booking_id: req.params.id, user_id: req.user.user_id },
      include: [Train],
    });

    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    if (booking.status === "Cancelled") {
      return res.status(400).json({ msg: "Booking already cancelled" });
    }

    // Restore seats
    await booking.Train.update({
      total_seats: booking.Train.total_seats + booking.seats_booked,
    });

    booking.status = "Cancelled";
    await booking.save();

    res.json({ msg: "Booking cancelled", booking });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


