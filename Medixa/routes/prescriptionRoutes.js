const express = require("express");
const router = express.Router();
const Prescription = require("../models/Prescription");
const ExcelJS = require("exceljs");

// Add prescription record
router.post("/add", async (req, res) => {
  const { patientName, age, doctorName, medicineName, unit, price } = req.body;

  try {
    const record = new Prescription({ patientName, age, doctorName, medicineName, unit, price });
    await record.save();
    res.json({ success: true, message: "Prescription record saved" });
  } catch (error) {
    res.json({ success: false, error });
  }
});

// Download all prescription records as Excel
router.get("/download", async (req, res) => {
  try {
    const records = await Prescription.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Prescriptions");

    // Columns
    worksheet.columns = [
      { header: "Patient Name", key: "patientName", width: 20 },
      { header: "Age", key: "age", width: 5 },
      { header: "Doctor Name", key: "doctorName", width: 20 },
      { header: "Medicine Name", key: "medicineName", width: 20 },
      { header: "Unit", key: "unit", width: 10 },
      { header: "Price", key: "price", width: 10 },
      { header: "Date", key: "date", width: 20 }
    ];

    // Add rows
    records.forEach(r => {
      worksheet.addRow({
        patientName: r.patientName,
        age: r.age,
        doctorName: r.doctorName,
        medicineName: r.medicineName,
        unit: r.unit,
        price: r.price,
        date: r.date.toLocaleString()
      });
    });

    // Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=prescriptions.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send("Error generating Excel file");
  }
});

module.exports = router;
