const Room = require("../models/Room");

// @desc    Add a new room
// @route   POST /api/rooms
// @access  Private
const addRoom = async (req, res) => {
    try {
        const {
    roomNumber,
    floor,
    rowsLeft,
    rowsRight,
    studentsPerBench
} = req.body;

const maxCapacity = (rowsLeft + rowsRight) * studentsPerBench;

        // Check if room already exists
        const roomExists = await Room.findOne({ roomNumber });

        if (roomExists) {
            return res.status(400).json({
                success: false,
                message: "Room already exists"
            });
        }

        const room = await Room.create({
            roomNumber,
            floor,
            rowsLeft,
            rowsRight,
            studentsPerBench,
            maxCapacity
        });

        res.status(201).json({
            success: true,
            message: "Room added successfully",
            room
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().sort({ roomNumber: 1 });

        res.status(200).json({
            success: true,
            count: rooms.length,
            rooms
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        room.roomNumber = req.body.roomNumber ?? room.roomNumber;
room.floor = req.body.floor ?? room.floor;
room.rowsLeft = req.body.rowsLeft ?? room.rowsLeft;
room.rowsRight = req.body.rowsRight ?? room.rowsRight;
room.studentsPerBench =
    req.body.studentsPerBench ?? room.studentsPerBench;

// Recalculate capacity
room.maxCapacity =
    (room.rowsLeft + room.rowsRight) * room.studentsPerBench;

const updatedRoom = await room.save();

        res.status(200).json({
            success: true,
            message: "Room updated successfully",
            room: updatedRoom
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        await room.deleteOne();

        res.status(200).json({
            success: true,
            message: "Room deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addRoom,
    getRooms,
    updateRoom,
    deleteRoom
};