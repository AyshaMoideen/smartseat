const Student = require("../models/Student");

// =======================================
// Add Student
// =======================================

const addStudent = async (req, res) => {

    try {

        const {
            registerNumber,
            name,
            department,
            semester,
            section
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

        // Create Student

        const student = await Student.create({

            registerNumber,
            name,
            department,
            semester,
            section

        });

        res.status(201).json({

            success: true,
            message: "Student added successfully",
            student

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// =======================================
// Get All Students
// =======================================

const getStudents = async (req, res) => {

    try {

        const students = await Student.find().sort({
            createdAt: -1
        });

        res.status(200).json({

            success: true,
            count: students.length,
            students

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = {

    addStudent,
    getStudents

};