const Exam = require("../models/Exam");


// ==========================================
// NORMALIZE SUBJECT NAME
// ==========================================

function normalizeSubjectName(name) {

    return String(name || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

}


// ==========================================
// BUILD SUBJECTS
// ==========================================
//
// Frontend sends:
//
// [
//   {
//      department: "BCA",
//      subjectCode: "CS501",
//      subjectName: "Data Structures"
//   },
//   {
//      department: "BBA TTM",
//      subjectCode: "",
//      subjectName: "Marketing"
//   },
//   {
//      department: "BBA AH",
//      subjectCode: "",
//      subjectName: "Marketing"
//   }
// ]
//
// Backend converts it into:
//
// [
//   {
//      subjectCode: "CS501",
//      subjectName: "Data Structures",
//      departments: ["BCA"]
//   },
//   {
//      subjectCode: "",
//      subjectName: "Marketing",
//      departments: ["BBA TTM", "BBA AH"]
//   }
// ]
//
// ==========================================

function buildSubjects(departmentSubjects) {

    const subjectMap = new Map();


    departmentSubjects.forEach(item => {

        const department =
            String(item.department || "")
                .trim();


        const subjectName =
            String(item.subjectName || "")
                .trim()
                .replace(/\s+/g, " ");


        const subjectCode =
            String(item.subjectCode || "")
                .trim()
                .toUpperCase();


        const key =
            normalizeSubjectName(
                subjectName
            );


        if (!key) {
            return;
        }


        if (!subjectMap.has(key)) {

            subjectMap.set(
                key,
                {
                    subjectCode,
                    subjectName,
                    departments: []
                }
            );

        }


        const subject =
            subjectMap.get(key);


        // Add department only once

        if (
            department &&
            !subject.departments.includes(
                department
            )
        ) {

            subject.departments.push(
                department
            );

        }


        // If first entry had no code,
        // use a later available code.

        if (
            !subject.subjectCode &&
            subjectCode
        ) {

            subject.subjectCode =
                subjectCode;

        }

    });


    return Array.from(
        subjectMap.values()
    );

}


// ==========================================
// VALIDATE DEPARTMENT SUBJECTS
// ==========================================

function validateDepartmentSubjects(
    departmentSubjects
) {

    if (
        !Array.isArray(
            departmentSubjects
        ) ||
        departmentSubjects.length === 0
    ) {

        return {
            valid: false,
            message:
                "Please add at least one department and subject."
        };

    }


    const departments = [];


    for (
        const item
        of departmentSubjects
    ) {

        const department =
            String(
                item.department || ""
            ).trim();


        const subjectName =
            String(
                item.subjectName || ""
            ).trim();


        if (!department) {

            return {
                valid: false,
                message:
                    "Every subject must have a department."
            };

        }


        if (!subjectName) {

            return {
                valid: false,
                message:
                    `Please enter the subject name for ${department}.`
            };

        }


        if (
            departments.includes(
                department
            )
        ) {

            return {
                valid: false,
                message:
                    `${department} has been added more than once.`
            };

        }


        departments.push(
            department
        );

    }


    return {
        valid: true
    };

}


// ==========================================
// ADD EXAM
// ==========================================

exports.addExam = async (req, res) => {

    try {

        const {
            examName,
            semester,
            examDate,
            session,
            startTime,
            endTime,
            subjects,
            duration,
            status
        } = req.body;


        // ----------------------------------
        // Common Details Validation
        // ----------------------------------

        if (!examName) {

            return res.status(400).json({

                success: false,

                message:
                    "Exam name is required."

            });

        }


        if (!semester) {

            return res.status(400).json({

                success: false,

                message:
                    "Semester is required."

            });

        }


        if (!examDate) {

            return res.status(400).json({

                success: false,

                message:
                    "Exam date is required."

            });

        }


        if (!session) {

            return res.status(400).json({

                success: false,

                message:
                    "Session is required."

            });

        }


        if (!startTime) {

            return res.status(400).json({

                success: false,

                message:
                    "Start time is required."

            });

        }


        if (!endTime) {

            return res.status(400).json({

                success: false,

                message:
                    "End time is required."

            });

        }


        // ----------------------------------
        // Time Validation
        // ----------------------------------

        if (endTime <= startTime) {

            return res.status(400).json({

                success: false,

                message:
                    "End time must be after start time."

            });

        }


        // ----------------------------------
        // Validate Subjects
        // ----------------------------------

        const validation =
            validateDepartmentSubjects(
                subjects
            );


        if (!validation.valid) {

            return res.status(400).json({

                success: false,

                message:
                    validation.message

            });

        }


        // ----------------------------------
        // Build Common Subjects
        // ----------------------------------

        const finalSubjects =
            buildSubjects(subjects);


        // ----------------------------------
        // Create Examination
        // ----------------------------------

        const exam =
            await Exam.create({

                examName:
                    examName
                        .trim(),

                semester:
                    Number(semester),

                examDate:
                    new Date(examDate),

                session,

                startTime,

                endTime,

                subjects:
                    finalSubjects,

                duration:
                    duration ||
                    "1 Hour",

                status:
                    status !== undefined
                        ? status
                        : true

            });


        return res.status(201).json({

            success: true,

            message:
                "Examination created successfully.",

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


        // ----------------------------------
        // Common Fields
        // ----------------------------------

        if (
            req.body.examName !== undefined
        ) {

            exam.examName =
                String(
                    req.body.examName
                ).trim();

        }


        if (
            req.body.semester !== undefined
        ) {

            exam.semester =
                Number(
                    req.body.semester
                );

        }


        if (
            req.body.examDate !== undefined
        ) {

            exam.examDate =
                new Date(
                    req.body.examDate
                );

        }


        if (
            req.body.session !== undefined
        ) {

            exam.session =
                req.body.session;

        }


        if (
            req.body.startTime !== undefined
        ) {

            exam.startTime =
                req.body.startTime;

        }


        if (
            req.body.endTime !== undefined
        ) {

            exam.endTime =
                req.body.endTime;

        }


        if (
            req.body.duration !== undefined
        ) {

            exam.duration =
                req.body.duration;

        }


        if (
            req.body.status !== undefined
        ) {

            exam.status =
                req.body.status;

        }


        // ----------------------------------
        // Update Subjects
        // ----------------------------------

        if (
            req.body.subjects !== undefined
        ) {

            const validation =
                validateDepartmentSubjects(
                    req.body.subjects
                );


            if (!validation.valid) {

                return res.status(400).json({

                    success: false,

                    message:
                        validation.message

                });

            }


            exam.subjects =
                buildSubjects(
                    req.body.subjects
                );

        }


        // ----------------------------------
        // Validate Time
        // ----------------------------------

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
                "Examination updated successfully.",

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
                "Examination deleted successfully."

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