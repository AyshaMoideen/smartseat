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
   UPDATE SELECTED EXAM
========================================== */

function updateSelectedExam() {

    if (!examSelect) return;


    selectedExamId =
        examSelect.value;


    selectedExam =
        exams.find(
            exam =>
                String(
                    exam._id
                ) ===
                String(
                    selectedExamId
                )
        );


    /* --------------------------------------
       NO EXAM
    -------------------------------------- */

    if (!selectedExam) {

        students = [];

        seating = [];

        updateStatistics();

        updateAdditionalStatus();

        renderSeatingTable();

        return;

    }


    /* --------------------------------------
       SEMESTER
    -------------------------------------- */

    const examSemester =
        Number(
            selectedExam.semester
        );


    /* --------------------------------------
       EXAM DEPARTMENTS
    -------------------------------------- */

    const examDepartments =
        getExamDepartments(
            selectedExam
        );


    /* --------------------------------------
       ALLOWED DEPARTMENTS
    -------------------------------------- */

    const allowedDepartments =
        getAllowedStudentDepartments(
            examDepartments
        );


    /* --------------------------------------
       MASTER STUDENTS
    -------------------------------------- */

    const examStudents =
        masterStudents.filter(
            student => {

                const semester =
                    Number(
                        student.semester
                    );


                const department =
                    normalizeDepartment(
                        student.department
                    );


                return (
                    semester ===
                    examSemester
                    &&
                    allowedDepartments.has(
                        department
                    )
                );

            }
        );


    /* --------------------------------------
       ADDITIONAL STUDENTS
    -------------------------------------- */

    const additionalStudents =
        getAdditionalStudents(
            selectedExam._id
        );


    /* --------------------------------------
       COMBINE WITHOUT DUPLICATES
    -------------------------------------- */

    const combinedStudents =
        [
            ...examStudents
        ];


    const existing =
        new Set();


    examStudents.forEach(
        student => {

            const registerNumber =
                getRegisterNumber(
                    student
                );


            if (registerNumber) {

                existing.add(
                    registerNumber
                );

            }

        }
    );


    additionalStudents.forEach(
        student => {

            const registerNumber =
                getRegisterNumber(
                    student
                );


            if (
                registerNumber &&
                !existing.has(
                    registerNumber
                )
            ) {

                combinedStudents.push(
                    student
                );

                existing.add(
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

renderSeatingTable();


    /* --------------------------------------
       UPDATE UI
    -------------------------------------- */

    updateStatistics();

    updateAdditionalStatus();

    renderSeatingTable();


    /* --------------------------------------
       DEBUG
    -------------------------------------- */

    console.log(
        "================================"
    );

    console.log(
        "Selected Examination:",
        selectedExam.examName
    );

    console.log(
        "Semester:",
        examSemester
    );

    console.log(
        "Exam Departments:",
        examDepartments
    );

    console.log(
        "Allowed Student Departments:",
        [
            ...allowedDepartments
        ]
    );

    console.log(
        "Master Students:",
        masterStudents.length
    );

    console.log(
        "Students for this Exam:",
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
   MIX DEPARTMENTS
========================================== */

function createMixedStudentOrder(
    studentList
) {

    const groups =
        groupStudentsByDepartment(
            studentList
        );


    const departments =
        Object.keys(
            groups
        );


    const result = [];


    let remaining = true;


    /*
       Round-robin department selection.

       Example:

       BCA
       BCOM.CA
       BBA.AVH
       BBA.TTM
       BA.ENG
       BCA
       BCOM.CA
       ...
    */

    while (
        remaining
    ) {

        remaining = false;


        departments.forEach(
            department => {

                if (
                    groups[
                        department
                    ] &&
                    groups[
                        department
                    ].length > 0
                ) {

                    result.push(
                        groups[
                            department
                        ].shift()
                    );


                    remaining = true;

                }

            }
        );

    }


    return result;

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
        "Assigning students to physical seats..."
    );


    seating = [];


    orderedStudents.forEach(
        (
            student,
            index
        ) => {

            const physicalSeat =
                allSeats[index];


            if (!physicalSeat) {

                return;

            }


            seating.push({

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
                    physicalSeat.roomId,

                roomNumber:
                    physicalSeat.roomNumber,

                bench:
                    physicalSeat.bench,

                column:
                    physicalSeat.column,

                seat:
                    physicalSeat.seat

            });

        }
    );


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


    const physicalCapacity =
        allSeats.length;


    const remaining =
        physicalCapacity -
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
        /* ==========================================
   SAVE GENERATED REPORT DATA
========================================== */

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
        physicalCapacity
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