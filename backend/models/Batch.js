const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
    {
        batchName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        prefix: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        startYear: {
            type: Number,
            required: true
        },

        endYear: {
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
    }
);

module.exports = mongoose.model("Batch", batchSchema);