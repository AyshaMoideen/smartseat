const express = require("express");

const router = express.Router();

const {
    addStudent,
    getStudents
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");

// Protect all student routes
router.use(protect);

// Add Student
router.post("/", addStudent);

// Get All Students
router.get("/", getStudents);

module.exports = router;