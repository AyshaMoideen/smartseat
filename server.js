const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./backend/config/db");

dotenv.config();

console.log("ENV:", process.env.MONGO_URI);

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve Frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});