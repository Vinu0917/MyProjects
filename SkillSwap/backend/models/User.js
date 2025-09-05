const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  teachSkills: { type: [String], required: true },
  learnSkills: { type: [String], required: true }
});

module.exports = mongoose.model("User", userSchema);
