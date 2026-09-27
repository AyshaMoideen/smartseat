const mongoose = require("mongoose");

// ==========================================
// EXAM SUBJECT SCHEMA
// ==========================================

const examSubjectSchema = new mongoose.Schema(
    {
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: true
        },

        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 6
        },

        department: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

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
        }
    },
    {
        _id: false
    }
);


// ==========================================
// PARTICIPATING BATCH / SEMESTER
// ==========================================

const participatingSemesterSchema = new mongoose.Schema(
    {
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: true
        },

        batchName: {
            type: String,
            required: true,
            trim: true
        },

        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 6
        }
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
        // Participating Batch + Semester
        // ----------------------------------

        participatingSemesters: {
            type: [participatingSemesterSchema],
            required: true,
            validate: {
                validator: function (value) {
                    return Array.isArray(value) && value.length > 0;
                },

                message:
                    "At least one batch and semester must participate."
            }
        },


        // ----------------------------------
        // Examination Subjects
        // ----------------------------------

        subjects: {
            type: [examSubjectSchema],
            required: true,

            validate: {
                validator: function (value) {
                    return Array.isArray(value) && value.length > 0;
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