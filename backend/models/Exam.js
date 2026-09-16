const mongoose = require("mongoose");


// ==========================================
// SUBJECT SCHEMA
// ==========================================

const examSubjectSchema = new mongoose.Schema(
    {
        subjectCode: {
            type: String,
            trim: true,
            uppercase: true,
            default: ""
        },

        subjectName: {
            type: String,
            required: true,
            trim: true
        },

        departments: [
            {
                type: String,
                trim: true
            }
        ]
    },
    {
        _id: false
    }
);


// ==========================================
// EXAM SCHEMA
// ==========================================

const examSchema = new mongoose.Schema(
    {
        // ----------------------------------
        // Common Examination Details
        // ----------------------------------

        examName: {
            type: String,
            required: true,
            trim: true
        },

        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 6
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


        // ----------------------------------
        // Department / Programme Subjects
        // ----------------------------------

        subjects: {
            type: [examSubjectSchema],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length > 0;
                },

                message:
                    "At least one examination subject is required."
            }
        },


        // ----------------------------------
        // Duration
        // ----------------------------------

        duration: {
            type: String,
            default: "1 Hour"
        },


        // ----------------------------------
        // Status
        // ----------------------------------

        status: {
            type: Boolean,
            default: true
        }
    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("Exam", examSchema);