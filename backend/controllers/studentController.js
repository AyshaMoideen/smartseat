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

        // Create student
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
            section
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
// EXPORT CONTROLLERS
// =======================================

module.exports = {

    addStudent,
    getStudents,
    updateStudent,
    deleteStudent

};