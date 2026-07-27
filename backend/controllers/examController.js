const Exam = require("../models/Exam");

/* ==========================
   Add Exam
========================== */

exports.addExam = async (req, res) => {

    try {

        const exam = await Exam.create(req.body);

        res.status(201).json({

            success: true,
            message: "Exam created successfully.",
            exam

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

/* ==========================
   Get Exams
========================== */

exports.getExams = async (req, res) => {

    try {

        const exams = await Exam.find().sort({

            examDate: 1

        });

        res.json({

            success: true,
            exams

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

/* ==========================
   Update Exam
========================== */

exports.updateExam = async (req, res) => {

    try {

        const exam = await Exam.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.json({

            success: true,
            message: "Exam updated successfully.",
            exam

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

/* ==========================
   Delete Exam
========================== */

exports.deleteExam = async (req, res) => {

    try {

        await Exam.findByIdAndDelete(req.params.id);

        res.json({

            success: true,
            message: "Exam deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};