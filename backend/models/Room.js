const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
{
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    floor: {
        type: Number,
        required: true
    },

    rowsLeft: {
        type: Number,
        required: true
    },

    rowsRight: {
        type: Number,
        required: true
    },

    studentsPerBench: {
        type: Number,
        enum: [2, 3],
        required: true
    },

    maxCapacity: {
        type: Number,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Room", roomSchema);