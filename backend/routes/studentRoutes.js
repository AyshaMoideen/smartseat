const express = require("express");

const router = express.Router();

const {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    assignStudentsToBatch,
    fixBatchRegisterPrefixes

} = require("../controllers/studentController");

const protect =
    require("../middleware/authMiddleware");

// Protect all student routes

router.use(protect);

// Add Student

router.post("/", addStudent);

// Get All Students

router.get("/", getStudents);

// Update Student

router.put(
    "/assign-batch",
    assignStudentsToBatch
);

// Fix register prefixes for a specific batch

router.put(
    "/fix-prefix/:batchId",
    fixBatchRegisterPrefixes
);

router.put("/:id", updateStudent);

// Delete Student

router.delete("/:id", deleteStudent);

module.exports = router;