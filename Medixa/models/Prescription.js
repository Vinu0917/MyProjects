const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  doctorName: { type: String, required: true },
  medicineName: { type: String, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prescription", prescriptionSchema);
