const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/skillswap";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
