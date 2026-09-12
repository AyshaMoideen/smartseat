const NominalRoll = require("../models/NominalRoll");
const Exam = require("../models/Exam");


// ==========================================
// GET NOMINAL ROLL FOR EXAM
// ==========================================

exports.getNominalRoll = async (req, res) => {

    try {

        const { examId } = req.params;


        // Check exam
        const exam =
            await Exam.findById(examId);


        if (!exam) {

            return res.status(404).json({

                success: false,

                message:
                    "Examination not found."

            });

        }


        const roll =
            await NominalRoll.findOne({
                examId
            });


        // No roll yet
        if (!roll) {

            return res.json({

                success: true,

                exam,

                students: []

            });

        }


        return res.json({

            success: true,

            exam,

            students:
                roll.students || []

        });

    }

    catch (error) {

        console.error(
            "Get Nominal Roll Error:",
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
// SAVE / IMPORT STUDENTS
// ==========================================

exports.saveNominalRoll = async (req, res) => {

    try {

        const { examId, students } =
            req.body;


        // ------------------------------
        // Validate exam
        // ------------------------------

        if (!examId) {

            return res.status(400).json({

                success: false,

                message:
                    "Exam ID is required."

            });

        }


        if (!Array.isArray(students)) {

            return res.status(400).json({

                success: false,

                message:
                    "Students must be an array."

            });

        }


        // ------------------------------
        // Check exam
        // ------------------------------

        const exam =
            await Exam.findById(examId);


        if (!exam) {

            return res.status(404).json({

                success: false,

                message:
                    "Examination not found."

            });

        }


        // ------------------------------
        // Clean students
        // ------------------------------

        const cleanedStudents =
            students
                .map(student => ({

                    regNo:
                        String(
                            student.regNo || ""
                        ).trim(),

                    name:
                        String(
                            student.name || ""
                        ).trim(),

                    department:
                        String(
                            student.department || ""
                        ).trim(),

                    semester:
                        String(
                            student.semester || ""
                        ).trim()

                }))
                .filter(
                    student =>
                        student.regNo &&
                        student.name
                );


        // ------------------------------
        // Remove duplicate register numbers
        // ------------------------------

        const uniqueStudents = [];

        const registerNumbers =
            new Set();


        cleanedStudents.forEach(student => {

            const regNo =
                student.regNo.toLowerCase();


            if (
                !registerNumbers.has(regNo)
            ) {

                registerNumbers.add(regNo);

                uniqueStudents.push(student);

            }

        });


        // ------------------------------
        // Save / Update
        // ------------------------------

        const roll =
            await NominalRoll.findOneAndUpdate(

                { examId },

                {
                    examId,

                    students:
                        uniqueStudents

                },

                {
                    new: true,

                    upsert: true,

                    runValidators: true

                }

            );


        return res.json({

            success: true,

            message:
                "Nominal roll saved successfully.",

            count:
                roll.students.length,

            roll

        });

    }

    catch (error) {

        console.error(
            "Save Nominal Roll Error:",
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
// DELETE STUDENT
// ==========================================

exports.deleteStudent = async (req, res) => {

    try {

        const {
            examId,
            regNo
        } = req.params;


        const roll =
            await NominalRoll.findOne({
                examId
            });


        if (!roll) {

            return res.status(404).json({

                success: false,

                message:
                    "Nominal roll not found."

            });

        }


        const oldLength =
            roll.students.length;


        roll.students =
            roll.students.filter(
                student =>
                    student.regNo !== regNo
            );


        if (
            roll.students.length === oldLength
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Student not found."

            });

        }


        await roll.save();


        return res.json({

            success: true,

            message:
                "Student deleted successfully.",

            students:
                roll.students

        });

    }

    catch (error) {

        console.error(
            "Delete Student Error:",
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
// CLEAR NOMINAL ROLL
// ==========================================

exports.clearNominalRoll = async (req, res) => {

    try {

        const { examId } =
            req.params;


        const roll =
            await NominalRoll.findOne({
                examId
            });


        if (!roll) {

            return res.status(404).json({

                success: false,

                message:
                    "Nominal roll not found."

            });

        }


        roll.students = [];


        await roll.save();


        return res.json({

            success: true,

            message:
                "Nominal roll cleared successfully."

        });

    }

    catch (error) {

        console.error(
            "Clear Nominal Roll Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};