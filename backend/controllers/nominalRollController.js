const Student = require("../models/Student");
const Exam = require("../models/Exam");

// =======================================
// IMPORT NOMINAL ROLL
// =======================================

const importNominalRoll = async (req, res) => {

    try {

        const {
            examId,
            students
        } = req.body;

        // -----------------------------------
        // Validate exam
        // -----------------------------------

        if (!examId) {

            return res.status(400).json({

                success: false,
                message: "Exam is required."

            });

        }

        if (!students || !Array.isArray(students)) {

            return res.status(400).json({

                success: false,
                message: "Students data is required."

            });

        }

        // -----------------------------------
        // Check exam
        // -----------------------------------

        const exam = await Exam.findById(examId);

        if (!exam) {

            return res.status(404).json({

                success: false,
                message: "Examination not found."

            });

        }

        // -----------------------------------
        // Import students
        // -----------------------------------

        let imported = 0;
        let skipped = 0;

        for (const studentData of students) {

            if (!studentData.registerNumber) {

                skipped++;

                continue;

            }

            const existingStudent =
                await Student.findOne({

                    registerNumber:
                        studentData.registerNumber

                });

            if (existingStudent) {

                skipped++;

                continue;

            }

            await Student.create({

                registerNumber:
                    studentData.registerNumber,

                name:
                    studentData.name || "",

                department:
                    studentData.department || "",

                semester:
                    Number(studentData.semester) || 0,

                section:
                    studentData.section || ""

            });

            imported++;

        }

        // -----------------------------------
        // Response
        // -----------------------------------

        res.status(201).json({

            success: true,

            message:
                "Nominal roll imported successfully.",

            exam: {

                id: exam._id,

                name: exam.examName

            },

            imported,

            skipped,

            total: students.length

        });

    }

    catch (error) {

        console.error(
            "Import nominal roll error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// GET STUDENTS FOR EXAM
// =======================================

const getNominalRoll = async (req, res) => {

    try {

        const students =
            await Student.find().sort({

                registerNumber: 1

            });

        res.status(200).json({

            success: true,

            count: students.length,

            students

        });

    }

    catch (error) {

        console.error(
            "Get nominal roll error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// DELETE STUDENT FROM NOMINAL ROLL
// =======================================

const deleteNominalStudent = async (req, res) => {

    try {

        const student =
            await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).json({

                success: false,

                message: "Student not found."

            });

        }

        await Student.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({

            success: true,

            message:
                "Student removed from nominal roll."

        });

    }

    catch (error) {

        console.error(
            "Delete nominal student error:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// EXPORT
// =======================================

module.exports = {

    importNominalRoll,

    getNominalRoll,

    deleteNominalStudent

};