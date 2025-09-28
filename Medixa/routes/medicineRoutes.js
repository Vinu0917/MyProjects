const express = require("express");
const router = express.Router();
const Medicine = require("../models/Medicine");

// ✅ Add New Medicine
router.post("/add", async (req, res) => {
  const { brandName, genericName, unit, price } = req.body;

  try {
    // Check duplicates
    const existing = await Medicine.findOne({ brandName, genericName, unit });

    if (existing) {
      return res.json({
        exists: true,
        message: "This medicine already exists. Do you want to delete it?",
      });
    }

    // Save if new
    const medicine = new Medicine({ brandName, genericName, unit, price });
    await medicine.save();
    res.json({ success: true, message: "Medicine added successfully" });
  } catch (error) {
    res.json({ success: false, error });
  }
});

// ✅ Delete Existing Medicine
router.delete("/delete", async (req, res) => {
  const { brandName, genericName, unit } = req.body;

  try {
    await Medicine.deleteOne({ brandName, genericName, unit });
    res.json({ success: true, message: "Medicine deleted" });
  } catch (error) {
    res.json({ success: false, error });
  }
});

module.exports = router;

// Get medicines by generic name
router.get("/search/:genericName", async (req, res) => {
    const { genericName } = req.params;

    try {
        const medicines = await Medicine.find({ genericName });
        res.json({ success: true, medicines });
    } catch (error) {
        res.json({ success: false, error });
    }
});
