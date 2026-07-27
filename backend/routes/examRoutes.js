const express = require("express");

const router = express.Router();

const {

    addExam,
    getExams,
    updateExam,
    deleteExam

} = require("../controllers/examController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, addExam);

router.get("/", protect, getExams);

router.put("/:id", protect, updateExam);

router.delete("/:id", protect, deleteExam);

module.exports = router;