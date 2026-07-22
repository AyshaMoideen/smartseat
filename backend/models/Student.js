const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
{
    registerNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    department: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true
    },

    section: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Student", studentSchema);