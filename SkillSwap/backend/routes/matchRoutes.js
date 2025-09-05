const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get matches for a user by email
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.json({ matches: [] });

    const matches = await User.find({
      email: { $ne: user.email },
      teachSkills: { $in: user.learnSkills }
    });

    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
