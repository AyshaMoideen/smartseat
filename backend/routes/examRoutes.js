const express = require("express");

const router = express.Router();

const {

    addExam,
    getExams,
    getExamById,
    updateExam,
    deleteExam

} = require("../controllers/examController");

const protect =
    require("../middleware/authMiddleware");


// ==========================================
// EXAMS
// ==========================================

router.post(
    "/",
    protect,
    addExam
);


router.get(
    "/",
    protect,
    getExams
);


router.get(
    "/:id",
    protect,
    getExamById
);


router.put(
    "/:id",
    protect,
    updateExam
);


router.delete(
    "/:id",
    protect,
    deleteExam
);


module.exports = router;