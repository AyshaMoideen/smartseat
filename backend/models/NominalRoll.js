const mongoose = require("mongoose");

const nominalStudentSchema = new mongoose.Schema(
    {
        registerNumber: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        department: {
            type: String,
            required: true,
            trim: true
        },

        semester: {
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
);

const nominalRollSchema = new mongoose.Schema(
    {
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
            unique: true
        },

        students: {
            type: [nominalStudentSchema],
            default: []
        },

        importedOn: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "NominalRoll",
    nominalRollSchema
);