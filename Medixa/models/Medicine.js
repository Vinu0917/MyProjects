const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  brandName: { type: String, required: false, default: null },
  genericName: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
});
const exists = await Medicine.findOne({
    genericName: data.genericName,
    unit: data.unit,
    brandName: data.brandName // null allowed
});
medicineSchema.index({ brandName: 1, genericName: 1, unit: 1 }, { unique: true });

module.exports = mongoose.model("Medicine", medicineSchema);
