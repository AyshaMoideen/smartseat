const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

router.get("/profile", protect, (req, res) => {

    res.json({
        success: true,
        message: "Protected Route Accessed Successfully",
        teacher: req.teacher
    });

});

module.exports = router;