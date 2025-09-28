const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ✅ MongoDB connection
const mongoURI = "mongodb+srv://Medixa_User:Medixa2025@cluster0.1kzorqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Routes
const medicineRoutes = require("./routes/medicineRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

app.use("/api/medicines", medicineRoutes);
app.use("/api/prescriptions", prescriptionRoutes);

// Default home page with links to all pages
app.get("/", (req, res) => {
    res.send(`
        <h1>Welcome to Medixa</h1>
        <ul>
            <li><a href="/data-entry.html">💊 Medicine Data Entry</a></li>
            <li><a href="/cashier.html">🧾 Cashier Billing</a></li>
            <li><a href="/prescription.html">📒 Prescription Book</a></li>
        </ul>
    `);
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Medixa server running on http://localhost:${PORT}`);
});
