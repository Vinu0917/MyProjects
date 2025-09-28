const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend files

// MongoDB connection
const uri = "mongodb+srv://Medixa_User:Medixa2025@cluster0.1kzorqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // 🔹 Replace with your MongoDB URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Medicine Schema
const medicineSchema = new mongoose.Schema({
    brandName: { type: String, default: null },
    genericName: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 }
});

// Create unique index on genericName + unit (brandName optional)
medicineSchema.index({ genericName: 1, unit: 1 }, { unique: true });

// Medicine Model
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

// Add a new medicine
app.post("/medicines", async (req, res) => {
    try {
        console.log("Incoming medicine:", req.body); // 🔹 Debug log
        const newMedicine = new Medicine(req.body);
        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (err) {
        console.error("Error adding medicine:", err); // 🔹 Debug log
        if (err.code === 11000) { // Duplicate key error
            res.status(400).json({ message: "Medicine already exists!" });
        } else {
            res.status(500).json({ message: "Server error" });
        }
    }
});

// Serve frontend page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "data-entry.html"));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
