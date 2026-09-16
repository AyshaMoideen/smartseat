const express = require("express");

const router = express.Router();

const {

    saveSeating,
    findStudentSeat,
    clearSeating

} = require("../controllers/seatingController");

const protect =
    require("../middleware/authMiddleware");


// ==========================================
// TEACHER ROUTES
// ==========================================

router.post(
    "/save",
    protect,
    saveSeating
);


router.delete(
    "/:examId",
    protect,
    clearSeating
);


// ==========================================
// PUBLIC STUDENT ROUTE
// ==========================================

router.get(
    "/public/:registerNumber",
    findStudentSeat
);


module.exports = router;