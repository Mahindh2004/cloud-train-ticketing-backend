const express = require("express");
const Train = require("../models/Train");
const auth = require("../middleware/auth");
const router = express.Router();

// Add Train (Admin Only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });
  try {
    const train = await Train.create(req.body);
    res.json(train);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Trains with optional filters
router.get("/", async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    let whereClause = {};
    if (source) whereClause.source = source;
    if (destination) whereClause.destination = destination;
    if (date) whereClause.travel_date = date;

    const trains = await Train.findAll({ where: whereClause });
    res.json(trains);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
