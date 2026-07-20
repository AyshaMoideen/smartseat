const Teacher = require("../models/Teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Teacher
const registerTeacher = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });

        if (existingTeacher) {
            return res.status(400).json({
                success: false,
                message: "Teacher already exists"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save teacher
        const teacher = await Teacher.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Teacher registered successfully",
            teacher
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// Login Teacher
const loginTeacher = async (req, res) => {

    try {

        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });

        if (!teacher) {

            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });

        }

        const isMatch = await bcrypt.compare(password, teacher.password);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });

        }

        const token = jwt.sign(

            {
                id: teacher._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.status(200).json({

            success: true,

            token,

            teacher: {

                id: teacher._id,

                name: teacher.name,

                email: teacher.email

            }

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

    registerTeacher,

    loginTeacher

};