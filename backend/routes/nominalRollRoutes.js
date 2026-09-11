const express = require("express");

const router = express.Router();

const {

    importNominalRoll,

    getNominalRoll,

    deleteNominalStudent

} = require("../controllers/nominalRollController");

const protect =
    require("../middleware/authMiddleware");

// =======================================
// Protect all nominal roll routes
// =======================================

router.use(protect);

// =======================================
// Import students
// =======================================

router.post(
    "/import",
    importNominalRoll
);

// =======================================
// Get nominal roll
// =======================================

router.get(
    "/",
    getNominalRoll
);

// =======================================
// Delete student
// =======================================

router.delete(
    "/:id",
    deleteNominalStudent
);

module.exports = router;