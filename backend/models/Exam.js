const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({

    examName: {
        type: String,
        required: true,
        trim: true
    },

    subjectCode: {
        type: String,
        required: true,
        trim: true
    },

    subjectName: {
        type: String,
        required: true,
        trim: true
    },

    semester: {
        type: Number,
        required: true
    },

    departments: [{
        type: String
    }],

    examDate: {
        type: Date,
        required: true
    },

    session: {
        type: String,
        enum: ["Morning", "Afternoon"],
        required: true
    },

    duration: {
        type: String,
        default: "3 Hours"
    },

    status: {
        type: Boolean,
        default: true
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Exam", examSchema);