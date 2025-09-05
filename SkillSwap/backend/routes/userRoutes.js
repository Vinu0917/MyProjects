const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Create new profile
router.post("/", async (req, res) => {
  try {
    const { name, email, teachSkills, learnSkills } = req.body;

    const user = new User({
      name,
      email,
      teachSkills: teachSkills.split(",").map(s => s.trim()),
      learnSkills: learnSkills.split(",").map(s => s.trim())
    });

    await user.save();
    res.json({ message: "Profile saved!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
