/* ==========================================
   SMARTSEAT REPORTS
   FINAL VERSION
========================================== */

console.log("🚀 SmartSeat Reports Loaded");


/* ==========================================
   DATA
========================================== */

let reportData = null;

let seating = [];

let selectedExam = null;

let rooms = [];


/* ==========================================
   API
========================================== */

const ROOMS_API =
    "http://localhost:5000/api/rooms";


/* ==========================================
   TOKEN
========================================== */

function getToken() {

    return localStorage.getItem("token");

}


function getHeaders() {

    const token =
        getToken();

    return {

        "Content-Type":
            "application/json",

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

function showReportAlert(
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
   LOAD SAVED REPORT
========================================== */

function loadReportData() {

    try {

        const saved =
            localStorage.getItem(
                "smartseatGeneratedReport"
            );


        if (!saved) {

            reportData = null;

            seating = [];

            selectedExam = null;

            return;

        }


        reportData =
            JSON.parse(saved);


        seating =
            Array.isArray(
                reportData.seating
            )
                ? reportData.seating
                : [];


        selectedExam =
            reportData.exam ||
            null;


        console.log(
            "✅ Saved report loaded:",
            seating.length,
            "students"
        );

    }

    catch (error) {

        console.error(
            "❌ Report data error:",
            error
        );

        reportData = null;

        seating = [];

        selectedExam = null;

    }

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
            `✅ ${rooms.length} rooms loaded for reports.`
        );

    }

    catch (error) {

        console.error(
            "❌ Room loading error:",
            error
        );

        rooms = [];

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
   GET ROOM CAPACITY
========================================== */

function getRoomCapacity(room) {

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
   ESCAPE HTML
========================================== */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ==========================================
   LOAD STATISTICS
========================================== */

function loadStatistics() {

    const studentCount =
        document.getElementById(
            "reportStudents"
        );

    const roomCount =
        document.getElementById(
            "reportRooms"
        );

    const capacityCount =
        document.getElementById(
            "reportCapacity"
        );

    const seatedCount =
        document.getElementById(
            "reportSeated"
        );

    const remainingCount =
        document.getElementById(
            "remainingSeats"
        );


    let capacity = 0;


    rooms.forEach(
        room => {

            capacity +=
                getRoomCapacity(room);

        }
    );


    if (studentCount) {

        studentCount.textContent =
            seating.length;

    }


    if (roomCount) {

        const usedRooms =
            new Set(
                seating.map(
                    item =>
                        item.roomNumber
                )
            );

        roomCount.textContent =
            usedRooms.size;

    }


    if (capacityCount) {

        capacityCount.textContent =
            capacity;

    }


    if (seatedCount) {

        seatedCount.textContent =
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
   EXAM INFORMATION
========================================== */

function renderExamInformation() {

    const container =
        document.getElementById(
            "examInformation"
        );


    if (!container) return;


    if (!selectedExam) {

        container.innerHTML = `

            <div class="alert alert-secondary mb-0">

                No seating report generated yet.

            </div>

        `;

        return;

    }


    const date =
        selectedExam.examDate
            ? new Date(
                selectedExam.examDate
            ).toLocaleDateString(
                "en-IN"
            )
            : "-";


    container.innerHTML = `

        <div class="row">

            <div class="col-md-3">

                <strong>Examination</strong>

                <div>
                    ${escapeHtml(
                        selectedExam.examName ||
                        "-"
                    )}
                </div>

            </div>


            <div class="col-md-2">

                <strong>Semester</strong>

                <div>
                    ${escapeHtml(
                        selectedExam.semester ||
                        "-"
                    )}
                </div>

            </div>


            <div class="col-md-2">

                <strong>Date</strong>

                <div>
                    ${date}
                </div>

            </div>


            <div class="col-md-2">

                <strong>Session</strong>

                <div>
                    ${escapeHtml(
                        selectedExam.session ||
                        "-"
                    )}
                </div>

            </div>


            <div class="col-md-3">

                <strong>Students Allocated</strong>

                <div>
                    ${seating.length}
                </div>

            </div>

        </div>

    `;

}


/* ==========================================
   ROOM GROUPING
========================================== */

function groupByRoom() {

    const groups = {};

    seating.forEach(
        student => {

            const room =
                student.roomNumber ||
                "Unknown Room";


            if (!groups[room]) {

                groups[room] = [];

            }


            groups[room].push(
                student
            );

        }
    );


    return groups;

}


/* ==========================================
   DEPARTMENT DISPLAY
========================================== */

function displayDepartment(
    department
) {

    const value =
        normalizeDepartment(
            department
        );


    if (
        value === "BCOM.CA"
    ) {

        return "BCOM.CA";

    }


    if (
        value === "BCOM.CP"
    ) {

        return "BCOM.CP";

    }


    return value;

}


/* ==========================================
   GET SUBJECT FOR STUDENT
========================================== */

function getStudentSubject(
    student
) {

    if (
        !selectedExam ||
        !Array.isArray(
            selectedExam.subjects
        )
    ) {

        return "Examination Paper";

    }


    const studentDepartment =
        normalizeDepartment(
            student.department
        );


    const subject =
        selectedExam.subjects.find(
            subject => {

                if (
                    !Array.isArray(
                        subject.departments
                    )
                ) {

                    return false;

                }


                return subject.departments.some(
                    department => {

                        const examDepartment =
                            normalizeDepartment(
                                department
                            );


                        if (
                            examDepartment ===
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
                            examDepartment ===
                            studentDepartment
                        );

                    }
                );

            }
        );


    return (
        subject?.subjectName ||
        "Examination Paper"
    );

}


/* ==========================================
   DEPARTMENT STRENGTH
========================================== */

function getDepartmentStrength(
    students
) {

    const result = {};

    students.forEach(
        student => {

            const department =
                displayDepartment(
                    student.department
                );


            if (!result[department]) {

                result[department] = {

                    count: 0,

                    subject:
                        getStudentSubject(
                            student
                        )

                };

            }


            result[department].count++;

        }
    );


    return result;

}


/* ==========================================
   REGISTER RANGE
========================================== */

function getRegisterRange(
    students
) {

    if (!students.length) {

        return "-";

    }


    const registers =
        students
            .map(
                student =>
                    String(
                        student.registerNumber ||
                        student.regNo ||
                        ""
                    )
            )
            .filter(Boolean)
            .sort();


    if (!registers.length) {

        return "-";

    }


    if (
        registers.length === 1
    ) {

        return registers[0];

    }


    return `${registers[0]} - ${registers[registers.length - 1]}`;

}


/* ==========================================
   PDF 1
   STUDENT-FACING PDF
========================================== */

function generateStudentAllocationPDF() {

    if (!seating.length) {

        showReportAlert(
            "No Seating Available",
            "Generate seating before creating the Student Allocation PDF.",
            "warning"
        );

        return;

    }


    const roomGroups =
        groupByRoom();


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


    const session =
        selectedExam?.session ||
        "";


    const startTime =
        selectedExam?.startTime ||
        "";


    const endTime =
        selectedExam?.endTime ||
        "";


    let rows = "";


    Object.entries(
        roomGroups
    ).forEach(
        (
            [room, students]
        ) => {

            const departments = {};


            students.forEach(
                student => {

                    const department =
                        displayDepartment(
                            student.department
                        );


                    if (
                        !departments[
                            department
                        ]
                    ) {

                        departments[
                            department
                        ] = [];

                    }


                    departments[
                        department
                    ].push(
                        student
                    );

                }
            );


            let first = true;


            Object.entries(
                departments
            ).forEach(
                (
                    [
                        department,
                        departmentStudents
                    ]
                ) => {

                    rows += `

                        <tr>

                            ${
                                first
                                    ? `
                                    <td
                                        rowspan="${
                                            Object.keys(
                                                departments
                                            ).length
                                        }"
                                    >
                                        ${escapeHtml(room)}
                                    </td>
                                    `
                                    : ""
                            }

                            <td>
                                ${escapeHtml(
                                    department
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    getRegisterRange(
                                        departmentStudents
                                    )
                                )}
                            </td>

                            <td>
                                ${
                                    departmentStudents.length
                                }
                            </td>

                        </tr>

                    `;


                    first = false;

                }
            );

        }
    );


    const printWindow =
        window.open(
            "",
            "_blank"
        );


    if (!printWindow) {

        showReportAlert(
            "Popup Blocked",
            "Please allow popups to generate the PDF.",
            "warning"
        );

        return;

    }


    printWindow.document.write(`

<!DOCTYPE html>

<html>

<head>

<title>
${escapeHtml(examName)}
- Student Allocation
</title>

<style>

@page {

    size: A4 portrait;

    margin: 15mm;

}


body {

    font-family: Arial, sans-serif;

    color: #111;

}


.header {

    text-align: center;

    margin-bottom: 18px;

}


.college {

    font-size: 19px;

    font-weight: bold;

}


.exam {

    font-size: 17px;

    font-weight: bold;

    margin-top: 8px;

}


.meta {

    margin-top: 8px;

    line-height: 1.6;

}


table {

    width: 100%;

    border-collapse: collapse;

    margin-top: 20px;

}


th,
td {

    border: 1px solid #222;

    padding: 9px;

    text-align: center;

    font-size: 13px;

}


th {

    font-weight: bold;

    background: #eeeeee;

}


.footer {

    margin-top: 25px;

    text-align: right;

    font-size: 11px;

}


button {

    margin-top: 20px;

    padding: 10px 18px;

}


@media print {

    button {

        display: none;

    }

}

</style>

</head>

<body>

<div class="header">

<div class="college">

MALIK DEENAR COLLEGE OF GRADUATE STUDIES SEETHANGOLI

</div>

<div class="exam">

${escapeHtml(examName)}

</div>

<div class="meta">

<strong>Date:</strong>
${escapeHtml(examDate)}

&nbsp;&nbsp;

<strong>Session:</strong>
${escapeHtml(session)}

<br>

<strong>Time:</strong>
${escapeHtml(startTime)}
-
${escapeHtml(endTime)}

</div>

</div>


<table>

<thead>

<tr>

<th>ROOM</th>

<th>CLASS</th>

<th>REGISTER NUMBER</th>

<th>TOTAL STRENGTH</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>


<div class="footer">

Total Students Allocated:
<strong>
${seating.length}
</strong>

</div>


<button onclick="window.print()">

Print / Save as PDF

</button>

</body>

</html>

`);


    printWindow.document.close();


    addReportHistory(
        "Student Allocation PDF"
    );

}

/* ==========================================
   PDF 2
   TEACHER ALLOCATION PDF
========================================== */

function generateTeacherAllocationPDF() {

    if (!seating.length) {

        showReportAlert(
            "No Seating Available",
            "Generate seating before creating the Teacher Allocation PDF.",
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
            ).toLocaleDateString("en-IN")
            : "";

    const session =
        selectedExam?.session ||
        "";

    const startTime =
        selectedExam?.startTime ||
        "";

    const endTime =
        selectedExam?.endTime ||
        "";

    const printWindow =
        window.open(
            "",
            "_blank"
        );

    if (!printWindow) {

        showReportAlert(
            "Popup Blocked",
            "Please allow popups to generate the PDF.",
            "warning"
        );

        return;

    }


    /* ==========================================
       ROOM LIST
       Use ALL configured rooms
    ========================================== */

    const reportRooms =
        Array.isArray(rooms) &&
        rooms.length
            ? rooms
            : Object.keys(
                groupByRoom()
            ).map(
                roomNumber => ({
                    roomNumber
                })
            );


    let pages = "";


    /* ==========================================
       CREATE ONE PAGE PER ROOM
    ========================================== */

    reportRooms.forEach(
        (
            room,
            roomIndex
        ) => {

            const roomNumber =
                room?.roomNumber ||
                "Unknown Room";


            const roomStudents =
                seating.filter(
                    student =>
                        String(
                            student.roomNumber
                        ) ===
                        String(
                            roomNumber
                        )
                );


            /* ==========================================
               PAPER / DEPARTMENT DISTRIBUTION
            ========================================== */

            const departmentData =
                getDepartmentStrength(
                    roomStudents
                );


            let distributionRows = "";

            let totalStrength = 0;


            Object.entries(
                departmentData
            ).forEach(
                (
                    [
                        department,
                        data
                    ]
                ) => {

                    totalStrength +=
                        data.count;


                    distributionRows += `

                        <tr>

                            <td>
                                ${escapeHtml(
                                    department
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    data.subject
                                )}
                            </td>

                            <td>
                                ${data.count}
                            </td>

                        </tr>

                    `;

                }
            );


            if (!distributionRows) {

                distributionRows = `

                    <tr>

                        <td colspan="3">
                            No students allocated
                        </td>

                    </tr>

                `;

            }


            /* ==========================================
               PHYSICAL ROOM SETTINGS
            ========================================== */

            const studentsPerBench =
                Number(
                    room?.studentsPerBench ||
                    3
                );


            const rowsLeft =
                Number(
                    room?.rowsLeft ||
                    0
                );


            const rowsRight =
                Number(
                    room?.rowsRight ||
                    0
                );


            const maxBench =
                Math.max(
                    rowsLeft,
                    rowsRight
                );


            /* ==========================================
               FIND STUDENT AT PHYSICAL SEAT
            ========================================== */

            function getStudentAtSeat(
                column,
                bench,
                seat
            ) {

                return roomStudents.find(
                    student =>
                        String(
                            student.column
                        ).toUpperCase() ===
                        String(
                            column
                        ).toUpperCase() &&

                        Number(
                            student.bench
                        ) ===
                        Number(
                            bench
                        ) &&

                        String(
                            student.seat
                        ).toUpperCase() ===
                        String(
                            seat
                        ).toUpperCase()
                );

            }


            /* ==========================================
               CREATE PHYSICAL SEAT DISPLAY
            ========================================== */

            function renderBench(
                column,
                bench
            ) {

                const seatOrder =
                    studentsPerBench >= 3
                        ? ["A", "C", "B"]
                        : studentsPerBench >= 2
                            ? ["A", "B"]
                            : ["A"];


                let html = "";


                seatOrder.forEach(
                    seat => {

                        const student =
                            getStudentAtSeat(
                                column,
                                bench,
                                seat
                            );


                        if (student) {

                            const registerNumber =
                                student.registerNumber ||
                                student.regNo ||
                                "";


                            html += `

                                <div class="seat-line">

                                    <span class="seat-label">
                                        ${seat}
                                    </span>

                                    <span>
                                        ${escapeHtml(
                                            registerNumber
                                        )}
                                    </span>

                                </div>

                            `;

                        }

                        else {

                            html += `

                                <div class="seat-line empty-seat">

                                    <span class="seat-label">
                                        ${seat}
                                    </span>

                                    <span>
                                        —
                                    </span>

                                </div>

                            `;

                        }

                    }
                );


                return html;

            }


            /* ==========================================
               PHYSICAL LAYOUT ROWS

               EXACTLY TWO PHYSICAL COLUMNS:
               COLUMN A | COLUMN B
            ========================================== */

            let layoutRows = "";


            for (
                let bench = 1;
                bench <= maxBench;
                bench++
            ) {

                const leftExists =
                    bench <= rowsLeft;


                const rightExists =
                    bench <= rowsRight;


                layoutRows += `

                    <tr>

                        <td class="bench-number">
                            ${bench}
                        </td>


                        <td>

                            ${
                                leftExists
                                    ? renderBench(
                                        "A",
                                        bench
                                    )
                                    : "—"
                            }

                        </td>


                        <td>

                            ${
                                rightExists
                                    ? renderBench(
                                        "B",
                                        bench
                                    )
                                    : "—"
                            }

                        </td>

                    </tr>

                `;

            }


            if (!layoutRows) {

                layoutRows = `

                    <tr>

                        <td colspan="3">
                            No physical benches configured
                        </td>

                    </tr>

                `;

            }


            /* ==========================================
               ROOM CAPACITY
            ========================================== */

            const physicalCapacity =
                getRoomCapacity(
                    room
                );


            const roomClass =
                roomStudents.length > 0
                    ? ""
                    : "empty-room";


            /* ==========================================
               ROOM PAGE
            ========================================== */

            pages += `

                <section class="room-page ${roomClass}">

                    <div class="header">

                        <div class="college">

                            MALIK DEENAR COLLEGE OF GRADUATE STUDIES

                        </div>


                        <div class="college">

                            SEETHANGOLI, KASARAGOD

                        </div>


                        <div class="exam">

                            ${escapeHtml(
                                examName
                            )}

                        </div>


                        <div class="meta">

                            <strong>Date:</strong>

                            ${escapeHtml(
                                examDate
                            )}

                            &nbsp;&nbsp;&nbsp;


                            <strong>Session:</strong>

                            ${escapeHtml(
                                session
                            )}

                            &nbsp;&nbsp;&nbsp;


                            <strong>Time:</strong>

                            ${escapeHtml(
                                startTime
                            )}

                            -

                            ${escapeHtml(
                                endTime
                            )}

                        </div>

                    </div>


                    <div class="room-title">

                        ROOM:

                        ${escapeHtml(
                            roomNumber
                        )}

                    </div>


                    <!-- ==================================
                         PAPER DISTRIBUTION
                    =================================== -->

                    <h3>

                        EXAM PAPER DISTRIBUTION

                    </h3>


                    <table class="distribution-table">

                        <thead>

                            <tr>

                                <th>
                                    DEPARTMENT / CLASS
                                </th>

                                <th>
                                    EXAM PAPER / SUBJECT
                                </th>

                                <th>
                                    STRENGTH
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${distributionRows}


                            <tr class="total">

                                <td colspan="2">

                                    TOTAL STUDENTS

                                </td>

                                <td>

                                    ${totalStrength}

                                </td>

                            </tr>

                        </tbody>

                    </table>


                    <div class="capacity">

                        <strong>
                            Physical Room Capacity:
                        </strong>

                        ${physicalCapacity}


                        &nbsp;&nbsp;&nbsp;


                        <strong>
                            Students Allocated:
                        </strong>

                        ${roomStudents.length}

                    </div>


                    <!-- ==================================
                         PHYSICAL SEATING
                    =================================== -->

                    <h3>

                        PHYSICAL SEATING LAYOUT

                    </h3>


                    <table class="layout-table">

                        <thead>

                            <tr>

                                <th>
                                    BENCH
                                </th>

                                <th>
                                    COLUMN A
                                </th>

                                <th>
                                    COLUMN B
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${layoutRows}

                        </tbody>

                    </table>


                    <div class="note">

                        <strong>
                            Seating Position:
                        </strong>

                        A and B are the normal physical
                        seating positions.

                        ${
                            studentsPerBench >= 3
                                ? "C is the middle physical position for rooms configured for three students per bench."
                                : "This room is configured for two students per bench, so C is not used."
                        }

                    </div>


                    <div class="signature-area">

                        <div>
                            Teacher / Invigilator Signature:
                            __________________________
                        </div>

                    </div>


                </section>

            `;

        }
    );


    /* ==========================================
       PRINT WINDOW
    ========================================== */

    printWindow.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>

                ${escapeHtml(
                    examName
                )}

                - Teacher Allocation

            </title>


            <style>

                @page {

                    size: A4 landscape;

                    margin: 10mm;

                }


                * {

                    box-sizing: border-box;

                }


                body {

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    color: #111;

                    margin: 0;

                    padding: 0;

                }


                .room-page {

                    width: 100%;

                    min-height: 180mm;

                    page-break-after: always;

                    padding: 5px;

                }


                .room-page:last-child {

                    page-break-after: auto;

                }


                .header {

                    text-align: center;

                    margin-bottom: 10px;

                }


                .college {

                    font-size: 16px;

                    font-weight: bold;

                    line-height: 1.3;

                }


                .exam {

                    font-size: 15px;

                    font-weight: bold;

                    margin-top: 6px;

                }


                .meta {

                    font-size: 11px;

                    margin-top: 6px;

                }


                .room-title {

                    text-align: center;

                    font-size: 20px;

                    font-weight: bold;

                    margin: 10px 0 12px;

                    border: 2px solid #111;

                    padding: 8px;

                }


                h3 {

                    font-size: 13px;

                    margin: 12px 0 6px;

                }


                table {

                    width: 100%;

                    border-collapse: collapse;

                }


                th,
                td {

                    border: 1px solid #222;

                    padding: 6px;

                    text-align: center;

                    font-size: 10px;

                }


                th {

                    background: #eeeeee;

                    font-weight: bold;

                }


                .distribution-table {

                    margin-bottom: 8px;

                }


                .distribution-table th,
                .distribution-table td {

                    padding: 6px;

                }


                .total td {

                    font-weight: bold;

                }


                .capacity {

                    font-size: 11px;

                    margin: 8px 0;

                }


                /* ==================================
                   PHYSICAL LAYOUT
                =================================== */

                .layout-table {

                    table-layout: fixed;

                }


                .layout-table th {

                    font-size: 12px;

                    padding: 7px;

                }


                .layout-table td {

                    vertical-align: middle;

                    padding: 4px;

                }


                .layout-table th:first-child,
                .layout-table td:first-child {

                    width: 10%;

                }


                .layout-table th:nth-child(2),
                .layout-table th:nth-child(3) {

                    width: 45%;

                }


                .bench-number {

                    font-size: 13px;

                    font-weight: bold;

                }


                .seat-line {

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    gap: 8px;

                    padding: 3px 0;

                    border-bottom: 1px dotted #aaa;

                    font-size: 11px;

                }


                .seat-line:last-child {

                    border-bottom: none;

                }


                .seat-label {

                    display: inline-block;

                    font-weight: bold;

                    min-width: 15px;

                }


                .empty-seat {

                    color: #777;

                }


                .note {

                    margin-top: 9px;

                    border: 1px solid #555;

                    padding: 6px;

                    font-size: 9px;

                }


                .signature-area {

                    margin-top: 15px;

                    font-size: 10px;

                    text-align: right;

                }


                /* ==================================
                   PRINT BUTTON
                =================================== */

                .print-controls {

                    text-align: center;

                    padding: 15px;

                    margin-bottom: 15px;

                    border-bottom: 1px solid #ccc;

                }


                .print-button {

                    border: none;

                    background: #212529;

                    color: white;

                    padding: 10px 20px;

                    border-radius: 5px;

                    font-size: 14px;

                    cursor: pointer;

                }


                .print-button:hover {

                    background: #000;

                }


                @media print {

                    .print-controls {

                        display: none !important;

                    }

                }

            </style>

        </head>


        <body>


            <!-- ==================================
                 THIS IS THE BUTTON YOU WERE MISSING
            =================================== -->

            <div class="print-controls">

                <button
                    class="print-button"
                    onclick="window.print()"
                >

                    🖨 Print / Save as PDF

                </button>

            </div>


            ${pages}


        </body>

        </html>

    `);


    printWindow.document.close();


    addReportHistory(
        "Teacher Allocation PDF"
    );

}
/* ==========================================
   EXCEL
========================================== */

function exportReportExcel() {

    if (!seating.length) {

        showReportAlert(
            "No Seating Data",
            "Generate seating before exporting Excel.",
            "warning"
        );

        return;

    }


    if (
        typeof XLSX === "undefined"
    ) {

        showReportAlert(
            "Excel Library Missing",
            "Excel export library could not be loaded.",
            "error"
        );

        return;

    }


    const data =
        seating.map(
            (
                item,
                index
            ) => ({

                "SL.NO":
                    index + 1,

                "Register No":
                    item.registerNumber ||
                    item.regNo ||
                    "",

                "Name":
                    item.name ||
                    "",

                "Department":
                    item.department ||
                    "",

                "Semester":
                    item.semester ||
                    "",

                "Room":
                    item.roomNumber ||
                    "",

                "Bench":
                    item.bench ||
                    "",

                "Column":
                    item.column ||
                    "",

                "Seat":
                    item.seat ||
                    "",

                "Exam Paper":
                    getStudentSubject(
                        item
                    )

            })
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            data
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
        )}_Report.xlsx`

    );


    addReportHistory(
        "Excel Report Downloaded"
    );


    showReportAlert(
        "Excel Exported",
        "The seating report has been exported successfully.",
        "success"
    );

}


/* ==========================================
   REPORT HISTORY
========================================== */

function addReportHistory(
    reportName
) {

    try {

        if (
            typeof ActivityManager !==
            "undefined"
        ) {

            ActivityManager.addActivity(
                reportName
            );

        }


        loadReportHistory();

    }

    catch (error) {

        console.error(
            "Report history error:",
            error
        );

    }

}


/* ==========================================
   HISTORY TABLE
========================================== */

function loadReportHistory() {

    const table =
        document.getElementById(
            "reportHistory"
        );


    if (!table) return;


    if (
        typeof ActivityManager ===
        "undefined"
    ) {

        return;

    }


    const activities =
        ActivityManager.getActivities();


    const reports =
        activities.filter(
            activity => {

                const action =
                    String(
                        activity.action ||
                        ""
                    )
                        .toLowerCase();


                return (
                    action.includes("pdf") ||
                    action.includes("excel") ||
                    action.includes("report")
                );

            }
        );


    if (!reports.length) {

        table.innerHTML = `

            <tr>

                <td colspan="3"
                    class="text-center">

                    No Reports Generated

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML = "";


    reports
        .slice()
        .reverse()
        .forEach(
            report => {

                table.innerHTML += `

                    <tr>

                        <td>
                            ${escapeHtml(
                                report.date
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                report.action
                            )}
                        </td>

                        <td>

                            <span
                                class="badge bg-success"
                            >

                                Generated

                            </span>

                        </td>

                    </tr>

                `;

            }
        );

}


/* ==========================================
   BUTTON EVENTS
========================================== */

function initializeButtons() {

    const studentPdf =
        document.getElementById(
            "downloadStudentPdf"
        );


    const teacherPdf =
        document.getElementById(
            "downloadTeacherPdf"
        );


    const excel =
        document.getElementById(
            "downloadExcel"
        );


    if (studentPdf) {

        studentPdf.addEventListener(
            "click",
            generateStudentAllocationPDF
        );

    }


    if (teacherPdf) {

        teacherPdf.addEventListener(
            "click",
            generateTeacherAllocationPDF
        );

    }


    if (excel) {

        excel.addEventListener(
            "click",
            exportReportExcel
        );

    }

}


/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "📋 Initializing Reports..."
        );


        loadReportData();


        await loadRooms();


        loadStatistics();


        renderExamInformation();


        loadReportHistory();


        initializeButtons();


        console.log(
            "================================"
        );

        console.log(
            "✅ Reports Ready"
        );

        console.log(
            "Students:",
            seating.length
        );

        console.log(
            "Rooms:",
            rooms.length
        );

        console.log(
            "================================"
        );

    }
);