const express = require("express");

const router =
    express.Router();

const {

    getNominalRoll,
    saveNominalRoll,
    deleteStudent,
    clearNominalRoll

} =
    require("../controllers/nominalRollController");

const protect =
    require("../middleware/authMiddleware");


// ==========================================
// GET NOMINAL ROLL
// ==========================================

router.get(
    "/:examId",
    protect,
    getNominalRoll
);


// ==========================================
// SAVE NOMINAL ROLL
// ==========================================

router.post(
    "/",
    protect,
    saveNominalRoll
);


// ==========================================
// DELETE STUDENT
// ==========================================

router.delete(
    "/:examId/student/:regNo",
    protect,
    deleteStudent
);


// ==========================================
// CLEAR ROLL
// ==========================================

router.delete(
    "/:examId",
    protect,
    clearNominalRoll
);


module.exports = router;