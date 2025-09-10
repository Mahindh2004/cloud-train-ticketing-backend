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

// Get All Trains
router.get("/", async (req, res) => {
  const trains = await Train.findAll();
  res.json(trains);
});

module.exports = router;
