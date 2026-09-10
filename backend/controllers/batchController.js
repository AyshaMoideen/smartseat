const Batch = require("../models/Batch");

/* ==========================================
   ADD BATCH
   POST /api/batches
========================================== */

const addBatch = async (req, res) => {

    try {

        const {
            batchName,
            prefix,
            startYear,
            endYear,
            isActive
        } = req.body;


        // Validate required fields

        if (
            !batchName ||
            !prefix ||
            !startYear ||
            !endYear
        ) {

            return res.status(400).json({

                success: false,

                message: "Please provide all required fields."

            });

        }


        // Check duplicate batch name

        const batchExists =
            await Batch.findOne({ batchName });

        if (batchExists) {

            return res.status(400).json({

                success: false,

                message: "Batch already exists."

            });

        }


        // Check duplicate prefix

        const prefixExists =
            await Batch.findOne({
                prefix: prefix.toUpperCase()
            });

        if (prefixExists) {

            return res.status(400).json({

                success: false,

                message: "Batch prefix already exists."

            });

        }


        // Create batch

        const batch = await Batch.create({

            batchName,

            prefix: prefix.toUpperCase(),

            startYear,

            endYear,

            isActive:
                isActive !== undefined
                    ? isActive
                    : true

        });


        res.status(201).json({

            success: true,

            message: "Batch added successfully.",

            batch

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
   GET ALL BATCHES
   GET /api/batches
========================================== */

const getBatches = async (req, res) => {

    try {

        const batches =
            await Batch.find()
                .sort({ startYear: 1 });


        res.status(200).json({

            success: true,

            count: batches.length,

            batches

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
   UPDATE BATCH
   PUT /api/batches/:id
========================================== */

const updateBatch = async (req, res) => {

    try {

        const batch =
            await Batch.findById(req.params.id);


        if (!batch) {

            return res.status(404).json({

                success: false,

                message: "Batch not found."

            });

        }


        const updatedBatch =
            await Batch.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        res.status(200).json({

            success: true,

            message: "Batch updated successfully.",

            batch: updatedBatch

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
   DELETE BATCH
   DELETE /api/batches/:id
========================================== */

const deleteBatch = async (req, res) => {

    try {

        const batch =
            await Batch.findById(req.params.id);


        if (!batch) {

            return res.status(404).json({

                success: false,

                message: "Batch not found."

            });

        }


        await batch.deleteOne();


        res.status(200).json({

            success: true,

            message: "Batch deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/* ==========================================
   EXPORT
========================================== */

module.exports = {

    addBatch,

    getBatches,

    updateBatch,

    deleteBatch

};