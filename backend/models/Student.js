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
    },

    batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
    default: null
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Student", studentSchema);