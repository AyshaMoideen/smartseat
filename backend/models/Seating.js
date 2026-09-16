const mongoose = require("mongoose");

const seatingAllocationSchema = new mongoose.Schema(
    {
        registerNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            trim: true,
            default: ""
        },

        semester: {
            type: Number,
            default: null
        },

        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },

        roomNumber: {
            type: String,
            required: true,
            trim: true
        },

        bench: {
            type: Number,
            required: true
        },

        column: {
            type: String,
            required: true,
            enum: ["A", "B"]
        },

        seat: {
            type: String,
            required: true,
            enum: ["A", "B", "C"]
        }
    },
    { _id: false }
);


const seatingSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
            unique: true
        },

        examName: {
            type: String,
            required: true,
            trim: true
        },

        examDate: {
            type: Date,
            required: true
        },

        session: {
            type: String,
            enum: ["Morning", "Afternoon"],
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        allocations: {
            type: [seatingAllocationSchema],
            required: true,
            default: []
        },

        generatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Seating",
    seatingSchema
);