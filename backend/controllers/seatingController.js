const Seating = require("../models/Seating");
const Exam = require("../models/Exam");


// ==========================================
// SAVE GENERATED SEATING
// ==========================================

const saveSeating = async (req, res) => {

    try {

        const {
            examId,
            seating
        } = req.body;


        if (!examId) {

            return res.status(400).json({
                success: false,
                message: "Exam ID is required."
            });

        }


        if (
            !Array.isArray(seating) ||
            seating.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Seating allocation is empty."
            });

        }


        const exam = await Exam.findById(examId);


        if (!exam) {

            return res.status(404).json({
                success: false,
                message: "Examination not found."
            });

        }


        const allocations = seating.map(student => ({

            registerNumber:
                String(
                    student.registerNumber || ""
                )
                    .trim()
                    .toUpperCase(),

            name:
                student.name || "",

            department:
                student.department || "",

            semester:
                student.semester
                    ? Number(student.semester)
                    : null,

            roomId:
                student.roomId,

            roomNumber:
                student.roomNumber,

            bench:
                Number(student.bench),

            column:
                student.column,

            seat:
                student.seat

        }));


        const savedSeating =
            await Seating.findOneAndUpdate(

                { examId },

                {
                    examId,

                    examName:
                        exam.examName,

                    examDate:
                        exam.examDate,

                    session:
                        exam.session,

                    startTime:
                        exam.startTime,

                    endTime:
                        exam.endTime,

                    allocations,

                    generatedAt:
                        new Date()
                },

                {
                    new: true,
                    upsert: true,
                    runValidators: true
                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Seating allocation saved successfully.",

            seatingId:
                savedSeating._id,

            allocationCount:
                savedSeating.allocations.length

        });

    }

    catch (error) {

        console.error(
            "❌ Save seating error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to save seating allocation.",

            error:
                error.message

        });

    }

};


// ==========================================
// FIND STUDENT SEAT
// PUBLIC
// ==========================================

const findStudentSeat = async (req, res) => {

    try {

        const registerNumber =
            String(
                req.params.registerNumber || ""
            )
                .trim()
                .toUpperCase();


        if (!registerNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "Register number is required."

            });

        }


        const seating =
            await Seating.findOne({

                "allocations.registerNumber":
                    registerNumber

            });


        if (!seating) {

            return res.status(404).json({

                success: false,

                message:
                    "Seat allocation not found."

            });

        }


        const allocation =
            seating.allocations.find(

                student =>
                    student.registerNumber ===
                    registerNumber

            );


        if (!allocation) {

            return res.status(404).json({

                success: false,

                message:
                    "Seat allocation not found."

            });

        }


        return res.status(200).json({

            success: true,

            student: {

                name:
                    allocation.name,

                registerNumber:
                    allocation.registerNumber,

                department:
                    allocation.department,

                semester:
                    allocation.semester

            },

            examination: {

                examName:
                    seating.examName,

                examDate:
                    seating.examDate,

                session:
                    seating.session,

                startTime:
                    seating.startTime,

                endTime:
                    seating.endTime

            },

            seat: {

                room:
                    allocation.roomNumber,

                bench:
                    allocation.bench,

                column:
                    allocation.column,

                seat:
                    allocation.seat

            }

        });

    }

    catch (error) {

        console.error(
            "❌ Find seat error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to find seat."

        });

    }

};


// ==========================================
// CLEAR SEATING
// ==========================================

const clearSeating = async (req, res) => {

    try {

        const {
            examId
        } = req.params;


        const deleted =
            await Seating.findOneAndDelete({
                examId
            });


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "No generated seating found."

            });

        }


        return res.status(200).json({

            success: true,

            message:
                "Seating allocation cleared successfully."

        });

    }

    catch (error) {

        console.error(
            "❌ Clear seating error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to clear seating."

        });

    }

};


module.exports = {

    saveSeating,
    findStudentSeat,
    clearSeating

};