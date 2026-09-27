const Exam = require("../models/Exam");
const Batch = require("../models/Batch");

// ==========================================
// VALIDATE PARTICIPATING SEMESTERS
// ==========================================

function validateParticipatingSemesters(data) {

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {
        return {
            valid: false,
            message:
                "Please select at least one batch and semester."
        };
    }

    const combinations = new Set();

    for (const item of data) {

        if (!item.batch) {
            return {
                valid: false,
                message:
                    "Every participating semester must have a batch."
            };
        }

        const semester = Number(item.semester);

        if (
            !Number.isInteger(semester) ||
            semester < 1 ||
            semester > 6
        ) {
            return {
                valid: false,
                message:
                    "Semester must be between 1 and 6."
            };
        }

        const key =
            `${item.batch}_${semester}`;

        if (combinations.has(key)) {
            return {
                valid: false,
                message:
                    "The same batch and semester has been added more than once."
            };
        }

        combinations.add(key);
    }

    return {
        valid: true
    };
}


// ==========================================
// VALIDATE SUBJECTS
// ==========================================

function validateSubjects(subjects, participatingSemesters) {

    if (
        !Array.isArray(subjects) ||
        subjects.length === 0
    ) {
        return {
            valid: false,
            message:
                "Please add at least one examination subject."
        };
    }

    const validCombinations =
        new Set(
            participatingSemesters.map(item =>
                `${item.batch}_${Number(item.semester)}`
            )
        );

    const subjectKeys = new Set();

    for (const subject of subjects) {

        const batch =
            String(subject.batch || "").trim();

        const semester =
            Number(subject.semester);

        const department =
            String(subject.department || "")
                .trim()
                .toUpperCase();

        const subjectName =
            String(subject.subjectName || "")
                .trim();

        const subjectCode =
            String(subject.subjectCode || "")
                .trim()
                .toUpperCase();


        if (!batch) {
            return {
                valid: false,
                message:
                    "Every subject must have a batch."
            };
        }


        if (
            !Number.isInteger(semester) ||
            semester < 1 ||
            semester > 6
        ) {
            return {
                valid: false,
                message:
                    "Every subject must have a valid semester."
            };
        }


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


        // ----------------------------------
        // Subject must belong to a selected
        // batch + semester combination
        // ----------------------------------

        const combination =
            `${batch}_${semester}`;

        if (
            !validCombinations.has(combination)
        ) {
            return {
                valid: false,
                message:
                    `${department} Semester ${semester} subject belongs to a batch/semester that was not selected.`
            };
        }


        // ----------------------------------
        // Prevent duplicate subject entry
        // for same batch + semester +
        // department
        // ----------------------------------

        const subjectKey =
            `${batch}_${semester}_${department}`;

        if (
            subjectKeys.has(subjectKey)
        ) {
            return {
                valid: false,
                message:
                    `${department} already has a subject for this batch and semester.`
            };
        }

        subjectKeys.add(subjectKey);


        subject.batch = batch;
        subject.semester = semester;
        subject.department = department;
        subject.subjectCode = subjectCode;
        subject.subjectName = subjectName;
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
            examDate,
            session,
            startTime,
            endTime,
            participatingSemesters,
            subjects,
            duration,
            status
        } = req.body;


        // ----------------------------------
        // Common Details
        // ----------------------------------

        if (!examName || !String(examName).trim()) {

            return res.status(400).json({
                success: false,
                message: "Exam name is required."
            });

        }


        if (!examDate) {

            return res.status(400).json({
                success: false,
                message: "Exam date is required."
            });

        }


        if (!session) {

            return res.status(400).json({
                success: false,
                message: "Session is required."
            });

        }


        if (!startTime) {

            return res.status(400).json({
                success: false,
                message: "Start time is required."
            });

        }


        if (!endTime) {

            return res.status(400).json({
                success: false,
                message: "End time is required."
            });

        }


        if (endTime <= startTime) {

            return res.status(400).json({
                success: false,
                message:
                    "End time must be after start time."
            });

        }


        // ----------------------------------
        // Validate Participating Semesters
        // ----------------------------------

        const semesterValidation =
            validateParticipatingSemesters(
                participatingSemesters
            );


        if (!semesterValidation.valid) {

            return res.status(400).json({
                success: false,
                message:
                    semesterValidation.message
            });

        }


        // ----------------------------------
        // Verify Batch IDs
        // ----------------------------------

        const batchIds =
            participatingSemesters.map(
                item => item.batch
            );


        const batches =
            await Batch.find({
                _id: {
                    $in: batchIds
                }
            });


        if (
            batches.length !==
            batchIds.length
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "One or more selected batches could not be found."
            });

        }


        // ----------------------------------
        // Validate Subjects
        // ----------------------------------

        const subjectValidation =
            validateSubjects(
                subjects,
                participatingSemesters
            );


        if (!subjectValidation.valid) {

            return res.status(400).json({
                success: false,
                message:
                    subjectValidation.message
            });

        }


        // ----------------------------------
        // Create clean participating data
        // ----------------------------------

        const finalParticipatingSemesters =
            participatingSemesters.map(item => {

                const batch =
                    batches.find(
                        b =>
                            b._id.toString() ===
                            item.batch.toString()
                    );

                return {
                    batch: batch._id,
                    batchName: batch.batchName,
                    semester: Number(item.semester)
                };

            });


        // ----------------------------------
        // Create clean subject data
        // ----------------------------------

        const finalSubjects =
            subjects.map(subject => {

                const batch =
                    batches.find(
                        b =>
                            b._id.toString() ===
                            subject.batch.toString()
                    );

                return {
                    batch: batch._id,
                    semester:
                        Number(subject.semester),
                    department:
                        String(
                            subject.department
                        )
                            .trim()
                            .toUpperCase(),
                    subjectCode:
                        String(
                            subject.subjectCode || ""
                        )
                            .trim()
                            .toUpperCase(),
                    subjectName:
                        String(
                            subject.subjectName
                        ).trim()
                };

            });


        // ----------------------------------
        // Create Examination
        // ----------------------------------

        const exam =
            await Exam.create({

                examName:
                    String(examName).trim(),

                examDate:
                    new Date(examDate),

                session,

                startTime,

                endTime,

                participatingSemesters:
                    finalParticipatingSemesters,

                subjects:
                    finalSubjects,

                duration:
                    duration || "1 Hour",

                status:
                    status !== undefined
                        ? Boolean(status)
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
                .populate(
                    "participatingSemesters.batch",
                    "batchName prefix currentSemester"
                )
                .populate(
                    "subjects.batch",
                    "batchName prefix"
                )
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
            )
            .populate(
                "participatingSemesters.batch",
                "batchName prefix currentSemester"
            )
            .populate(
                "subjects.batch",
                "batchName prefix"
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
                Boolean(req.body.status);

        }


        // ----------------------------------
        // Participating Semesters
        // ----------------------------------

        if (
            req.body.participatingSemesters
            !== undefined
        ) {

            const semesterValidation =
                validateParticipatingSemesters(
                    req.body.participatingSemesters
                );


            if (!semesterValidation.valid) {

                return res.status(400).json({

                    success: false,

                    message:
                        semesterValidation.message

                });

            }


            const batchIds =
                req.body.participatingSemesters
                    .map(item => item.batch);


            const batches =
                await Batch.find({
                    _id: {
                        $in: batchIds
                    }
                });


            if (
                batches.length !==
                batchIds.length
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "One or more selected batches could not be found."

                });

            }


            exam.participatingSemesters =
                req.body.participatingSemesters
                    .map(item => {

                        const batch =
                            batches.find(
                                b =>
                                    b._id.toString() ===
                                    item.batch.toString()
                            );

                        return {
                            batch: batch._id,
                            batchName: batch.batchName,
                            semester:
                                Number(item.semester)
                        };

                    });

        }


        // ----------------------------------
        // Subjects
        // ----------------------------------

        if (
            req.body.subjects !== undefined
        ) {

            const participating =
                req.body.participatingSemesters
                !== undefined
                    ? req.body.participatingSemesters
                    : exam.participatingSemesters;


            const subjectValidation =
                validateSubjects(
                    req.body.subjects,
                    participating
                );


            if (!subjectValidation.valid) {

                return res.status(400).json({

                    success: false,

                    message:
                        subjectValidation.message

                });

            }


            const batchIds =
                req.body.subjects.map(
                    item => item.batch
                );


            const batches =
                await Batch.find({
                    _id: {
                        $in: batchIds
                    }
                });


            if (
                batches.length !==
                new Set(
                    batchIds.map(id =>
                        id.toString()
                    )
                ).size
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "One or more subject batches could not be found."

                });

            }


            exam.subjects =
                req.body.subjects.map(
                    subject => {

                        const batch =
                            batches.find(
                                b =>
                                    b._id.toString() ===
                                    subject.batch.toString()
                            );

                        return {

                            batch:
                                batch._id,

                            semester:
                                Number(
                                    subject.semester
                                ),

                            department:
                                String(
                                    subject.department
                                )
                                    .trim()
                                    .toUpperCase(),

                            subjectCode:
                                String(
                                    subject.subjectCode || ""
                                )
                                    .trim()
                                    .toUpperCase(),

                            subjectName:
                                String(
                                    subject.subjectName
                                ).trim()

                        };

                    }
                );

        }


        // ----------------------------------
        // Time Validation
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