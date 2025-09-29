const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
const uri = "mongodb+srv://Medixa_User:Medixa2025@cluster0.1kzorqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Medicine Schema
const medicineSchema = new mongoose.Schema({
    brandName: { type: String, default: null },
    genericName: { type: String, required: true },
    unit: { type: String, required: true },
    strength: { type: String, default: null }, // New field
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 }
});

// Unique index on genericName + unit + strength (brandName optional)
medicineSchema.index({ genericName: 1, unit: 1, strength: 1, brandName: 1 }, { unique: true, sparse: true });

const Medicine = mongoose.model("Medicine", medicineSchema);

// Routes

// Get all medicines
app.get("/medicines", async (req, res) => {
    try {
        const medicines = await Medicine.find().sort({ genericName: 1 });
        res.json(medicines);
    } catch (err) {
        console.error("Error fetching medicines:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Add new medicine
app.post("/medicines", async (req, res) => {
    try {
        console.log("Incoming medicine:", req.body);
        const newMedicine = new Medicine(req.body);
        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (err) {
        console.error("Error adding medicine:", err);
        if (err.code === 11000) {
            res.status(409).json({
                message: "A medicine with the same generic name, unit, strength, and brand already exists."
            });
        }else {
            res.status(500).json({ message: "Server error" });
        }
    }
});

// Delete a medicine
app.delete("/medicines/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medicine.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (err) {
    console.error("Error deleting medicine:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Serve frontend page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "data-entry.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
