const Student = require("../models/Student");

// =======================================
// ADD STUDENT
// =======================================

const addStudent = async (req, res) => {

    try {

        const {
            registerNumber,
            name,
            department,
            semester,
            section,
            batch
        } = req.body;

        // Check duplicate register number
        const existingStudent = await Student.findOne({
            registerNumber
        });

        if (existingStudent) {

            return res.status(400).json({
                success: false,
                message: "Student already exists"
            });

        }

        // Create student
        const student = await Student.create({

            registerNumber,
            name,
            department,
            semester,
            section,
            batch

        });

        res.status(201).json({

            success: true,
            message: "Student added successfully",
            student

        });

    }

    catch (error) {

        console.error("Add student error:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// =======================================
// GET ALL STUDENTS
// =======================================

const getStudents = async (req, res) => {

    try {

        const students = await Student.find()
            .populate("batch")
            .sort({
                createdAt: -1
            });

        res.status(200).json({

            success: true,
            count: students.length,
            students

        });

    }

    catch (error) {

        console.error("Get students error:", error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// =======================================
// UPDATE STUDENT
// =======================================

const updateStudent = async (req, res) => {

    try {

        const studentId = req.params.id;

        const {
            registerNumber,
            name,
            department,
            semester,
            section,
            batch
        } = req.body;


        console.log("=================================");
        console.log("UPDATE STUDENT");
        console.log("ID:", studentId);
        console.log("BODY:", req.body);
        console.log("=================================");


        // Find student
        const student = await Student.findById(studentId);

        if (!student) {

            return res.status(404).json({

                success: false,
                message: "Student not found"

            });

        }


        // Check duplicate register number
        const duplicate = await Student.findOne({

            registerNumber,

            _id: {
                $ne: studentId
            }

        });


        if (duplicate) {

            return res.status(400).json({

                success: false,
                message: "Another student already has this register number."

            });

        }


        // Update student
        student.registerNumber = registerNumber;
        student.name = name;
        student.department = department;
        student.semester = semester;
        student.section = section;
        student.batch = batch;


        await student.save();


        console.log(
            "Student updated successfully:",
            student
        );


        res.status(200).json({

            success: true,

            message: "Student updated successfully",

            student

        });

    }

    catch (error) {

        console.error(
            "UPDATE STUDENT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =======================================
// DELETE STUDENT
// =======================================

const deleteStudent = async (req, res) => {

    try {

        const student = await Student.findById(
            req.params.id
        );


        if (!student) {

            return res.status(404).json({

                success: false,
                message: "Student not found"

            });

        }


        await Student.findByIdAndDelete(
            req.params.id
        );


        res.status(200).json({

            success: true,
            message: "Student deleted successfully"

        });

    }

    catch (error) {

        console.error(
            "Delete student error:",
            error
        );

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// =======================================
// ASSIGN EXISTING STUDENTS TO BATCH
// =======================================

const assignStudentsToBatch = async (req, res) => {

    try {

        const { batchId } = req.body;

        if (!batchId) {

            return res.status(400).json({

                success: false,
                message: "Batch ID is required."

            });

        }

        const Batch = require("../models/Batch");

        const batch = await Batch.findById(batchId);

        if (!batch) {

            return res.status(404).json({

                success: false,
                message: "Batch not found."

            });

        }

        const result = await Student.updateMany(

            {
                batch: null
            },

            {
                $set: {
                    batch: batch._id
                }
            }

        );

        res.status(200).json({

            success: true,

            message:
                `Students assigned to ${batch.batchName} successfully.`,

            studentsUpdated:
                result.modifiedCount

        });

    }

    catch (error) {

        console.error(
            "Assign students to batch error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to assign students to batch."

        });

    }

};
// =======================================
// FIX REGISTER PREFIX FOR A BATCH
// =======================================

const fixBatchRegisterPrefixes = async (req, res) => {

    try {

        const { batchId } = req.params;

        const Batch = require("../models/Batch");

        // Find batch
        const batch = await Batch.findById(batchId);

        if (!batch) {

            return res.status(404).json({
                success: false,
                message: "Batch not found."
            });

        }

        const correctPrefix =
            String(batch.prefix || "")
                .trim()
                .toUpperCase()
                .replace(/\s+/g, "");

        if (!correctPrefix) {

            return res.status(400).json({
                success: false,
                message: "Batch does not have a valid prefix."
            });

        }

        // Get ONLY students belonging to this batch
        const students = await Student.find({
            batch: batch._id
        });

        let studentsToUpdate = [];

        let conflicts = [];

        for (const student of students) {

            const oldRegisterNumber =
                String(student.registerNumber || "")
                    .trim()
                    .toUpperCase();

            // We only want the incorrect MD24 records
            if (!oldRegisterNumber.startsWith("MD24")) {
                continue;
            }

            const newRegisterNumber =
                correctPrefix +
                oldRegisterNumber.substring(4);

            // Check whether another student already
            // has the target register number
            const existingStudent =
                await Student.findOne({
                    registerNumber: newRegisterNumber,
                    _id: {
                        $ne: student._id
                    }
                });

            if (existingStudent) {

                conflicts.push({
                    oldRegisterNumber,
                    newRegisterNumber,
                    studentName: student.name
                });

                continue;
            }

            studentsToUpdate.push({
                student,
                oldRegisterNumber,
                newRegisterNumber
            });

        }

        // STOP if conflicts exist
        if (conflicts.length > 0) {

            return res.status(409).json({

                success: false,

                message:
                    "Register number conflicts found. No students were changed.",

                conflicts

            });

        }

        // Perform updates
        for (const item of studentsToUpdate) {

            item.student.registerNumber =
                item.newRegisterNumber;

            await item.student.save();

        }

        res.status(200).json({

            success: true,

            message:
                `Register prefixes fixed successfully for ${batch.batchName}.`,

            batchName:
                batch.batchName,

            correctPrefix,

            studentsFound:
                students.length,

            studentsUpdated:
                studentsToUpdate.length

        });

    }

    catch (error) {

        console.error(
            "Fix batch register prefixes error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fix register prefixes."

        });

    }

};
// =======================================
// EXPORT CONTROLLERS
// =======================================

module.exports = {

    addStudent,
    getStudents,
    updateStudent,
    deleteStudent,
    assignStudentsToBatch,
    fixBatchRegisterPrefixes

};