const mongoose = require("mongoose");


// ==========================================
// STUDENT SCHEMA
// ==========================================

const studentSchema = new mongoose.Schema(
    {
        regNo: {
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
            type: String,
            required: true,
            trim: true
        }
    },
    {
        _id: false
    }
);


// ==========================================
// NOMINAL ROLL SCHEMA
// ==========================================

const nominalRollSchema = new mongoose.Schema(
    {
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: true,
            unique: true
        },

        students: {
            type: [studentSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "NominalRoll",
        nominalRollSchema
    );