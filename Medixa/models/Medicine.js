const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  brandName: { type: String, required: false, default: null },
  genericName: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
});
// Create a unique index to prevent duplicates
medicineSchema.index({ brandName: 1, genericName: 1, unit: 1 }, { unique: true });

// Export the model
module.exports = mongoose.model("Medicine", medicineSchema);
