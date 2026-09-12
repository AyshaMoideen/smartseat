const Exam = require("../models/Exam");


// ==========================================
// ADD EXAM
// ==========================================

exports.addExam = async (req, res) => {

    try {

        const {
            examName,
            subjectCode,
            subjectName,
            semester,
            examDate,
            session,
            startTime,
            endTime,
            departments,
            duration,
            status
        } = req.body;


        // ------------------------------
        // Required validation
        // ------------------------------

        if (
            !examName ||
            !subjectCode ||
            !subjectName ||
            !semester ||
            !examDate ||
            !session ||
            !startTime ||
            !endTime
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All required examination fields must be provided."

            });

        }


        // ------------------------------
        // Validate time
        // ------------------------------

        if (endTime <= startTime) {

            return res.status(400).json({

                success: false,

                message:
                    "End time must be after start time."

            });

        }


        // ------------------------------
        // Create exam
        // ------------------------------

        const exam =
            await Exam.create({

                examName:
                    examName.trim(),

                subjectCode:
                    subjectCode.trim().toUpperCase(),

                subjectName:
                    subjectName.trim(),

                semester:
                    Number(semester),

                departments:
                    Array.isArray(departments)
                        ? departments
                        : [],

                examDate:
                    new Date(examDate),

                session,

                startTime,

                endTime,

                duration:
                    duration || "3 Hours",

                status:
                    status !== undefined
                        ? status
                        : true

            });


        return res.status(201).json({

            success: true,

            message:
                "Exam created successfully.",

            exam

        });

    }

    catch (error) {

        console.error(
            "Add Exam Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ==========================================
// GET ALL EXAMS
// ==========================================

exports.getExams = async (req, res) => {

    try {

        const exams =
            await Exam.find()
                .sort({
                    examDate: 1,
                    startTime: 1
                });


        return res.json({

            success: true,

            count:
                exams.length,

            exams

        });

    }

    catch (error) {

        console.error(
            "Get Exams Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ==========================================
// GET SINGLE EXAM
// ==========================================

exports.getExamById = async (req, res) => {

    try {

        const exam =
            await Exam.findById(
                req.params.id
            );


        if (!exam) {

            return res.status(404).json({

                success: false,

                message:
                    "Examination not found."

            });

        }


        return res.json({

            success: true,

            exam

        });

    }

    catch (error) {

        console.error(
            "Get Exam Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ==========================================
// UPDATE EXAM
// ==========================================

exports.updateExam = async (req, res) => {

    try {

        const exam =
            await Exam.findById(
                req.params.id
            );


        if (!exam) {

            return res.status(404).json({

                success: false,

                message:
                    "Examination not found."

            });

        }


        // ------------------------------
        // Update fields
        // ------------------------------

        const allowedFields = [

            "examName",
            "subjectCode",
            "subjectName",
            "semester",
            "departments",
            "examDate",
            "session",
            "startTime",
            "endTime",
            "duration",
            "status"

        ];


        allowedFields.forEach(field => {

            if (
                req.body[field] !== undefined
            ) {

                exam[field] =
                    req.body[field];

            }

        });


        // ------------------------------
        // Normalize values
        // ------------------------------

        if (exam.examName) {

            exam.examName =
                exam.examName.trim();

        }


        if (exam.subjectCode) {

            exam.subjectCode =
                exam.subjectCode
                    .trim()
                    .toUpperCase();

        }


        if (exam.subjectName) {

            exam.subjectName =
                exam.subjectName.trim();

        }


        // ------------------------------
        // Validate time
        // ------------------------------

        if (
            exam.startTime &&
            exam.endTime &&
            exam.endTime <= exam.startTime
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "End time must be after start time."

            });

        }


        await exam.save();


        return res.json({

            success: true,

            message:
                "Exam updated successfully.",

            exam

        });

    }

    catch (error) {

        console.error(
            "Update Exam Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ==========================================
// DELETE EXAM
// ==========================================

exports.deleteExam = async (req, res) => {

    try {

        const exam =
            await Exam.findById(
                req.params.id
            );


        if (!exam) {

            return res.status(404).json({

                success: false,

                message:
                    "Examination not found."

            });

        }


        await Exam.findByIdAndDelete(
            req.params.id
        );


        return res.json({

            success: true,

            message:
                "Exam deleted successfully."

        });

    }

    catch (error) {

        console.error(
            "Delete Exam Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};