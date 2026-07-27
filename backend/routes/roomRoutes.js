const express = require("express");
const router = express.Router();

const {
    addRoom,
    getRooms,
    updateRoom,
    deleteRoom
} = require("../controllers/roomController");

const  protect  = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Routes
router.post("/", addRoom);
router.get("/", getRooms);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

module.exports = router;