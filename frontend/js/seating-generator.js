/* ==========================================
   SMARTSEAT
   SEATING GENERATOR
   COMPLETE & CLEAN VERSION
========================================== */

console.log("🚀 SmartSeat Seating Generator Loaded");


/* ==========================================
   API
========================================== */

const EXAMS_API =
    "http://localhost:5000/api/exams";

const ROOMS_API =
    "http://localhost:5000/api/rooms";

const STUDENTS_API =
    "http://localhost:5000/api/students";

const SEATING_API = "http://localhost:5000/api/seating";

/* ==========================================
   DATA
========================================== */

let exams = [];
let masterStudents = [];
let students = [];
let rooms = [];
let seating = [];

let selectedExamId = "";
let selectedExam = null;
let examSelect = null;


/* ==========================================
   AUTH
========================================== */

function getToken() {

    return localStorage.getItem("token");

}


function getHeaders() {

    const token = getToken();

    return {

        "Content-Type": "application/json",

        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`
            }
            : {})

    };

}


/* ==========================================
   ALERT
========================================== */

function showAlert(
    title,
    text,
    icon = "info"
) {

    if (
        typeof Swal !== "undefined"
    ) {

        return Swal.fire({

            title,
            text,
            icon

        });

    }

    alert(
        `${title}\n\n${text}`
    );

}


/* ==========================================
   LOAD EXAMS
========================================== */

async function loadExams() {

    try {

        const response =
            await fetch(
                EXAMS_API,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load examinations."
            );

        }


        if (Array.isArray(data)) {

            exams = data;

        }

        else if (
            Array.isArray(data.exams)
        ) {

            exams = data.exams;

        }

        else if (
            Array.isArray(data.data)
        ) {

            exams = data.data;

        }

        else {

            exams = [];

        }


        populateExamList();


        console.log(
            `✅ ${exams.length} examinations loaded.`
        );

    }

    catch (error) {

        console.error(
            "❌ Exam loading error:",
            error
        );

        exams = [];

        showAlert(
            "Unable to Load Exams",
            error.message,
            "error"
        );

    }

}


/* ==========================================
   EXAM DROPDOWN
========================================== */

function populateExamList() {

    if (!examSelect) return;


    examSelect.innerHTML = `

        <option value="">
            Select Examination
        </option>

    `;


    exams.forEach(
        exam => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                exam._id;


            const examName =
                exam.examName ||
                "Unnamed Examination";


            const semester =
                exam.semester ||
                "";


            const date =
                exam.examDate
                    ? new Date(
                        exam.examDate
                    ).toLocaleDateString(
                        "en-IN"
                    )
                    : "";


            const session =
                exam.session ||
                "";


            option.textContent =
                `${examName} - Semester ${semester}` +
                `${date ? " - " + date : ""}` +
                `${session ? " - " + session : ""}`;


            examSelect.appendChild(
                option
            );

        }
    );

}


/* ==========================================
   LOAD ROOMS
========================================== */

async function loadRooms() {

    try {

        const response =
            await fetch(
                ROOMS_API,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load rooms."
            );

        }


        if (Array.isArray(data)) {

            rooms = data;

        }

        else if (
            Array.isArray(data.rooms)
        ) {

            rooms = data.rooms;

        }

        else if (
            Array.isArray(data.data)
        ) {

            rooms = data.data;

        }

        else {

            rooms = [];

        }


        console.log(
            `✅ ${rooms.length} rooms loaded.`
        );

    }

    catch (error) {

        console.error(
            "❌ Room loading error:",
            error
        );

        rooms = [];

        showAlert(
            "Unable to Load Rooms",
            error.message,
            "error"
        );

    }

}


/* ==========================================
   LOAD MASTER STUDENTS
========================================== */

async function loadMasterStudents() {

    try {

        const response =
            await fetch(
                STUDENTS_API,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load students."
            );

        }


        if (Array.isArray(data)) {

            masterStudents = data;

        }

        else if (
            Array.isArray(data.students)
        ) {

            masterStudents =
                data.students;

        }

        else if (
            Array.isArray(data.data)
        ) {

            masterStudents =
                data.data;

        }

        else {

            masterStudents = [];

        }


        console.log(
            `✅ ${masterStudents.length} master students loaded.`
        );

    }

    catch (error) {

        console.error(
            "❌ Master students loading error:",
            error
        );

        masterStudents = [];

        showAlert(
            "Unable to Load Students",
            error.message,
            "error"
        );

    }

}


/* ==========================================
   ADDITIONAL ENTRIES
========================================== */

function loadAdditionalEntries() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "nominalRolls"
                )
            );


        if (!Array.isArray(saved)) {

            return [];

        }


        return saved;

    }

    catch (error) {

        console.error(
            "❌ Additional Entries error:",
            error
        );

        return [];

    }

}


/* ==========================================
   NORMALIZE DEPARTMENT
========================================== */

function normalizeDepartment(
    department
) {

    return String(
        department || ""
    )
        .trim()
        .toUpperCase();

}


/* ==========================================
   REGISTER NUMBER
========================================== */

function getRegisterNumber(
    student
) {

    return String(
        student?.registerNumber ||
        student?.regNo ||
        ""
    )
        .trim()
        .toUpperCase();

}


/* ==========================================
   GET EXAM DEPARTMENTS
========================================== */

function getExamDepartments(
    exam
) {

    const departments = [];


    if (
        Array.isArray(
            exam?.subjects
        )
    ) {

        exam.subjects.forEach(
            subject => {

                if (
                    Array.isArray(
                        subject.departments
                    )
                ) {

                    subject.departments.forEach(
                        department => {

                            const normalized =
                                normalizeDepartment(
                                    department
                                );


                            if (
                                normalized &&
                                !departments.includes(
                                    normalized
                                )
                            ) {

                                departments.push(
                                    normalized
                                );

                            }

                        }
                    );

                }

            }
        );

    }


    /* --------------------------------------
       OLD EXAM COMPATIBILITY
    -------------------------------------- */

    if (
        departments.length === 0 &&
        Array.isArray(
            exam?.departments
        )
    ) {

        exam.departments.forEach(
            department => {

                const normalized =
                    normalizeDepartment(
                        department
                    );


                if (
                    normalized &&
                    !departments.includes(
                        normalized
                    )
                ) {

                    departments.push(
                        normalized
                    );

                }

            }
        );

    }


    return departments;

}


/* ==========================================
   ALLOWED MASTER DEPARTMENTS
========================================== */

function getAllowedStudentDepartments(
    examDepartments
) {

    const allowed =
        new Set();


    examDepartments.forEach(
        department => {

            /*
               Examination uses:

               BCOM.CA/CP

               Master students use:

               BCOM.CA
               BCOM.CP
            */

            if (
                department ===
                "BCOM.CA/CP"
            ) {

                allowed.add(
                    "BCOM.CA"
                );

                allowed.add(
                    "BCOM.CP"
                );

            }

            else {

                allowed.add(
                    department
                );

            }

        }
    );


    return allowed;

}


/* ==========================================
   GET ADDITIONAL STUDENTS
========================================== */

function getAdditionalStudents(
    examId
) {

    const entries =
        loadAdditionalEntries();


    const currentEntry =
        entries.find(
            entry =>
                String(
                    entry.examId
                ) ===
                String(
                    examId
                )
        );


    if (
        currentEntry &&
        Array.isArray(
            currentEntry.students
        )
    ) {

        return currentEntry.students;

    }


    return [];

}

/* ==========================================
   GET ID VALUE
========================================== */

function getIdValue(value) {

    if (!value) {
        return "";
    }


    if (
        typeof value === "object" &&
        value._id
    ) {

        return String(
            value._id
        );

    }


    return String(
        value
    );

}


/* ==========================================
   GET STUDENT BATCH ID
========================================== */

function getStudentBatchId(student) {

    if (!student) {
        return "";
    }


    if (student.batch) {

        if (
            typeof student.batch ===
            "object" &&
            student.batch._id
        ) {

            return String(
                student.batch._id
            );

        }


        return String(
            student.batch
        );

    }


    if (student.batchId) {

        return String(
            student.batchId
        );

    }


    return "";

}


/* ==========================================
   GET PAPER KEY
========================================== */

function getPaperKey(paper) {

    if (!paper) {
        return "";
    }


    const code =
        String(
            paper.subjectCode || ""
        )
            .trim()
            .toUpperCase();


    const name =
        String(
            paper.subjectName || ""
        )
            .trim()
            .toLowerCase()
            .replace(
                /\s+/g,
                " "
            );


    /*
       Prefer subject code.

       If no code exists, use subject name.
    */

    return (
        code ||
        name
    );

}

/* ==========================================
   CREATE MIXED STUDENT ORDER
========================================== */

function createMixedStudentOrder(
    studentList
) {

    if (
        !Array.isArray(studentList) ||
        studentList.length === 0
    ) {

        return [];

    }


    /*
       Group students by department.
    */

    const departmentGroups = {};

    studentList.forEach(
        student => {

            const department =
                normalizeDepartment(
                    student?.department
                ) || "UNKNOWN";


            if (
                !departmentGroups[
                    department
                ]
            ) {

                departmentGroups[
                    department
                ] = [];

            }


            departmentGroups[
                department
            ].push(student);

        }
    );


    /*
       Shuffle every department group.
    */

    Object.values(
        departmentGroups
    ).forEach(
        group => {

            for (
                let i =
                    group.length - 1;
                i > 0;
                i--
            ) {

                const j =
                    Math.floor(
                        Math.random() *
                        (i + 1)
                    );


                [
                    group[i],
                    group[j]
                ] = [
                    group[j],
                    group[i]
                ];

            }

        }
    );


    /*
       Arrange departments in a
       rotating order.

       This prevents the students
       from one department appearing
       together in the initial order.
    */

    const departments =
        Object.keys(
            departmentGroups
        );


    /*
       Shuffle department order.
    */

    for (
        let i =
            departments.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            departments[i],
            departments[j]
        ] = [
            departments[j],
            departments[i]
        ];

    }


    /*
       Build the final mixed list.
    */

    const result = [];

    let remaining = true;

    while (remaining) {

        remaining = false;


        for (
            const department
            of departments
        ) {

            const group =
                departmentGroups[
                    department
                ];


            if (
                group &&
                group.length > 0
            ) {

                result.push(
                    group.shift()
                );

                remaining = true;

            }

        }

    }


    return result;

}
/* ==========================================
   FIND STUDENT EXAM PAPER
========================================== */

function findStudentExamPaper(
    student,
    exam
) {

    if (
        !student ||
        !exam ||
        !Array.isArray(
            exam.subjects
        )
    ) {

        return null;

    }


    const studentBatchId =
        getStudentBatchId(
            student
        );


    const studentSemester =
        Number(
            student.semester
        );


    const studentDepartment =
        normalizeDepartment(
            student.department
        );


    if (
        !studentBatchId ||
        !studentSemester ||
        !studentDepartment
    ) {

        return null;

    }


    const paper =
        exam.subjects.find(
            subject => {

                const subjectBatchId =
                    getIdValue(
                        subject.batch
                    );


                const subjectSemester =
                    Number(
                        subject.semester
                    );


                const subjectDepartment =
                    normalizeDepartment(
                        subject.department
                    );


                /*
                   Normal department match
                */

                if (
                    subjectDepartment ===
                    studentDepartment
                ) {

                    return (

                        subjectBatchId ===
                        studentBatchId

                        &&

                        subjectSemester ===
                        studentSemester

                    );

                }


                /*
                   Backward compatibility
                   for BCOM.CA/CP.
                */

                if (
                    subjectDepartment ===
                    "BCOM.CA/CP"
                ) {

                    return (

                        (
                            studentDepartment ===
                                "BCOM.CA"

                            ||

                            studentDepartment ===
                                "BCOM.CP"
                        )

                        &&

                        subjectBatchId ===
                        studentBatchId

                        &&

                        subjectSemester ===
                        studentSemester

                    );

                }


                return false;

            }
        );


    return paper || null;

}



/* ==========================================
   UPDATE SELECTED EXAM
========================================== */

function updateSelectedExam() {

    if (!examSelect) return;


    selectedExamId =
        examSelect.value;


    selectedExam =
        exams.find(
            exam =>
                String(exam._id) ===
                String(selectedExamId)
        );


    /* --------------------------------------
       NO EXAM SELECTED
    -------------------------------------- */

    if (!selectedExam) {

        students = [];

        seating = [];

        localStorage.removeItem(
            "smartseatGeneratedReport"
        );

        updateStatistics();

        updateAdditionalStatus();

        renderSeatingTable();

        return;

    }


    /* --------------------------------------
       PARTICIPATING BATCH + SEMESTERS
    -------------------------------------- */

    const participating =
        Array.isArray(
            selectedExam.participatingSemesters
        )
            ? selectedExam.participatingSemesters
            : [];


    if (!participating.length) {

        students = [];

        seating = [];

        updateStatistics();

        renderSeatingTable();

        showAlert(
            "No Participating Semesters",
            "This examination does not have any participating batch and semester configured.",
            "warning"
        );

        return;

    }


    /* --------------------------------------
       EXAM SUBJECTS
    -------------------------------------- */

    const examSubjects =
        Array.isArray(
            selectedExam.subjects
        )
            ? selectedExam.subjects
            : [];


    if (!examSubjects.length) {

        students = [];

        seating = [];

        updateStatistics();

        renderSeatingTable();

        showAlert(
            "No Examination Subjects",
            "This examination does not have any subjects configured.",
            "warning"
        );

        return;

    }


    /* --------------------------------------
       FIND ELIGIBLE STUDENTS
    -------------------------------------- */

    const examStudents =
        [];


    masterStudents.forEach(
        student => {

            const studentBatchId =
                getStudentBatchId(
                    student
                );


            const studentSemester =
                Number(
                    student.semester
                );


            const studentDepartment =
                normalizeDepartment(
                    student.department
                );


            if (
                !studentBatchId ||
                !studentSemester ||
                !studentDepartment
            ) {

                return;

            }


            /* --------------------------------
               Check Batch + Semester
            -------------------------------- */

            const participant =
                participating.find(
                    item => {

                        const participantBatchId =
                            getIdValue(
                                item.batch
                            );


                        return (

                            participantBatchId ===
                            studentBatchId

                            &&

                            Number(
                                item.semester
                            ) ===
                            studentSemester

                        );

                    }
                );


            if (!participant) {

                return;

            }


            /* --------------------------------
               Find EXACT examination paper
            -------------------------------- */

            const paper =
                findStudentExamPaper(
                    student,
                    selectedExam
                );


            if (!paper) {

                /*
                   Don't add the student yet.

                   We handle missing papers
                   below so the generator can
                   stop safely.
                */

                examStudents.push({

                    ...student,

                    __paperMissing: true,

                    __paper: null

                });

                return;

            }


            examStudents.push({

                ...student,

                __paperMissing: false,

                __paper: paper

            });

        }
    );


    /* --------------------------------------
       CHECK MISSING PAPER INFORMATION
    -------------------------------------- */

    const studentsWithoutPaper =
        examStudents.filter(
            student =>
                student.__paperMissing
        );


    if (
        studentsWithoutPaper.length > 0
    ) {

        console.error(
            "Students without examination paper:",
            studentsWithoutPaper
        );

        students = [];

        seating = [];

        updateStatistics();

        renderSeatingTable();

        showAlert(
            "Paper Information Missing",
            `${studentsWithoutPaper.length} student(s) could not be matched to an examination paper for their batch, semester and department. Seating cannot be generated safely.`,
            "error"
        );

        return;

    }


    /* --------------------------------------
       ADDITIONAL ENTRIES
    -------------------------------------- */

    const additionalStudents =
        getAdditionalStudents(
            selectedExam._id
        );


    /*
       Additional Entries must also have
       enough information to enforce the
       same-paper rule.

       We don't silently put unknown-paper
       students into the arrangement.
    */

    additionalStudents.forEach(
        student => {

            const paper =
                findStudentExamPaper(
                    student,
                    selectedExam
                );


            student.__paper =
                paper || null;


            student.__paperMissing =
                !paper;

        }
    );


    const additionalWithoutPaper =
        additionalStudents.filter(
            student =>
                student.__paperMissing
        );


    if (
        additionalWithoutPaper.length > 0
    ) {

        console.warn(
            "Additional entries without paper information:",
            additionalWithoutPaper
        );

        /*
           Don't add them to the seating pool.
           They can be handled later through
           Additional Entries with paper data.
        */

    }


    /* --------------------------------------
       COMBINE WITHOUT DUPLICATES
    -------------------------------------- */

    const combinedStudents =
        [
            ...examStudents
        ];


    const existingRegisters =
        new Set();


    examStudents.forEach(
        student => {

            const registerNumber =
                getRegisterNumber(
                    student
                );


            if (registerNumber) {

                existingRegisters.add(
                    registerNumber
                );

            }

        }
    );


    additionalStudents
        .filter(
            student =>
                !student.__paperMissing
        )
        .forEach(
            student => {

                const registerNumber =
                    getRegisterNumber(
                        student
                    );


                if (
                    registerNumber &&
                    !existingRegisters.has(
                        registerNumber
                    )
                ) {

                    combinedStudents.push(
                        student
                    );

                    existingRegisters.add(
                        registerNumber
                    );

                }

            }
        );


    /* --------------------------------------
       SAVE CURRENT STUDENTS
    -------------------------------------- */

    students =
        combinedStudents;


    /* --------------------------------------
       CLEAR OLD SEATING
    -------------------------------------- */

    seating = [];


    localStorage.removeItem(
        "smartseatGeneratedReport"
    );


    updateStatistics();

    updateAdditionalStatus();

    renderSeatingTable();


    /* --------------------------------------
       DEBUG INFORMATION
    -------------------------------------- */

    console.log(
        "================================"
    );

    console.log(
        "Selected Examination:",
        selectedExam.examName
    );

    console.log(
        "Participating Batch/Semesters:",
        participating
    );

    console.log(
        "Exam Subjects:",
        examSubjects
    );

    console.log(
        "Master Students:",
        masterStudents.length
    );

    console.log(
        "Eligible Students:",
        examStudents.length
    );

    console.log(
        "Additional Entries:",
        additionalStudents.length
    );

    console.log(
        "Total Students for Seating:",
        students.length
    );

    console.log(
        "================================"
    );

}


/* ==========================================
   ROOM CAPACITY
========================================== */

function getRoomCapacity(
    room
) {

    const left =
        Number(
            room?.rowsLeft || 0
        );


    const right =
        Number(
            room?.rowsRight || 0
        );


    const perBench =
        Number(
            room?.studentsPerBench || 0
        );


    return (
        (left + right) *
        perBench
    );

}


/* ==========================================
   CREATE PHYSICAL SEATS
========================================== */

function createRoomSeats(
    room
) {

    const seats = [];


    const rowsLeft =
        Number(
            room?.rowsLeft || 0
        );


    const rowsRight =
        Number(
            room?.rowsRight || 0
        );


    const studentsPerBench =
        Number(
            room?.studentsPerBench || 0
        );


    /* ======================================
       COLUMN A
    ====================================== */

    for (
        let bench = 1;
        bench <= rowsLeft;
        bench++
    ) {

        /*
           First position
           A
        */

        if (
            studentsPerBench >= 1
        ) {

            seats.push({

                roomId:
                    room._id,

                roomNumber:
                    room.roomNumber,

                column:
                    "A",

                bench,

                seat:
                    "A"

            });

        }


        /*
           Middle position
           C
        */

        if (
            studentsPerBench >= 3
        ) {

            seats.push({

                roomId:
                    room._id,

                roomNumber:
                    room.roomNumber,

                column:
                    "A",

                bench,

                seat:
                    "C"

            });

        }


        /*
           Third position
           B
        */

        if (
            studentsPerBench >= 2
        ) {

            seats.push({

                roomId:
                    room._id,

                roomNumber:
                    room.roomNumber,

                column:
                    "A",

                bench,

                seat:
                    "B"

            });

        }

    }


    /* ======================================
       COLUMN B
    ====================================== */

    for (
        let bench = 1;
        bench <= rowsRight;
        bench++
    ) {

        if (
            studentsPerBench >= 1
        ) {

            seats.push({

                roomId:
                    room._id,

                roomNumber:
                    room.roomNumber,

                column:
                    "B",

                bench,

                seat:
                    "A"

            });

        }


        if (
            studentsPerBench >= 3
        ) {

            seats.push({

                roomId:
                    room._id,

                roomNumber:
                    room.roomNumber,

                column:
                    "B",

                bench,

                seat:
                    "C"

            });

        }


        if (
            studentsPerBench >= 2
        ) {

            seats.push({

                roomId:
                    room._id,

                roomNumber:
                    room.roomNumber,

                column:
                    "B",

                bench,

                seat:
                    "B"

            });

        }

    }


    return seats;

}


/* ==========================================
   GROUP STUDENTS BY DEPARTMENT
========================================== */

function groupStudentsByDepartment(
    studentList
) {

    const groups = {};


    studentList.forEach(
        student => {

            const department =
                normalizeDepartment(
                    student.department
                );


            const key =
                department ||
                "UNKNOWN";


            if (
                !groups[key]
            ) {

                groups[key] = [];

            }


            groups[key].push(
                student
            );

        }
    );


    return groups;

}

/* ==========================================
   GET STUDENT PAPER
========================================== */

function getStudentPaperKey(student) {

    /*
       First use the paper already matched
       during updateSelectedExam().
    */

    if (
        student &&
        student.__paper
    ) {

        const paperKey =
            getPaperKey(
                student.__paper
            );

        if (paperKey) {
            return paperKey;
        }

    }


    /*
       Fallback:
       determine the paper directly from
       the student's department.
    */

    if (
        !selectedExam ||
        !Array.isArray(
            selectedExam.subjects
        )
    ) {

        return "UNKNOWN_PAPER";

    }


    const studentDepartment =
        normalizeDepartment(
            student?.department
        );


    if (!studentDepartment) {

        return "UNKNOWN_PAPER";

    }


    const matchingSubject =
        selectedExam.subjects.find(
            subject => {

                const departments =
                    Array.isArray(
                        subject?.departments
                    )
                        ? subject.departments
                        : [];


                return departments.some(
                    examDepartment => {

                        const normalized =
                            normalizeDepartment(
                                examDepartment
                            );


                        /*
                           BCOM.CA/CP represents
                           both BCOM.CA and BCOM.CP.
                        */

                        if (
                            normalized ===
                            "BCOM.CA/CP"
                        ) {

                            return (
                                studentDepartment ===
                                    "BCOM.CA" ||
                                studentDepartment ===
                                    "BCOM.CP"
                            );

                        }


                        return (
                            normalized ===
                            studentDepartment
                        );

                    }
                );

            }
        );


    if (!matchingSubject) {

        return "UNKNOWN_PAPER";

    }


    /*
       Prefer subject code.
    */

    if (
        matchingSubject.subjectCode &&
        String(
            matchingSubject.subjectCode
        ).trim()
    ) {

        return String(
            matchingSubject.subjectCode
        )
            .trim()
            .toUpperCase();

    }


    /*
       Otherwise use subject name.
    */

    if (
        matchingSubject.subjectName &&
        String(
            matchingSubject.subjectName
        ).trim()
    ) {

        return String(
            matchingSubject.subjectName
        )
            .trim()
            .toUpperCase();

    }


    return "UNKNOWN_PAPER";

}
/* ==========================================
   CHECK BENCH COMPATIBILITY
========================================== */

function canSitTogether(
    firstStudent,
    secondStudent,
    currentBenchStudents = []
) {

    const studentsOnBench = [
        ...currentBenchStudents
    ];

    /*
       --------------------------------------
       RULE 1
       Different departments only
       --------------------------------------
    */

    const firstDepartment =
        normalizeDepartment(
            firstStudent?.department
        );

    const secondDepartment =
        normalizeDepartment(
            secondStudent?.department
        );

    if (
        firstDepartment &&
        secondDepartment &&
        firstDepartment ===
            secondDepartment
    ) {

        return false;

    }


    /*
       --------------------------------------
       RULE 2
       Same paper cannot share bench
       --------------------------------------
    */

    const firstPaper =
        getStudentPaperKey(
            firstStudent
        );

    const secondPaper =
        getStudentPaperKey(
            secondStudent
        );

    if (
        firstPaper &&
        secondPaper &&
        firstPaper === secondPaper
    ) {

        return false;

    }


    /*
       --------------------------------------
       Check against every student already
       placed on this bench.
       --------------------------------------
    */

    for (
        const existingStudent
        of studentsOnBench
    ) {

        const existingDepartment =
            normalizeDepartment(
                existingStudent?.department
            );

        const existingPaper =
            getStudentPaperKey(
                existingStudent
            );


        /*
           Same department
        */

        if (
            existingDepartment &&
            firstDepartment &&
            existingDepartment ===
                firstDepartment
        ) {

            return false;

        }


        /*
           Same paper
        */

        if (
            existingPaper &&
            firstPaper &&
            existingPaper ===
                firstPaper
        ) {

            return false;

        }

    }


    return true;

}


/* ==========================================
   CREATE VALID BENCH GROUP
========================================== */

function createBenchGroup(
    availableStudents,
    benchSize
) {

    if (
        !Array.isArray(
            availableStudents
        ) ||
        availableStudents.length === 0
    ) {

        return null;

    }


    /*
       Start with the student who has the
       highest number of remaining students
       from the same department.

       This helps prevent one department
       getting stranded near the end.
    */

    const departmentCounts = {};

    availableStudents.forEach(
        student => {

            const department =
                normalizeDepartment(
                    student?.department
                ) || "UNKNOWN";

            departmentCounts[department] =
                (
                    departmentCounts[
                        department
                    ] || 0
                ) + 1;

        }
    );


    const sortedStudents =
        [...availableStudents].sort(
            (a, b) => {

                const deptA =
                    normalizeDepartment(
                        a?.department
                    ) || "UNKNOWN";

                const deptB =
                    normalizeDepartment(
                        b?.department
                    ) || "UNKNOWN";

                return (
                    departmentCounts[deptB] -
                    departmentCounts[deptA]
                );

            }
        );


    /*
       Try each possible first student.

       This gives us a much better chance of
       finding a valid combination than simply
       taking students in database order.
    */

    for (
        const firstStudent
        of sortedStudents
    ) {

        const group = [
            firstStudent
        ];


        /*
           Candidates must be compatible with
           everybody already on the bench.
        */

        const candidates =
            availableStudents
                .filter(
                    student =>
                        student !==
                        firstStudent
                )
                .filter(
                    student =>
                        canSitTogether(
                            student,
                            firstStudent,
                            group
                        )
                );


        /*
           Prefer candidates whose department
           and paper are less represented in the
           remaining students.
        */

        candidates.sort(
            (a, b) => {

                const deptA =
                    normalizeDepartment(
                        a?.department
                    ) || "UNKNOWN";

                const deptB =
                    normalizeDepartment(
                        b?.department
                    ) || "UNKNOWN";

                return (
                    (
                        departmentCounts[
                            deptB
                        ] || 0
                    ) -
                    (
                        departmentCounts[
                            deptA
                        ] || 0
                    )
                );

            }
        );


        for (
            const candidate
            of candidates
        ) {

            if (
                canSitTogether(
                    candidate,
                    firstStudent,
                    group
                )
            ) {

                group.push(
                    candidate
                );

            }


            if (
                group.length >=
                benchSize
            ) {

                return group;

            }

        }

    }


    /*
       No valid group found.
    */

    return null;

}


/* ==========================================
   BUILD COMPLETE VALID SEATING
========================================== */

function createValidSeatingOrder(
    studentList,
    benchDefinitions
) {

    if (
        !Array.isArray(studentList) ||
        !Array.isArray(benchDefinitions)
    ) {

        return null;

    }


    let remainingStudents =
        [...studentList];

    const result = [];


    /*
       Process each physical bench.
    */

    for (
        const bench
        of benchDefinitions
    ) {

        if (
            remainingStudents.length === 0
        ) {

            break;

        }


        const benchSize =
            bench.seats.length;


        /*
           If fewer students remain than
           the physical bench size, we can
           use the remaining students only if
           the room physically permits it.
        */

        const actualBenchSize =
            Math.min(
                benchSize,
                remainingStudents.length
            );


        const group =
            createBenchGroup(
                remainingStudents,
                actualBenchSize
            );


        if (!group) {

            return {
                success: false,

                reason:
                    `Unable to create a valid bench in Room ${bench.roomNumber}, Column ${bench.column}, Bench ${bench.bench}.`
            };

        }


        /*
           Add students to the result in the
           exact physical seat order.
        */

        group.forEach(
            (student, index) => {

                const physicalSeat =
                    bench.seats[index];

                result.push({

                    student,

                    physicalSeat

                });

            }
        );


        /*
           Remove allocated students.
        */

        const allocatedRegisters =
            new Set(
                group.map(
                    student =>
                        getRegisterNumber(
                            student
                        )
                )
            );


        remainingStudents =
            remainingStudents.filter(
                student =>
                    !allocatedRegisters.has(
                        getRegisterNumber(
                            student
                        )
                    )
            );

    }


    /*
       If anybody remains, capacity/rules
       could not accommodate them.
    */

    if (
        remainingStudents.length > 0
    ) {

        return {

            success: false,

            reason:
                `${remainingStudents.length} students could not be seated while maintaining the seating rules.`

        };

    }


    return {

        success: true,

        allocations: result

    };

}

/* ==========================================
   CHECK IF STUDENTS CAN SHARE A BENCH
========================================== */

function canShareBench(existingStudents, candidate) {

    if (!Array.isArray(existingStudents)) {
        return true;
    }

    const candidateDepartment =
        normalizeDepartment(
            candidate?.department
        );

    const candidatePaper =
        getStudentPaperKey(candidate);

    const candidateBatch =
        getStudentBatchId(candidate);

    for (const existingStudent of existingStudents) {

        const existingDepartment =
            normalizeDepartment(
                existingStudent?.department
            );

        const existingPaper =
            getStudentPaperKey(existingStudent);

        const existingBatch =
            getStudentBatchId(existingStudent);

        /* ======================================
           RULE 1 — SAME PAPER = NEVER
        ====================================== */

        if (
            candidatePaper &&
            existingPaper &&
            candidatePaper !== "UNKNOWN" &&
            existingPaper !== "UNKNOWN" &&
            candidatePaper === existingPaper
        ) {

            return false;

        }


        /* ======================================
           RULE 2 — SAME DEPARTMENT
           SAME BATCH = NOT ALLOWED
        ====================================== */

        if (
            candidateDepartment &&
            existingDepartment &&
            candidateDepartment === existingDepartment
        ) {

            /*
               Different batches are allowed
               on the same bench.
            */

            if (
                !candidateBatch ||
                !existingBatch ||
                candidateBatch === existingBatch
            ) {

                return false;

            }

        }

    }

    return true;

}

/* ==========================================
   GENERATION PROGRESS
========================================== */

function showGenerationProgress() {

    if (
        typeof Swal === "undefined"
    ) {

        return;

    }


    Swal.fire({

        title:
            "Generating Seating Arrangement",

        html: `

            <div
                style="
                    text-align:center;
                    padding:10px;
                "
            >

                <div
                    id="seatingProgressText"
                    style="
                        font-size:16px;
                        font-weight:600;
                        margin-bottom:15px;
                    "
                >
                    Preparing students...
                </div>


                <div
                    style="
                        width:100%;
                        height:10px;
                        background:#e5e7eb;
                        border-radius:10px;
                        overflow:hidden;
                    "
                >

                    <div
                        id="seatingProgressBar"
                        style="
                            width:0%;
                            height:100%;
                            background:#1687f8;
                            transition:width .4s ease;
                        "
                    ></div>

                </div>


                <div
                    id="seatingProgressPercent"
                    style="
                        margin-top:10px;
                        font-size:14px;
                    "
                >
                    0%
                </div>

            </div>

        `,

        allowOutsideClick:
            false,

        allowEscapeKey:
            false,

        showConfirmButton:
            false

    });

}


/* ==========================================
   UPDATE PROGRESS
========================================== */

function updateGenerationProgress(
    percent,
    message
) {

    const bar =
        document.getElementById(
            "seatingProgressBar"
        );


    const text =
        document.getElementById(
            "seatingProgressText"
        );


    const percentage =
        document.getElementById(
            "seatingProgressPercent"
        );


    if (bar) {

        bar.style.width =
            `${percent}%`;

    }


    if (text) {

        text.textContent =
            message;

    }


    if (percentage) {

        percentage.textContent =
            `${percent}%`;

    }

}


/* ==========================================
   DELAY
========================================== */

function wait(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}

async function saveSeatingToDatabase() {
    if (!selectedExam || !selectedExam._id) {
        console.error("❌ No selected exam found.");
        return false;
    }

    if (!Array.isArray(seating)) {
        console.error("❌ Seating data is invalid.");
        return false;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("❌ Teacher authentication token not found.");
        return false;
    }

    try {
        const response = await fetch(`${SEATING_API}/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                examId: selectedExam._id,
                seating: seating
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Failed to save seating:", data);
            return false;
        }

        console.log("✅ Seating saved to MongoDB.");

        return true;

    } catch (error) {
        console.error("❌ Seating database error:", error);
        return false;
    }
}

/* ==========================================
   GENERATE SEATING
========================================== */

async function generateSeating() {

    /* --------------------------------------
       VALIDATION
    -------------------------------------- */

    if (!selectedExam) {

        await showAlert(
            "Select Examination",
            "Please select an examination first.",
            "warning"
        );

        return;

    }


    if (!students.length) {

        await showAlert(
            "No Students",
            "No students are available for this examination.",
            "warning"
        );

        return;

    }


    if (!rooms.length) {

        await showAlert(
            "No Rooms",
            "No examination rooms are configured.",
            "warning"
        );

        return;

    }


    /* --------------------------------------
       OPEN PROGRESS
    -------------------------------------- */

    showGenerationProgress();


    /* --------------------------------------
       STEP 1
    -------------------------------------- */

    updateGenerationProgress(
        10,
        `Preparing ${students.length} students...`
    );

    await wait(400);


    /* --------------------------------------
       STEP 2
    -------------------------------------- */

    updateGenerationProgress(
        25,
        `Checking ${rooms.length} examination rooms...`
    );

    await wait(400);


    /* --------------------------------------
       STEP 3
    -------------------------------------- */

    updateGenerationProgress(
        40,
        "Creating physical seating positions..."
    );


    const allSeats = [];


    rooms.forEach(
        room => {

            const roomSeats =
                createRoomSeats(
                    room
                );


            allSeats.push(
                ...roomSeats
            );

        }
    );


    await wait(500);


    /* --------------------------------------
       CAPACITY CHECK
    -------------------------------------- */

    if (
        students.length >
        allSeats.length
    ) {

        Swal.close();


        await showAlert(
            "Insufficient Capacity",
            `${students.length} students require seats, but only ${allSeats.length} physical seats are available.`,
            "error"
        );

        return;

    }


    /* --------------------------------------
       STEP 4
    -------------------------------------- */

    updateGenerationProgress(
        55,
        "Arranging students by department..."
    );


    const orderedStudents =
        createMixedStudentOrder(
            [...students]
        );


    await wait(500);

/* --------------------------------------
   STEP 5
-------------------------------------- */

updateGenerationProgress(
    70,
    "Creating valid mixed benches..."
);

seating = [];


/* =========================================================
   NATURAL REGISTER NUMBER SORT
========================================================= */

function compareRegisterNumbers(a, b) {

    const regA =
        String(
            getRegisterNumber(a) || ""
        ).toUpperCase();

    const regB =
        String(
            getRegisterNumber(b) || ""
        ).toUpperCase();


    const matchA =
        regA.match(/^(.*?)(\d+)$/);

    const matchB =
        regB.match(/^(.*?)(\d+)$/);


    if (
        matchA &&
        matchB
    ) {

        const prefixA =
            matchA[1];

        const prefixB =
            matchB[1];


        if (
            prefixA !== prefixB
        ) {

            return prefixA.localeCompare(
                prefixB
            );

        }


        return (
            Number(matchA[2]) -
            Number(matchB[2])
        );

    }


    return regA.localeCompare(
        regB,
        undefined,
        {
            numeric: true
        }
    );

}


/* =========================================================
   STUDENT GROUP KEY
========================================================= */

function getLocalStudentGroupKey(student) {

    const department =
        normalizeDepartment(
            student?.department
        ) ||
        "UNKNOWN_DEPARTMENT";


    const batch =
        getStudentBatchId(
            student
        ) ||
        "UNKNOWN_BATCH";


    const paper =
        getStudentPaperKey(
            student
        ) ||
        "UNKNOWN_PAPER";


    return [
        department,
        batch,
        paper
    ].join("|");

}


/* =========================================================
   CREATE ALL PHYSICAL BENCH SLOTS
=========================================================

   IMPORTANT:

   At this stage we IGNORE rooms.

   We only care about the physical number
   of seats available.

   Rooms will be assigned AFTER valid benches
   are created.
========================================================= */

const physicalBenchSlots = [];


rooms.forEach(
    room => {

        const rowsLeft =
            Number(
                room?.rowsLeft || 0
            );


        const rowsRight =
            Number(
                room?.rowsRight || 0
            );


        const studentsPerBench =
            Number(
                room?.studentsPerBench || 0
            );


        if (
            studentsPerBench !== 2 &&
            studentsPerBench !== 3
        ) {

            return;

        }


        /*
           COLUMN A
        */

        for (
            let bench = 1;
            bench <= rowsLeft;
            bench++
        ) {

            physicalBenchSlots.push({

                roomId:
                    room._id,

                roomNumber:
                    room.roomNumber,

                column:
                    "A",

                bench,

                capacity:
                    studentsPerBench

            });

        }


        /*
           COLUMN B
        */

        for (
            let bench = 1;
            bench <= rowsRight;
            bench++
        ) {

            physicalBenchSlots.push({

                roomId:
                    room._id,

                roomNumber:
                    room.roomNumber,

                column:
                    "B",

                bench,

                capacity:
                    studentsPerBench

            });

        }

    }
);


/* =========================================================
   CAPACITY CHECK
========================================================= */

const physicalCapacity =
    physicalBenchSlots.reduce(
        (
            total,
            bench
        ) =>
            total +
            bench.capacity,
        0
    );


if (
    students.length >
    physicalCapacity
) {

    Swal.close();


    await showAlert(
        "Insufficient Capacity",
        `${students.length} students require seats, but only ${physicalCapacity} physical seats are available.`,
        "error"
    );


    return;

}


/* =========================================================
   GROUP STUDENTS
========================================================= */

const groupedStudents =
    new Map();


students.forEach(
    student => {

        const key =
            getLocalStudentGroupKey(
                student
            );


        if (
            !groupedStudents.has(key)
        ) {

            groupedStudents.set(
                key,
                []
            );

        }


        groupedStudents
            .get(key)
            .push(student);

    }
);


/*
   Sort every group naturally.

   This is important because later, when
   we put class blocks into rooms, the
   register numbers remain natural.
*/

groupedStudents.forEach(
    group => {

        group.sort(
            compareRegisterNumbers
        );

    }
);


/* =========================================================
   BUILD WORKING STUDENT POOL
========================================================= */

function createWorkingPool() {

    const pool = [];


    students.forEach(
        student => {

            pool.push({

                student,

                groupKey:
                    getLocalStudentGroupKey(
                        student
                    )

            });

        }
    );


    return pool;

}


/* =========================================================
   FIND BEST FIRST STUDENT
=========================================================

   We prefer students belonging to the largest
   remaining group.

   This prevents a small class from becoming
   stranded at the end.
========================================================= */

function chooseSeedStudent(
    pool
) {

    if (
        !pool.length
    ) {

        return null;

    }


    const groupCounts =
        new Map();


    pool.forEach(
        item => {

            const count =
                groupCounts.get(
                    item.groupKey
                ) || 0;


            groupCounts.set(
                item.groupKey,
                count + 1
            );

        }
    );


    const sorted =
        [...pool].sort(
            (
                a,
                b
            ) => {

                const countA =
                    groupCounts.get(
                        a.groupKey
                    ) || 0;


                const countB =
                    groupCounts.get(
                        b.groupKey
                    ) || 0;


                /*
                   Larger groups first.
                */

                if (
                    countA !==
                    countB
                ) {

                    return (
                        countB -
                        countA
                    );

                }


                /*
                   Then natural register order.
                */

                return compareRegisterNumbers(
                    a.student,
                    b.student
                );

            }
        );


    /*
       Take from the first few students
       of the largest group.

       Small randomness prevents the exact
       same failed arrangement every time.
    */

    const topCount =
        Math.min(
            5,
            sorted.length
        );


    return sorted[
        Math.floor(
            Math.random() *
            topCount
        )
    ];

}


/* =========================================================
   FIND COMPATIBLE STUDENT
========================================================= */

function chooseCompatibleStudent(
    currentBench,
    pool,
    excludedKeys
) {

    const candidates = [];


    for (
        const item
        of pool
    ) {

        if (
            excludedKeys.has(
                item.student
            )
        ) {

            continue;

        }


        if (
            canShareBench(
                currentBench,
                item.student
            )
        ) {

            candidates.push(
                item
            );

        }

    }


    if (
        !candidates.length
    ) {

        return null;

    }


    /*
       Count how many students remain
       from each group.
    */

    const groupCounts =
        new Map();


    pool.forEach(
        item => {

            const count =
                groupCounts.get(
                    item.groupKey
                ) || 0;


            groupCounts.set(
                item.groupKey,
                count + 1
            );

        }
    );


    candidates.sort(
        (
            a,
            b
        ) => {

            const countA =
                groupCounts.get(
                    a.groupKey
                ) || 0;


            const countB =
                groupCounts.get(
                    b.groupKey
                ) || 0;


            /*
               Prefer larger groups.

               This helps keep class ranges
               together later.
            */

            if (
                countA !==
                countB
            ) {

                return (
                    countB -
                    countA
                );

            }


            return compareRegisterNumbers(
                a.student,
                b.student
            );

        }
    );


    /*
       Pick from the top compatible candidates.
    */

    const topCount =
        Math.min(
            5,
            candidates.length
        );


    return candidates[
        Math.floor(
            Math.random() *
            topCount
        )
    ];

}


/* =========================================================
   BUILD ONE COMPLETE VALID BENCH
========================================================= */

function createValidBench(
    pool,
    capacity
) {

    if (
        !pool.length
    ) {

        return null;

    }


    const seed =
        chooseSeedStudent(
            pool
        );


    if (
        !seed
    ) {

        return null;

    }


    const benchStudents = [
        seed.student
    ];


    const used =
        new Set();


    used.add(
        seed.student
    );


    while (
        benchStudents.length <
        capacity
    ) {

        const next =
            chooseCompatibleStudent(
                benchStudents,
                pool,
                used
            );


        if (
            !next
        ) {

            /*
               This bench could not be filled.
            */

            return null;

        }


        benchStudents.push(
            next.student
        );


        used.add(
            next.student
        );

    }


    /*
       Final strict validation.
    */

    for (
        let i = 0;
        i <
        benchStudents.length;
        i++
    ) {

        for (
            let j = i + 1;
            j <
            benchStudents.length;
            j++
        ) {

            if (
                !canShareBench(
                    [benchStudents[i]],
                    benchStudents[j]
                )
            ) {

                return null;

            }

        }

    }


    return benchStudents;

}


/* =========================================================
   REMOVE STUDENTS FROM POOL
========================================================= */

function removeBenchStudents(
    pool,
    benchStudents
) {

    const used =
        new Set(
            benchStudents
        );


    return pool.filter(
        item =>
            !used.has(
                item.student
            )
    );

}

/* =========================================================
   GLOBAL VALID SEATING GENERATION
=========================================================

   IMPORTANT:

   We build benches from CLASS GROUP QUEUES.

   Each group is:

   Department + Batch + Paper

   Students inside every group are already sorted
   naturally by register number.

   Example:

   BCOM.CA | Batch 2024 | Paper X

   MD24CCAR001
   MD24CCAR002
   MD24CCAR003
   MD24CCAR004
   ...

   We always consume them in this order.

========================================================= */


/* =========================================================
   BUILD GROUP QUEUES
========================================================= */

function createGroupQueues() {

    return [
        ...groupedStudents.entries()
    ]
    .map(
        (
            [key, groupStudents]
        ) => ({

            key,

            students:
                [...groupStudents],

            index:
                0

        })
    );

}


/* =========================================================
   REMAINING STUDENTS IN GROUP
========================================================= */

function getGroupRemaining(
    group
) {

    return (
        group.students.length -
        group.index
    );

}


/* =========================================================
   GET NEXT STUDENT FROM GROUP
========================================================= */

function getGroupHead(
    group
) {

    if (
        !group ||
        group.index >=
        group.students.length
    ) {

        return null;

    }

    return group.students[
        group.index
    ];

}


/* =========================================================
   CHECK GROUP COMPATIBILITY
========================================================= */

function canGroupJoinBench(
    selectedGroups,
    candidateGroup
) {

    const candidate =
        getGroupHead(
            candidateGroup
        );

    if (!candidate) {

        return false;

    }


    const currentStudents =
        selectedGroups
            .map(
                group =>
                    getGroupHead(
                        group
                    )
            )
            .filter(Boolean);


    return canShareBench(
        currentStudents,
        candidate
    );

}


/* =========================================================
   FIND COMPATIBLE GROUP COMBINATION
========================================================= */

function findCompatibleGroupCombination(
    queues,
    capacity
) {

    const activeGroups =
        queues.filter(
            group =>
                getGroupRemaining(
                    group
                ) > 0
        );


    if (
        activeGroups.length <
        capacity
    ) {

        return null;

    }


    /*
       Larger groups first.

       This keeps large classes moving
       continuously instead of leaving
       scattered leftovers.
    */

    const seedGroups =
        [...activeGroups]
            .sort(
                (
                    a,
                    b
                ) => {

                    const countDifference =
                        getGroupRemaining(b) -
                        getGroupRemaining(a);

                    if (
                        countDifference !== 0
                    ) {

                        return countDifference;

                    }


                    return compareRegisterNumbers(
                        getGroupHead(a),
                        getGroupHead(b)
                    );

                }
            );


    /*
       Try the largest groups first.

       If one combination gets stuck,
       try another group.
    */

    const maxSeeds =
        Math.min(
            20,
            seedGroups.length
        );


    for (
        let seedIndex = 0;
        seedIndex < maxSeeds;
        seedIndex++
    ) {

        const seed =
            seedGroups[
                seedIndex
            ];


        const selected = [
            seed
        ];


        /*
           Recursive search.

           This is important because a simple
           greedy choice can create an impossible
           final group.
        */

        function searchCombination() {

            if (
                selected.length ===
                capacity
            ) {

                return [
                    ...selected
                ];

            }


            const candidates =
                activeGroups
                    .filter(
                        group =>
                            !selected.includes(
                                group
                            ) &&
                            canGroupJoinBench(
                                selected,
                                group
                            )
                    )
                    .sort(
                        (
                            a,
                            b
                        ) => {

                            const remainingDifference =
                                getGroupRemaining(b) -
                                getGroupRemaining(a);

                            if (
                                remainingDifference !== 0
                            ) {

                                return remainingDifference;

                            }


                            return compareRegisterNumbers(
                                getGroupHead(a),
                                getGroupHead(b)
                            );

                        }
                    );


            /*
               Small random variation.

               This allows another global attempt
               to produce a different valid pattern.
            */

            if (
                candidates.length > 1
            ) {

                const top =
                    Math.min(
                        5,
                        candidates.length
                    );


                const firstCandidates =
                    candidates.slice(
                        0,
                        top
                    );


                firstCandidates.sort(
                    () =>
                        Math.random() - 0.5
                );


                candidates.splice(
                    0,
                    top,
                    ...firstCandidates
                );

            }


            /*
               Try candidates one by one.
            */

            for (
                const candidate
                of candidates
            ) {

                selected.push(
                    candidate
                );


                const result =
                    searchCombination();


                if (result) {

                    return result;

                }


                selected.pop();

            }


            return null;

        }


        const result =
            searchCombination();


        if (result) {

            return result;

        }

    }


    return null;

}


/* =========================================================
   BUILD CAPACITY PLAN
=========================================================

   Example:

   632 students
   633 physical seats

   becomes:

   210 benches × 3 students
   1 bench × 2 students

   This avoids creating unnecessary
   one-student leftovers.

========================================================= */

function buildBenchCapacityPlan() {

    const threeSeatCount =
        physicalBenchSlots.filter(
            slot =>
                slot.capacity === 3
        ).length;


    const twoSeatCount =
        physicalBenchSlots.filter(
            slot =>
                slot.capacity === 2
        ).length;


    const totalStudents =
        students.length;


    /*
       Try the maximum possible number
       of full 3-student benches first.
    */

    for (
        let fullThreeBenches =
            Math.min(
                threeSeatCount,
                Math.floor(
                    totalStudents / 3
                )
            );

        fullThreeBenches >= 0;

        fullThreeBenches--
    ) {

        const remainingAfterThree =
            totalStudents -
            (
                fullThreeBenches * 3
            );


        /*
           Remaining students can occupy
           2-student benches.

           A 2-student group can also use
           a 3-seat physical bench.
        */

        const remainingPhysicalSlots =
            (
                threeSeatCount -
                fullThreeBenches
            ) +
            twoSeatCount;


        const maxTwoBenches =
            Math.min(
                Math.floor(
                    remainingAfterThree / 2
                ),
                remainingPhysicalSlots
            );


        for (
            let twoBenches =
                maxTwoBenches;

            twoBenches >= 0;

            twoBenches--
        ) {

            const remaining =
                remainingAfterThree -
                (
                    twoBenches * 2
                );


            /*
               No leftover.
            */

            if (
                remaining === 0
            ) {

                return [
                    ...Array(
                        fullThreeBenches
                    ).fill(3),

                    ...Array(
                        twoBenches
                    ).fill(2)
                ];

            }

        }


    }


    return null;

}


/* =========================================================
   FIND PHYSICAL SLOT FOR BENCH
========================================================= */

function findPhysicalSlotForCapacity(
    availableSlots,
    requiredCapacity
) {

    /*
       Exact capacity first.
    */

    let index =
        availableSlots.findIndex(
            slot =>
                slot.capacity ===
                requiredCapacity
        );


    if (
        index !== -1
    ) {

        return availableSlots.splice(
            index,
            1
        )[0];

    }


    /*
       A smaller group can use a larger
       physical bench.
    */

    index =
        availableSlots.findIndex(
            slot =>
                slot.capacity >=
                requiredCapacity
        );


    if (
        index !== -1
    ) {

        return availableSlots.splice(
            index,
            1
        )[0];

    }


    return null;

}


/* =========================================================
   GLOBAL GENERATION
========================================================= */

let successfulBenchGroups =
    null;


const MAX_GLOBAL_ATTEMPTS =
    500;


const capacityPlan =
    buildBenchCapacityPlan();


if (
    !capacityPlan
) {

    Swal.close();


    await showAlert(
        "Capacity Configuration Error",
        "SmartSeat could not create a valid bench-size plan from the configured rooms.",
        "error"
    );


    seating = [];


    updateStatistics();

    renderSeatingTable();


    return;

}


/* =========================================================
   TRY GLOBAL ARRANGEMENT
========================================================= */

for (
    let attempt = 1;

    attempt <=
    MAX_GLOBAL_ATTEMPTS;

    attempt++
) {

    if (
        attempt === 1 ||
        attempt % 25 === 0
    ) {

        updateGenerationProgress(
            70,
            `Creating valid class-wise benches... ${attempt}/${MAX_GLOBAL_ATTEMPTS}`
        );

    }


    const queues =
        createGroupQueues();


    const generatedBenches =
        [];


    let failed =
        false;


    /*
       Build every bench.

       Students are taken from the HEAD
       of their class group queue.

       Therefore:

       001 → 002 → 003 → 004

       is preserved.
    */

    for (
        const capacity
        of capacityPlan
    ) {

        if (
            queues.every(
                group =>
                    getGroupRemaining(
                        group
                    ) === 0
            )
        ) {

            break;

        }


        const selectedGroups =
            findCompatibleGroupCombination(
                queues,
                capacity
            );


        if (
            !selectedGroups
        ) {

            failed =
                true;

            break;

        }


        const benchStudents =
            selectedGroups.map(
                group => {

                    const student =
                        getGroupHead(
                            group
                        );


                    group.index++;


                    return student;

                }
            );


        /*
           Strict validation immediately.
        */

        let valid =
            true;


        for (
            let i = 0;

            i <
            benchStudents.length;

            i++
        ) {

            for (
                let j = i + 1;

                j <
                benchStudents.length;

                j++
            ) {

                if (
                    !canShareBench(
                        [benchStudents[i]],
                        benchStudents[j]
                    )
                ) {

                    valid =
                        false;

                    break;

                }

            }


            if (
                !valid
            ) {

                break;

            }

        }


        if (
            !valid
        ) {

            failed =
                true;

            break;

        }


        /*
           The first group becomes the
           room-order anchor.

           This is what allows us to create
           visible class blocks later.
        */

        generatedBenches.push({

            capacity,

            students:
                benchStudents,

            primaryGroup:
                selectedGroups[0].key

        });

    }


    if (
        failed
    ) {

        continue;

    }


    /*
       Verify that every student was consumed.
    */

    const remainingStudents =
        queues.reduce(
            (
                total,
                group
            ) =>
                total +
                getGroupRemaining(
                    group
                ),
            0
        );


    if (
        remainingStudents !== 0
    ) {

        continue;

    }


    /*
       Verify total count.
    */

    const generatedCount =
        generatedBenches.reduce(
            (
                total,
                bench
            ) =>
                total +
                bench.students.length,
            0
        );


    if (
        generatedCount !==
        students.length
    ) {

        continue;

    }


    /*
       Final strict bench validation.
    */

    let allValid =
        true;


    for (
        const bench
        of generatedBenches
    ) {

        for (
            let i = 0;

            i <
            bench.students.length;

            i++
        ) {

            for (
                let j = i + 1;

                j <
                bench.students.length;

                j++
            ) {

                if (
                    !canShareBench(
                        [bench.students[i]],
                        bench.students[j]
                    )
                ) {

                    allValid =
                        false;

                    break;

                }

            }


            if (
                !allValid
            ) {

                break;

            }

        }


        if (
            !allValid
        ) {

            break;

        }

    }


    if (
        allValid
    ) {

        successfulBenchGroups =
            generatedBenches;

        break;

    }

}


/* =========================================================
   GLOBAL GENERATION FAILED
========================================================= */

if (
    !successfulBenchGroups
) {

    Swal.close();


    await showAlert(
        "Seating Rules Could Not Be Satisfied",
        "SmartSeat could not create a valid combination of department, batch and paper groups. No students were partially allocated.",
        "error"
    );


    seating = [];


    updateStatistics();

    renderSeatingTable();


    return;

}

/* =========================================================
   ARRANGE VALID BENCHES INTO TEACHER-STYLE ROOM BLOCKS
========================================================= */

updateGenerationProgress(
    84,
    "Arranging valid benches into teacher-style room blocks..."
);


/*
   IMPORTANT:

   The benches are ALREADY valid.

   We do NOT change the students inside a bench.

   We only decide WHICH valid bench goes into
   WHICH room.

   Goal:

   Room 1
   -------------------------
   BCOM.CA
   BCOM.CP
   BBA.TTM

   Room 2
   -------------------------
   BBA.TTM
   BA.ENG
   BA.ECO

   etc.

   We try to keep students from the same
   class/group together instead of scattering
   them across many rooms.
*/


/* =========================================================
   GET GROUP KEYS FROM A BENCH
========================================================= */

function getBenchGroupKeys(
    bench
) {

    return [
        ...new Set(
            bench.students.map(
                student =>
                    getLocalStudentGroupKey(
                        student
                    )
            )
        )
    ];

}


/* =========================================================
   BENCH REGISTER ORDER
========================================================= */

function getBenchFirstStudent(
    bench
) {

    return [...bench.students]
        .sort(
            compareRegisterNumbers
        )[0];

}


/* =========================================================
   REMAINING BENCHES
========================================================= */

const remainingRoomBenches =
    [...successfulBenchGroups];


/* =========================================================
   COUNT HOW MANY BENCHES BELONG TO EACH GROUP
========================================================= */

const groupBenchCounts =
    new Map();


remainingRoomBenches.forEach(
    bench => {

        const groupKeys =
            getBenchGroupKeys(
                bench
            );

        groupKeys.forEach(
            key => {

                groupBenchCounts.set(
                    key,
                    (
                        groupBenchCounts.get(
                            key
                        ) || 0
                    ) + 1
                );

            }
        );

    }
);


/* =========================================================
   UPDATE GROUP COUNTS AFTER USING A BENCH
========================================================= */

function removeBenchFromGroupCounts(
    bench
) {

    const groupKeys =
        getBenchGroupKeys(
            bench
        );

    groupKeys.forEach(
        key => {

            const current =
                groupBenchCounts.get(
                    key
                ) || 0;

            groupBenchCounts.set(
                key,
                Math.max(
                    0,
                    current - 1
                )
            );

        }
    );

}


/* =========================================================
   CHOOSE THE FIRST BENCH FOR A ROOM
========================================================= */

function chooseRoomSeedBench(
    candidates
) {

    if (
        !candidates.length
    ) {

        return null;

    }


    return [...candidates]
        .sort(
            (
                a,
                b
            ) => {

                const groupsA =
                    getBenchGroupKeys(
                        a
                    );

                const groupsB =
                    getBenchGroupKeys(
                        b
                    );


                const weightA =
                    groupsA.reduce(
                        (
                            total,
                            key
                        ) =>
                            total +
                            (
                                groupBenchCounts.get(
                                    key
                                ) || 0
                            ),
                        0
                    );


                const weightB =
                    groupsB.reduce(
                        (
                            total,
                            key
                        ) =>
                            total +
                            (
                                groupBenchCounts.get(
                                    key
                                ) || 0
                            ),
                        0
                    );


                if (
                    weightA !==
                    weightB
                ) {

                    return (
                        weightB -
                        weightA
                    );

                }


                return compareRegisterNumbers(
                    getBenchFirstStudent(
                        a
                    ),
                    getBenchFirstStudent(
                        b
                    )
                );

            }
        )[0];

}


/* =========================================================
   CHOOSE NEXT BENCH FOR CURRENT ROOM
========================================================= */

function chooseBenchForRoom(
    candidates,
    slot,
    roomGroups
) {

    if (
        !candidates.length
    ) {

        return null;

    }


    let bestBench =
        null;

    let bestScore =
        -Infinity;


    candidates.forEach(
        bench => {

            const groupKeys =
                getBenchGroupKeys(
                    bench
                );


            const exactCapacity =
                bench.students.length ===
                slot.capacity;


            /*
               How many groups in this bench
               are already present in this room?
            */

            const overlap =
                groupKeys.filter(
                    key =>
                        roomGroups.has(
                            key
                        )
                ).length;


            /*
               Penalize introducing a class that
               has only one remaining bench.

               This is what helps prevent:

               BBA.AVH -> 1

               appearing alone at the end
               of a room.
            */

            const newSingletonGroups =
                groupKeys.filter(
                    key =>
                        !roomGroups.has(
                            key
                        ) &&
                        (
                            groupBenchCounts.get(
                                key
                            ) || 0
                        ) === 1
                ).length;


            /*
               Prefer groups that still have
               many benches remaining.

               This keeps their ranges together.
            */

            const remainingGroupWeight =
                groupKeys.reduce(
                    (
                        total,
                        key
                    ) =>
                        total +
                        (
                            groupBenchCounts.get(
                                key
                            ) || 0
                        ),
                    0
                );


            let score = 0;


            /*
               Strong preference for staying
               inside the current room's classes.
            */

            score +=
                overlap *
                100000;


            /*
               Keep larger class blocks together.
            */

            score +=
                remainingGroupWeight *
                100;


            /*
               Exact physical capacity is preferred.
            */

            if (
                exactCapacity
            ) {

                score +=
                    10000;

            }


            /*
               Avoid creating a new one-bench
               class fragment when possible.
            */

            score -=
                newSingletonGroups *
                50000;


            /*
               Natural register order as tie breaker.
            */

            const firstStudent =
                getBenchFirstStudent(
                    bench
                );


            if (
                bestBench === null ||
                score >
                bestScore ||
                (
                    score ===
                    bestScore &&
                    compareRegisterNumbers(
                        firstStudent,
                        getBenchFirstStudent(
                            bestBench
                        )
                    ) < 0
                )
            ) {

                bestBench =
                    bench;

                bestScore =
                    score;

            }

        }
    );


    return bestBench;

}


/* =========================================================
   CREATE ROOM SLOT PLANS
========================================================= */

const roomSlotPlans =
    rooms
        .map(
            room => {

                const roomSlots =
                    physicalBenchSlots
                        .filter(
                            slot =>
                                String(
                                    slot.roomId
                                ) ===
                                String(
                                    room._id
                                )
                        )
                        .sort(
                            (
                                a,
                                b
                            ) => {

                                /*
                                   Put 2-seat slots first
                                   internally so that
                                   2-student benches are
                                   never accidentally
                                   consumed by a 3-seat
                                   slot when a 2-seat
                                   slot still remains.
                                */

                                if (
                                    a.capacity !==
                                    b.capacity
                                ) {

                                    return (
                                        a.capacity -
                                        b.capacity
                                    );

                                }


                                if (
                                    a.column !==
                                    b.column
                                ) {

                                    return (
                                        a.column === "A"
                                            ? -1
                                            : 1
                                    );

                                }


                                return (
                                    Number(a.bench) -
                                    Number(b.bench)
                                );

                            }
                        );


                return {
                    room,
                    slots: roomSlots
                };

            }
        )
        .filter(
            plan =>
                plan.slots.length > 0
        );


/* =========================================================
   FINAL BENCH ASSIGNMENTS
========================================================= */

const finalBenchAssignments =
    [];


/* =========================================================
   FILL ROOMS ONE BY ONE
========================================================= */

for (
    const roomPlan
    of roomSlotPlans
) {

    const room =
        roomPlan.room;

    const roomSlots =
        roomPlan.slots;

    const roomGroups =
        new Set();


    /*
       Find the benches that can physically
       fit somewhere in this room.
    */

    for (
        const slot
        of roomSlots
    ) {

        /*
           First try an exact-capacity bench.

           For a 2-seat physical bench:
           only a 2-student bench can be used.

           For a 3-seat physical bench:
           3-student is preferred, then 2-student.
        */

        let candidates =
            remainingRoomBenches.filter(
                bench =>
                    bench.students.length ===
                    slot.capacity
            );


        /*
           If this is a 3-seat physical bench
           and no 3-student bench remains,
           a 2-student bench can use it.
        */

        if (
            !candidates.length &&
            slot.capacity === 3
        ) {

            candidates =
                remainingRoomBenches.filter(
                    bench =>
                        bench.students.length ===
                        2
                );

        }


        /*
           If absolutely nothing fits,
           this indicates a capacity assignment
           problem.
        */

        if (
            !candidates.length
        ) {

            Swal.close();

            await showAlert(
                "Room Allocation Error",
                "SmartSeat could not place the already-valid benches into the available room positions.",
                "error"
            );

            seating = [];

            updateStatistics();

            renderSeatingTable();

            return;

        }


        let selectedBench;


        /*
           First bench in a room:
           choose a strong class/group seed.
        */

        if (
            roomGroups.size === 0
        ) {

            selectedBench =
                chooseRoomSeedBench(
                    candidates
                );

        } else {

            /*
               Remaining benches:
               choose one that shares groups
               with the current room.
            */

            selectedBench =
                chooseBenchForRoom(
                    candidates,
                    slot,
                    roomGroups
                );

        }


        if (
            !selectedBench
        ) {

            Swal.close();

            await showAlert(
                "Room Allocation Error",
                "SmartSeat could not create the teacher-style room grouping.",
                "error"
            );

            seating = [];

            updateStatistics();

            renderSeatingTable();

            return;

        }


        /*
           Remove selected bench from pool.
        */

        const selectedIndex =
            remainingRoomBenches.indexOf(
                selectedBench
            );


        if (
            selectedIndex !== -1
        ) {

            remainingRoomBenches.splice(
                selectedIndex,
                1
            );

        }


        /*
           Add its groups to the current
           room's class block.
        */

        getBenchGroupKeys(
            selectedBench
        ).forEach(
            key =>
                roomGroups.add(
                    key
                )
        );


        /*
           Update remaining group counts.
        */

        removeBenchFromGroupCounts(
            selectedBench
        );


        /*
           Save the physical position.
        */

        finalBenchAssignments.push({

            slot,

            students:
                selectedBench.students

        });

    }

}


/* =========================================================
   FINAL CHECK
========================================================= */

if (
    remainingRoomBenches.length !== 0
) {

    Swal.close();

    await showAlert(
        "Room Allocation Error",
        `${remainingRoomBenches.length} valid benches could not be placed into rooms.`,
        "error"
    );

    seating = [];

    updateStatistics();

    renderSeatingTable();

    return;

}

/* =========================================================
   CREATE FINAL SEATING
========================================================= */

const generatedSeating =
    [];


finalBenchAssignments.forEach(
    assignment => {

        const slot =
            assignment.slot;


        /*
           Keep the students on the bench
           naturally ordered by register number.
        */

        const benchStudents =
            [...assignment.students]
                .sort(
                    compareRegisterNumbers
                );


        const seatsForBench =
            ["A"];


        if (
            slot.capacity >= 3
        ) {

            seatsForBench.push(
                "C"
            );

        }


        if (
            slot.capacity >= 2
        ) {

            seatsForBench.push(
                "B"
            );

        }


        benchStudents.forEach(
            (
                student,
                index
            ) => {

                const seat =
                    seatsForBench[
                        index
                    ];


                if (
                    !seat
                ) {

                    return;

                }


                generatedSeating.push({

                    registerNumber:
                        getRegisterNumber(
                            student
                        ),

                    name:
                        student.name ||
                        "",

                    department:
                        student.department ||
                        "",

                    semester:
                        student.semester ||
                        "",

                    roomId:
                        slot.roomId,

                    roomNumber:
                        slot.roomNumber,

                    bench:
                        slot.bench,

                    column:
                        slot.column,

                    seat

                });

            }
        );

    }
);

/* =========================================================
   FINAL VERIFICATION
========================================================= */

if (
    generatedSeating.length !==
    students.length
) {

    Swal.close();


    await showAlert(
        "Allocation Error",
        `Only ${generatedSeating.length} of ${students.length} students were allocated.`,
        "error"
    );


    seating = [];


    updateStatistics();

    renderSeatingTable();


    return;

}


/*
   Duplicate register check.
*/

const finalRegisters =
    generatedSeating.map(
        item =>
            item.registerNumber
    );


const finalUniqueRegisters =
    new Set(
        finalRegisters
    );


if (
    finalUniqueRegisters.size !==
    students.length
) {

    Swal.close();


    await showAlert(
        "Allocation Error",
        "Duplicate register numbers were detected.",
        "error"
    );


    seating = [];


    updateStatistics();

    renderSeatingTable();


    return;

}


/*
   Final physical seat check.
*/

const finalPhysicalKeys =
    generatedSeating.map(
        item =>
            `${item.roomId}|${item.column}|${item.bench}|${item.seat}`
    );


const finalUniquePhysicalKeys =
    new Set(
        finalPhysicalKeys
    );


if (
    finalUniquePhysicalKeys.size !==
    generatedSeating.length
) {

    Swal.close();


    await showAlert(
        "Allocation Error",
        "Duplicate physical seats were detected.",
        "error"
    );


    seating = [];


    updateStatistics();

    renderSeatingTable();


    return;

}


/*
   FINAL RULE CHECK.
*/

const finalBenchMap =
    new Map();


generatedSeating.forEach(
    item => {

        const key =
            `${item.roomId}|${item.column}|${item.bench}`;


        if (
            !finalBenchMap.has(key)
        ) {

            finalBenchMap.set(
                key,
                []
            );

        }


        finalBenchMap
            .get(key)
            .push(item);

    }
);


for (
    const benchStudents
    of finalBenchMap.values()
) {

    for (
        let i = 0;
        i < benchStudents.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < benchStudents.length;
            j++
        ) {

            const originalStudentA =
                students.find(
                    student =>
                        getRegisterNumber(student) ===
                        getRegisterNumber(benchStudents[i])
                );

            const originalStudentB =
                students.find(
                    student =>
                        getRegisterNumber(student) ===
                        getRegisterNumber(benchStudents[j])
                );

            if (
            !originalStudentA ||
            !originalStudentB ||
            !canShareBench(
                [originalStudentA],
                originalStudentB
            )
        ) {


                Swal.close();


                await showAlert(
                    "Allocation Error",
                    "A final bench-rule conflict was detected. The arrangement was not accepted.",
                    "error"
                );


                seating = [];


                updateStatistics();

                renderSeatingTable();


                return;

            }

        }

    }

}


/* =========================================================
   SORT FINAL SEATING
========================================================= */

generatedSeating.sort(
    (
        a,
        b
    ) => {

        const roomCompare =
            String(
                a.roomNumber
            ).localeCompare(
                String(
                    b.roomNumber
                ),
                undefined,
                {
                    numeric: true
                }
            );


        if (
            roomCompare !== 0
        ) {

            return roomCompare;

        }


        if (
            a.column !==
            b.column
        ) {

            return a.column === "A"
                ? -1
                : 1;

        }


        if (
            a.bench !==
            b.bench
        ) {

            return (
                Number(a.bench) -
                Number(b.bench)
            );

        }


        const seatOrder = {

            A: 1,

            C: 2,

            B: 3

        };


        return (
            (
                seatOrder[a.seat] ||
                99
            ) -
            (
                seatOrder[b.seat] ||
                99
            )
        );

    }
);


/*
   SUCCESS.
*/

seating =
    generatedSeating;


await wait(500);


    /* --------------------------------------
       STEP 6
    -------------------------------------- */

    updateGenerationProgress(
        85,
        "Verifying student allocation..."
    );


    await wait(500);


    /* --------------------------------------
       VERIFY COUNT
    -------------------------------------- */

    const allocated =
        seating.length;


    const verificationPhysicalCapacity =
    allSeats.length;


    const remaining =
    verificationPhysicalCapacity -
    allocated;

    /* --------------------------------------
       VERIFY DUPLICATES
    -------------------------------------- */

    const registerNumbers =
        seating.map(
            item =>
                item.registerNumber
        );


    const uniqueRegisterNumbers =
        new Set(
            registerNumbers
        );


    if (
        uniqueRegisterNumbers.size !==
        seating.length
    ) {

        Swal.close();


        seating = [];


        updateStatistics();
        renderSeatingTable();
        saveGeneratedReportData();

        await showAlert(
            "Allocation Error",
            "Duplicate register numbers were detected. Seating generation was stopped.",
            "error"
        );

        return;

    }


    /* --------------------------------------
       VERIFY ALLOCATION COUNT
    -------------------------------------- */

    if (
        allocated !==
        students.length
    ) {

        Swal.close();


        seating = [];


        updateStatistics();

        renderSeatingTable();


        await showAlert(
            "Allocation Error",
            `Only ${allocated} of ${students.length} students were allocated.`,
            "error"
        );

        return;

    }


    /* --------------------------------------
       FINAL PROGRESS
    -------------------------------------- */

    updateGenerationProgress(
        100,
        "Seating arrangement completed!"
    );


    await wait(700);


    Swal.close();


    updateStatistics();

    renderSeatingTable();

/* --------------------------------------
   SAVE REPORT DATA
-------------------------------------- */

    saveGeneratedReportData();

// Save seating to MongoDB
    await saveSeatingToDatabase();

/* --------------------------------------
   SUCCESS POPUP
-------------------------------------- */

    const result =
        await Swal.fire({

            icon:
                "success",

            title:
                "Seating Generated Successfully",

            html: `

                <div
                    style="
                        font-size:16px;
                        line-height:1.8;
                    "
                >

                    <strong>
                        ${allocated}
                    </strong>

                    students allocated successfully.

                    <br>

                    <strong>
                        ${remaining}
                    </strong>

                    physical seats remaining.

                </div>

            `,

            confirmButtonText:
                "View Seating"

        });


    if (
        result.isConfirmed
    ) {

        document
            .querySelector(
                ".table-card"
            )
            ?.scrollIntoView({
                behavior:
                    "smooth"
            });

    }


    /* --------------------------------------
       DEBUG
    -------------------------------------- */

    console.log(
        "================================"
    );

    console.log(
        "✅ SEATING GENERATED"
    );

    console.log(
        "Students:",
        students.length
    );

    console.log(
    "Physical Seats:",
    verificationPhysicalCapacity
);

    console.log(
        "Allocated:",
        allocated
    );

    console.log(
        "Remaining:",
        remaining
    );

    console.log(
        "================================"
    );


    console.table(
        seating.slice(
            0,
            20
        )
    );

}


/* ==========================================
   RENDER SEATING TABLE
========================================== */

function renderSeatingTable() {

    const tableBody =
        document.getElementById(
            "seatingTable"
        );


    if (!tableBody) {

        console.error(
            "❌ #seatingTable not found."
        );

        return;

    }


    /* --------------------------------------
       EMPTY
    -------------------------------------- */

    if (!seating.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="text-center"
                >

                    No Seating Generated

                </td>

            </tr>

        `;


        updateDepartmentFilter();

        updateVerificationSummary(
            0
        );

        return;

    }


    /* --------------------------------------
       FILTER DROPDOWN
    -------------------------------------- */

    updateDepartmentFilter();


    /* --------------------------------------
       SEARCH
    -------------------------------------- */

    const searchInput =
        document.getElementById(
            "seatingSearch"
        );


    const departmentSelect =
        document.getElementById(
            "departmentFilter"
        );


    const search =
        (
            searchInput?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    const department =
        (
            departmentSelect?.value ||
            ""
        )
            .trim()
            .toUpperCase();


    /* --------------------------------------
       FILTER
    -------------------------------------- */

    const filtered =
        seating.filter(
            allocation => {

                const registerNumber =
                    String(
                        allocation.registerNumber ||
                        ""
                    )
                        .toLowerCase();


                const name =
                    String(
                        allocation.name ||
                        ""
                    )
                        .toLowerCase();


                const studentDepartment =
                    normalizeDepartment(
                        allocation.department
                    );


                const matchesSearch =
                    !search ||
                    registerNumber.includes(
                        search
                    ) ||
                    name.includes(
                        search
                    );


                const matchesDepartment =
                    !department ||
                    studentDepartment ===
                    department;


                return (
                    matchesSearch &&
                    matchesDepartment
                );

            }
        );


    /* --------------------------------------
       NO FILTER RESULT
    -------------------------------------- */

    if (!filtered.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="text-center"
                >

                    No students found.

                </td>

            </tr>

        `;


        updateVerificationSummary(
            0
        );

        return;

    }


    /* --------------------------------------
       RENDER
    -------------------------------------- */

    tableBody.innerHTML = "";


    filtered.forEach(
        (
            allocation,
            index
        ) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHtml(
                        allocation.registerNumber
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        allocation.name
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        allocation.department
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        allocation.semester
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        allocation.roomNumber
                    )}
                </td>

                <td>
                    ${allocation.bench}
                </td>

                <td>
                    ${escapeHtml(
                        allocation.column
                    )}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            allocation.seat
                        )}
                    </strong>
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    /* --------------------------------------
       VERIFICATION
    -------------------------------------- */

    updateVerificationSummary(
        filtered.length
    );

}


/* ==========================================
   DEPARTMENT FILTER
========================================== */

function updateDepartmentFilter() {

    const select =
        document.getElementById(
            "departmentFilter"
        );


    if (!select) {

        return;

    }


    const currentValue =
        select.value;


    const departments =
        [
            ...new Set(
                seating
                    .map(
                        student =>
                            normalizeDepartment(
                                student.department
                            )
                    )
                    .filter(Boolean)
            )
        ]
            .sort();


    select.innerHTML = `

        <option value="">
            All Departments
        </option>

    `;


    departments.forEach(
        department => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                department;


            option.textContent =
                department;


            select.appendChild(
                option
            );

        }
    );


    if (
        departments.includes(
            currentValue
        )
    ) {

        select.value =
            currentValue;

    }

}


/* ==========================================
   VERIFICATION SUMMARY
========================================== */

function updateVerificationSummary(
    filteredCount = seating.length
) {

    const verification =
        document.getElementById(
            "seatingVerification"
        );


    if (!verification) {

        return;

    }


    if (!seating.length) {

        verification.innerHTML = `

            <div
                class="alert alert-secondary mb-0"
            >

                <strong>
                    Seating not generated yet.
                </strong>

            </div>

        `;

        return;

    }


    const expected =
        students.length;


    const allocated =
        seating.length;


    const registerNumbers =
        seating.map(
            student =>
                getRegisterNumber(
                    student
                )
        );


    const uniqueRegisters =
        new Set(
            registerNumbers
        );


    const duplicates =
        registerNumbers.length -
        uniqueRegisters.size;


    const missingSeatData =
        seating.filter(
            student =>

                !student.roomNumber ||
                !student.bench ||
                !student.column ||
                !student.seat

        ).length;


    const allocationCorrect =
        allocated ===
        expected;


    const duplicateCorrect =
        duplicates === 0;


    const seatDataCorrect =
        missingSeatData === 0;


    const allCorrect =
        allocationCorrect &&
        duplicateCorrect &&
        seatDataCorrect;


    verification.innerHTML = `

        <div
            class="alert ${
                allCorrect
                    ? "alert-success"
                    : "alert-danger"
            } mb-0"
        >

            <div
                class="d-flex flex-wrap gap-4"
            >

                <div>

                    <strong>
                        Students:
                    </strong>

                    ${expected}

                </div>


                <div>

                    <strong>
                        Allocated:
                    </strong>

                    ${allocated}

                </div>


                <div>

                    <strong>
                        Showing:
                    </strong>

                    ${filteredCount}

                </div>


                <div>

                    <strong>
                        Unique:
                    </strong>

                    ${uniqueRegisters.size}

                </div>


                <div>

                    <strong>
                        Duplicate:
                    </strong>

                    ${duplicates}

                </div>


                <div>

                    <strong>
                        Missing Seat Data:
                    </strong>

                    ${missingSeatData}

                </div>

            </div>


            <hr>


            <strong>

                ${
                    allCorrect

                        ? "✅ Verification Passed — All students are allocated correctly."

                        : "⚠️ Verification requires attention."

                }

            </strong>

        </div>

    `;

}


/* ==========================================
   SEARCH + FILTER EVENTS
========================================== */

function setupSeatingFilters() {

    const searchInput =
        document.getElementById(
            "seatingSearch"
        );


    const departmentSelect =
        document.getElementById(
            "departmentFilter"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderSeatingTable
        );

    }


    if (departmentSelect) {

        departmentSelect.addEventListener(
            "change",
            renderSeatingTable
        );

    }

}


/* ==========================================
   HTML ESCAPE
========================================== */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==========================================
   STATISTICS
========================================== */

function updateStatistics() {

    let capacity = 0;


    rooms.forEach(
        room => {

            capacity +=
                getRoomCapacity(
                    room
                );

        }
    );


    const studentCount =
        document.getElementById(
            "studentCount"
        );


    const roomCount =
        document.getElementById(
            "roomCount"
        );


    const capacityCount =
        document.getElementById(
            "capacityCount"
        );


    const allocatedCount =
        document.getElementById(
            "allocatedCount"
        );


    const remainingCount =
        document.getElementById(
            "remainingCount"
        );


    if (studentCount) {

        studentCount.textContent =
            students.length;

    }


    if (roomCount) {

        roomCount.textContent =
            rooms.length;

    }


    if (capacityCount) {

        capacityCount.textContent =
            capacity;

    }


    if (allocatedCount) {

        allocatedCount.textContent =
            seating.length;

    }


    if (remainingCount) {

        remainingCount.textContent =
            Math.max(
                0,
                capacity -
                seating.length
            );

    }

}


/* ==========================================
   ADDITIONAL STATUS
========================================== */

function updateAdditionalStatus() {

    const status =
        document.getElementById(
            "rollStatus"
        );


    if (!status) return;


    if (!selectedExamId) {

        status.textContent =
            "No Additional Entries";

        return;

    }


    const additionalStudents =
        getAdditionalStudents(
            selectedExamId
        );


    if (
        additionalStudents.length >
        0
    ) {

        status.textContent =
            `${additionalStudents.length} Additional ${
                additionalStudents.length === 1
                    ? "Entry"
                    : "Entries"
            }`;

    }

    else {

        status.textContent =
            "No Additional Entries";

    }

}


/* ==========================================
   CLEAR SEATING
========================================== */

async function clearGeneratedSeating() {

    if (!seating.length) {

        await showAlert(
            "Nothing to Clear",
            "No seating arrangement has been generated yet.",
            "info"
        );

        return;

    }


    const result =
        await Swal.fire({

            title:
                "Clear Seating Arrangement?",

            text:
                "The generated seating arrangement will be cleared.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Yes, Clear",

            cancelButtonText:
                "Cancel"

        });


    if (
        !result.isConfirmed
    ) {

        return;

    }


    seating = [];

localStorage.removeItem(
    "smartseatGeneratedReport"
);

updateStatistics();

renderSeatingTable();


    await Swal.fire({

        icon:
            "success",

        title:
            "Seating Cleared",

        text:
            "The generated seating arrangement has been cleared."

    });

}


/* ==========================================
   MANUAL ENTRY
========================================== */

function openManualEntry() {

    if (!selectedExam) {

        showAlert(
            "Select Examination",
            "Please select an examination first.",
            "warning"
        );

        return;

    }


    const modalElement =
        document.getElementById(
            "manualModal"
        );


    if (!modalElement) {

        showAlert(
            "Manual Entry Unavailable",
            "The manual entry window could not be found.",
            "error"
        );

        return;

    }


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


/* ==========================================
   MANUAL ALLOCATION
========================================== */

async function allocateManualStudent() {

    const registerNumber =
        document.getElementById(
            "manualRegNo"
        )?.value
            .trim();


    const name =
        document.getElementById(
            "manualName"
        )?.value
            .trim();


    const semester =
        document.getElementById(
            "manualSemester"
        )?.value;


    if (!selectedExam) {

        showAlert(
            "Select Examination",
            "Please select an examination first.",
            "warning"
        );

        return;

    }


    if (
        !registerNumber ||
        !name ||
        !semester
    ) {

        showAlert(
            "Incomplete Details",
            "Please enter register number, student name and semester.",
            "warning"
        );

        return;

    }


    /* --------------------------------------
       DUPLICATE CHECK
    -------------------------------------- */

    const duplicate =
        seating.some(
            item =>
                getRegisterNumber(
                    item
                ) ===
                registerNumber
                    .toUpperCase()
        );


    if (duplicate) {

        showAlert(
            "Student Already Allocated",
            "This register number already has a seat.",
            "warning"
        );

        return;

    }


    /* --------------------------------------
       CREATE ALL PHYSICAL SEATS
    -------------------------------------- */

    const allSeats = [];


    rooms.forEach(
        room => {

            allSeats.push(
                ...createRoomSeats(
                    room
                )
            );

        }
    );


    /* --------------------------------------
       USED SEATS
    -------------------------------------- */

    const usedSeats =
        new Set(
            seating.map(
                item =>
                    `${item.roomId}|${item.column}|${item.bench}|${item.seat}`
            )
        );


    /* --------------------------------------
       FIRST FREE SEAT
    -------------------------------------- */

    const freeSeat =
        allSeats.find(
            seat =>
                !usedSeats.has(
                    `${seat.roomId}|${seat.column}|${seat.bench}|${seat.seat}`
                )
        );


    if (!freeSeat) {

        showAlert(
            "No Available Seat",
            "All physical seats are already occupied.",
            "error"
        );

        return;

    }


    /* --------------------------------------
       ADD STUDENT
    -------------------------------------- */

    seating.push({

        registerNumber:
            registerNumber.toUpperCase(),

        name,

        department:
            "Manual Entry",

        semester,

        roomId:
            freeSeat.roomId,

        roomNumber:
            freeSeat.roomNumber,

        bench:
            freeSeat.bench,

        column:
            freeSeat.column,

        seat:
            freeSeat.seat

    });


    updateStatistics();

    renderSeatingTable();

    saveGeneratedReportData();


    /* --------------------------------------
       CLOSE MODAL
    -------------------------------------- */

    const modalElement =
        document.getElementById(
            "manualModal"
        );


    if (modalElement) {

        bootstrap.Modal
            .getOrCreateInstance(
                modalElement
            )
            .hide();

    }


    /* --------------------------------------
       CLEAR FORM
    -------------------------------------- */

    const regInput =
        document.getElementById(
            "manualRegNo"
        );


    const nameInput =
        document.getElementById(
            "manualName"
        );


    const semesterInput =
        document.getElementById(
            "manualSemester"
        );


    if (regInput) {

        regInput.value = "";

    }


    if (nameInput) {

        nameInput.value = "";

    }


    if (semesterInput) {

        semesterInput.value = "";

    }


    showAlert(
        "Student Allocated",
        `${registerNumber} has been assigned a seat.`,
        "success"
    );

}


/* ==========================================
   PREVIEW
========================================== */

async function previewSeating() {

    if (!selectedExam) {

        await showAlert(
            "Select Examination",
            "Please select an examination first.",
            "warning"
        );

        return;

    }


    /*
       If seating doesn't exist,
       Preview generates it.
    */

    if (!seating.length) {

        await generateSeating();

        return;

    }


    renderSeatingTable();


    document
        .querySelector(
            ".table-card"
        )
        ?.scrollIntoView({
            behavior:
                "smooth"
        });


    await Swal.fire({

        icon:
            "info",

        title:
            "Seating Preview",

        text:
            `${seating.length} students are currently allocated.`,

        confirmButtonText:
            "View Seating"

    });


    document
        .querySelector(
            ".table-card"
        )
        ?.scrollIntoView({
            behavior:
                "smooth"
        });

}


/* ==========================================
   EXPORT EXCEL
========================================== */

function exportExcel() {

    if (!seating.length) {

        showAlert(
            "No Seating",
            "Generate seating before exporting Excel.",
            "warning"
        );

        return;

    }


    if (
        typeof XLSX === "undefined"
    ) {

        showAlert(
            "Excel Library Missing",
            "The Excel export library could not be loaded.",
            "error"
        );

        return;

    }


    const exportData =
        seating.map(
            (
                item,
                index
            ) => ({

                "SL.NO":
                    index + 1,

                "Register No":
                    item.registerNumber,

                "Name":
                    item.name,

                "Department":
                    item.department,

                "Semester":
                    item.semester,

                "Room":
                    item.roomNumber,

                "Bench":
                    item.bench,

                "Column":
                    item.column,

                "Seat":
                    item.seat

            })
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            exportData
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Seating"
    );


    const examName =
        selectedExam?.examName ||
        "SmartSeat";


    XLSX.writeFile(
        workbook,
        `${examName.replace(
            /[^a-z0-9]/gi,
            "_"
        )}_Seating.xlsx`
    );


    showAlert(
        "Excel Exported",
        "The seating arrangement has been exported successfully.",
        "success"
    );

}


/* ==========================================
   OFFICIAL PDF
========================================== */

function generateOfficialPDF() {

    if (!seating.length) {

        showAlert(
            "No Seating",
            "Generate seating before creating the PDF.",
            "warning"
        );

        return;

    }


    const examName =
        selectedExam?.examName ||
        "Examination";


    const examDate =
        selectedExam?.examDate
            ? new Date(
                selectedExam.examDate
            ).toLocaleDateString(
                "en-IN"
            )
            : "";


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        showAlert(
            "Popup Blocked",
            "Please allow popups to generate the PDF.",
            "warning"
        );

        return;

    }


    let rows = "";


    seating.forEach(
        (
            item,
            index
        ) => {

            rows += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${escapeHtml(
                            item.registerNumber
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            item.name
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            item.department
                        )}
                    </td>

                    <td>
                        ${item.semester}
                    </td>

                    <td>
                        ${escapeHtml(
                            item.roomNumber
                        )}
                    </td>

                    <td>
                        ${item.bench}
                    </td>

                    <td>
                        ${item.column}
                    </td>

                    <td>
                        ${item.seat}
                    </td>

                </tr>

            `;

        }
    );


    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                ${escapeHtml(
                    examName
                )}
                - Seating Arrangement
            </title>


           .print-btn {
    display: inline-block;
    padding: 10px 18px;
    margin-bottom: 20px;
    border: none;
    border-radius: 6px;
    background: #333;
    color: white;
    font-size: 14px;
    cursor: pointer;
}

@media print {
    .print-btn {
        display: none !important;
    }
}

        </head>


        <body>
        <button onclick="window.print()" class="print-btn">
    🖨️ Print / Save as PDF
</button>

            <h1>
                SMARTSEAT
            </h1>


            <h2>
                ${escapeHtml(
                    examName
                )}
            </h2>


            <p>
                ${
                    examDate
                        ? "Date: " +
                          escapeHtml(
                              examDate
                          )
                        : ""
                }
            </p>


            <table>

                <thead>

                    <tr>

                        <th>SL.NO</th>

                        <th>Register No</th>

                        <th>Name</th>

                        <th>Department</th>

                        <th>Semester</th>

                        <th>Room</th>

                        <th>Bench</th>

                        <th>Column</th>

                        <th>Seat</th>

                    </tr>

                </thead>


                <tbody>

                    ${rows}

                </tbody>

            </table>


            <br>


            <button
                onclick="
                    window.print()
                "
            >

                Print / Save as PDF

            </button>


        </body>

        </html>

    `);


    printWindow.document.close();

}

/* ==========================================
   SAVE GENERATED REPORT DATA
========================================== */

function saveGeneratedReportData() {

    try {

        const reportData = {

            examId:
                selectedExam?._id || "",

            exam:
                selectedExam || null,

            seating:
                Array.isArray(seating)
                    ? seating
                    : [],

            generatedAt:
                new Date().toISOString()

        };


        localStorage.setItem(
            "smartseatGeneratedReport",
            JSON.stringify(reportData)
        );


        console.log(
            "✅ Generated seating saved for Reports:",
            reportData.seating.length,
            "students"
        );


    }
    catch (error) {

        console.error(
            "❌ Failed to save report data:",
            error
        );

    }

}
/* ==========================================
   BUTTON EVENTS
========================================== */

function setupButtonEvents() {

    /* --------------------------------------
       GENERATE
    -------------------------------------- */

    const generateBtn =
        document.getElementById(
            "generateBtn"
        );


    if (generateBtn) {

        generateBtn.addEventListener(
            "click",
            generateSeating
        );

    }


    /* --------------------------------------
       PREVIEW
    -------------------------------------- */

    const previewBtn =
        document.getElementById(
            "previewBtn"
        );


    if (previewBtn) {

        previewBtn.addEventListener(
            "click",
            previewSeating
        );

    }


    /* --------------------------------------
       CLEAR
    -------------------------------------- */

    const clearBtn =
        document.getElementById(
            "clearBtn"
        );


    if (clearBtn) {

        clearBtn.addEventListener(
            "click",
            clearGeneratedSeating
        );

    }


    /* --------------------------------------
       MANUAL ENTRY
    -------------------------------------- */

    const manualBtn =
        document.getElementById(
            "manualBtn"
        );


    if (manualBtn) {

        manualBtn.addEventListener(
            "click",
            openManualEntry
        );

    }


    /* --------------------------------------
       MANUAL ALLOCATE
    -------------------------------------- */

    const allocateBtn =
        document.getElementById(
            "allocateBtn"
        );


    if (allocateBtn) {

        allocateBtn.addEventListener(
            "click",
            allocateManualStudent
        );

    }


    /* --------------------------------------
       PDF
    -------------------------------------- */

    const pdfBtn =
        document.getElementById(
            "pdfBtn"
        );


    if (pdfBtn) {

        pdfBtn.addEventListener(
            "click",
            generateOfficialPDF
        );

    }


    /* --------------------------------------
       EXCEL
    -------------------------------------- */

    const excelBtn =
        document.getElementById(
            "excelBtn"
        );


    if (excelBtn) {

        excelBtn.addEventListener(
            "click",
            exportExcel
        );

    }

}


/* ==========================================
   PAGE INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "📋 Initializing Seating Generator..."
        );


        /* --------------------------------------
           GET EXAM SELECT
        -------------------------------------- */

        examSelect =
            document.getElementById(
                "examSelect"
            );


        if (!examSelect) {

            console.error(
                "❌ #examSelect not found."
            );

            return;

        }


        /* --------------------------------------
           LOAD DATA
        -------------------------------------- */

        await loadExams();

        await loadRooms();

        await loadMasterStudents();


        /* --------------------------------------
           EXAM CHANGE
        -------------------------------------- */

        examSelect.addEventListener(
            "change",
            updateSelectedExam
        );


        /* --------------------------------------
           BUTTONS
        -------------------------------------- */

        setupButtonEvents();


        /* --------------------------------------
           SEARCH + DEPARTMENT FILTER
        -------------------------------------- */

        setupSeatingFilters();


        /* --------------------------------------
           INITIAL UI
        -------------------------------------- */

        updateStatistics();

        updateAdditionalStatus();

        renderSeatingTable();


        console.log(
            "================================"
        );

        console.log(
            "✅ Seating Generator Ready"
        );

        console.log(
            "Master Students:",
            masterStudents.length
        );

        console.log(
            "Rooms:",
            rooms.length
        );

        console.log(
            "Examinations:",
            exams.length
        );

        console.log(
            "================================"
        );

    }
);