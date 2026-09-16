const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./backend/config/db");

const authRoutes = require("./backend/routes/authRoutes");
const teacherRoutes = require("./backend/routes/teacherRoutes");
const studentRoutes = require("./backend/routes/studentRoutes");
const roomRoutes = require("./backend/routes/roomRoutes");
const examRoutes = require("./backend/routes/examRoutes");
const batchRoutes = require("./backend/routes/batchRoutes");
const nominalRollRoutes = require("./backend/routes/nominalRollRoutes");
const seatingRoutes = require("./backend/routes/seatingRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/nominal-rolls",nominalRollRoutes);
app.use("/api/seating", seatingRoutes);

// Serve Frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;