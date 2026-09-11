// ==========================================
// SmartSeat - Create Examination
// ==========================================

console.log("Create Exam JS Loaded");

const API_URL = "http://localhost:5000/api/exams";

let exams = [];

// ==========================================
// DOM Ready
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Create Exam Page Loaded");

    loadExams();

    document
        .getElementById("saveExamBtn")
        .addEventListener("click", saveExam);

    document
        .getElementById("searchExam")
        .addEventListener("input", searchExams);

    document
        .getElementById("exportExamBtn")
        .addEventListener("click", exportExams);

    document
        .getElementById("clearExamBtn")
        .addEventListener("click", clearAllExams);

    document
        .getElementById("clearExamBtnBottom")
        .addEventListener("click", clearAllExams);

});


// ==========================================
// Get Token
// ==========================================

function getToken() {

    return localStorage.getItem("token");

}


// ==========================================
// Load Exams
// ==========================================

async function loadExams() {

    console.log("Loading examinations...");

    try {

        const token = getToken();

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {

                "Content-Type": "application/json",

                ...(token
                    ? {
                        Authorization: `Bearer ${token}`
                    }
                    : {})

            }

        });


        const data = await response.json();

        console.log(
            "Exams API response:",
            response.status,
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                `Failed to load exams: ${response.status}`
            );

        }


        /*
         * Backend may return:
         *
         * []
         *
         * OR
         *
         * { exams: [] }
         *
         * OR
         *
         * { data: [] }
         *
         * OR
         *
         * { results: [] }
         */

        if (Array.isArray(data)) {

            exams = data;

        }

        else if (Array.isArray(data.exams)) {

            exams = data.exams;

        }

        else if (Array.isArray(data.data)) {

            exams = data.data;

        }

        else if (Array.isArray(data.results)) {

            exams = data.results;

        }

        else {

            console.error(
                "Unexpected examinations API response:",
                data
            );

            exams = [];

        }


        console.log(
            "Exams loaded:",
            exams
        );


        renderTable(exams);

        updateStatistics();

    }

    catch (error) {

        console.error(
            "Load examinations error:",
            error
        );

        Swal.fire(
            "Error",
            "Unable to load examinations.",
            "error"
        );

    }

}

// ==========================================
// Save Examination
// ==========================================
async function saveExam() {

    console.log("Save Examination button clicked");


    const examName =
        document.getElementById("examName").value.trim();

    const subjectCode =
        document.getElementById("subjectCode").value.trim();

    const subjectName =
        document.getElementById("subjectName").value.trim();

    const semester =
        document.getElementById("examSemester").value;

    const session =
        document.getElementById("session").value;

    const examDate =
        document.getElementById("examDate").value;

    const startTime =
        document.getElementById("startTime").value;

    const endTime =
        document.getElementById("endTime").value;


    // Validation

    if (!examName) {

        Swal.fire(
            "Required",
            "Please enter the exam name.",
            "warning"
        );

        return;
    }


    if (!subjectCode) {

        Swal.fire(
            "Required",
            "Please enter the subject code.",
            "warning"
        );

        return;
    }


    if (!subjectName) {

        Swal.fire(
            "Required",
            "Please enter the subject name.",
            "warning"
        );

        return;
    }


    if (!semester) {

        Swal.fire(
            "Required",
            "Please select a semester.",
            "warning"
        );

        return;
    }


    if (!session) {

        Swal.fire(
            "Required",
            "Please select a session.",
            "warning"
        );

        return;
    }


    if (!examDate) {

        Swal.fire(
            "Required",
            "Please select the exam date.",
            "warning"
        );

        return;
    }


    if (!startTime) {

        Swal.fire(
            "Required",
            "Please select the start time.",
            "warning"
        );

        return;
    }


    if (!endTime) {

        Swal.fire(
            "Required",
            "Please select the end time.",
            "warning"
        );

        return;
    }


    if (endTime <= startTime) {

        Swal.fire(
            "Invalid Time",
            "End time must be after start time.",
            "warning"
        );

        return;
    }


    // Create examination object

    const examData = {

        examName: examName,

        subjectCode: subjectCode,

        subjectName: subjectName,

        semester: Number(semester),

        session: session,

        examDate: examDate,

        startTime: startTime,

        endTime: endTime,

        status: true

    };


    console.log(
        "Exam data being sent:",
        examData
    );


    try {

        const token = getToken();

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                ...(token
                    ? {
                        Authorization:
                        `Bearer ${token}`
                    }
                    : {})

            },

            body: JSON.stringify(examData)

        });


        const data = await response.json();


        console.log(
            "API response:",
            response.status,
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "Unable to save examination."
            );

        }


        await Swal.fire({

            icon: "success",

            title: "Examination Saved",

            text:
                "Examination created successfully.",

            confirmButtonText: "OK"

        });


        clearForm();


        await loadExams();

    }

    catch (error) {

        console.error(
            "Save examination error:",
            error
        );

        Swal.fire({

            icon: "error",

            title: "Unable to Save Examination",

            text: error.message,

            confirmButtonText: "OK"

        });

    }

}

    

// ==========================================
// Clear Form
// ==========================================

function clearForm() {

    document.getElementById("examName").value = "";

    document.getElementById("subjectCode").value = "";

    document.getElementById("subjectName").value = "";

    document.getElementById("examSemester").value = "";

    document.getElementById("session").value = "";

    document.getElementById("examDate").value = "";

    document.getElementById("startTime").value = "";

    document.getElementById("endTime").value = "";

}

// ==========================================
// Render Examination Table
// ==========================================

function renderTable(data) {

    const table =
        document.getElementById("examTable");

    table.innerHTML = "";


    if (!data || data.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6"
                    class="text-center">

                    No Exams Created

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(exam => {

        const date = exam.examDate
            ? new Date(exam.examDate).toLocaleDateString()
            : "-";


        const time =

            exam.startTime && exam.endTime

                ? `${exam.startTime} - ${exam.endTime}`

                : exam.session || "-";


        table.innerHTML += `

            <tr>

                <td>

                    <strong>
                        ${exam.examName || "-"}
                    </strong>

                    <br>

                    <small>
                        ${exam.subjectCode || ""}
                        ${exam.subjectName || ""}
                    </small>

                </td>


                <td>

                    Semester ${exam.semester || "-"}

                </td>


                <td>

                    ${date}

                </td>


                <td>

                    ${time}

                </td>


                <td>

                    ${exam.room || "-"}

                </td>


                <td>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="deleteExam('${exam._id}')">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>

            </tr>

        `;

    });

}


// ==========================================
// Statistics
// ==========================================

function updateStatistics() {

    const today =
        new Date().toDateString();


    const todayCount =
        exams.filter(exam => {

            if (!exam.examDate) return false;

            return new Date(
                exam.examDate
            ).toDateString() === today;

        }).length;


    const upcoming =
        exams.filter(exam => {

            if (!exam.examDate) return false;

            return new Date(
                exam.examDate
            ) > new Date();

        }).length;


    // Total

    document.getElementById(
        "totalExams"
    ).textContent = exams.length;


    // Today

    document.getElementById(
        "todayExams"
    ).textContent = todayCount;


    // Upcoming

    document.getElementById(
        "upcomingExams"
    ).textContent = upcoming;


    // Semesters

    const semesters =
        new Set(
            exams.map(exam => exam.semester)
        );


    document.getElementById(
        "departmentCount"
    ).textContent = semesters.size;


    // Summary

    document.getElementById(
        "summaryTotal"
    ).textContent = exams.length;


    document.getElementById(
        "summaryToday"
    ).textContent = todayCount;


    document.getElementById(
        "summaryUpcoming"
    ).textContent = upcoming;


    document.getElementById(
        "summaryDepartments"
    ).textContent = semesters.size;

}


// ==========================================
// Search
// ==========================================

function searchExams() {

    const keyword =
        document
            .getElementById("searchExam")
            .value
            .toLowerCase()
            .trim();


    const filtered = exams.filter(exam => {

        return (

            (exam.examName || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (exam.subjectCode || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (exam.subjectName || "")
                .toLowerCase()
                .includes(keyword)

        );

    });


    renderTable(filtered);

}


// ==========================================
// Delete Exam
// ==========================================

async function deleteExam(id) {

    const result =
        await Swal.fire({

            title: "Delete Examination?",

            text: "This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Delete",

            cancelButtonText: "Cancel"

        });


    if (!result.isConfirmed) {

        return;

    }


    try {

        const token = getToken();

        const response =
            await fetch(`${API_URL}/${id}`, {

                method: "DELETE",

                headers: {

                    ...(token
                        ? {
                            Authorization:
                            `Bearer ${token}`
                        }
                        : {})

                }

            });


        if (!response.ok) {

            const data =
                await response.json();

            throw new Error(
                data.message ||
                "Delete failed."
            );

        }


        await Swal.fire(
            "Deleted",
            "Examination deleted successfully.",
            "success"
        );


        loadExams();

    }

    catch (error) {

        console.error(
            "Delete examination error:",
            error
        );

        Swal.fire(
            "Error",
            error.message,
            "error"
        );

    }

}


// ==========================================
// Clear All Exams
// ==========================================

async function clearAllExams() {

    if (exams.length === 0) {

        Swal.fire(
            "No Exams",
            "There are no examinations to delete.",
            "info"
        );

        return;

    }


    const result =
        await Swal.fire({

            title: "Delete All Examinations?",

            text:
                "This will permanently remove all examinations.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Delete All",

            cancelButtonText: "Cancel"

        });


    if (!result.isConfirmed) {

        return;

    }


    try {

        for (const exam of exams) {

            await deleteExamDirect(exam._id);

        }


        await Swal.fire(
            "Success",
            "All examinations deleted.",
            "success"
        );


        loadExams();

    }

    catch (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Unable to clear examinations.",
            "error"
        );

    }

}


// ==========================================
// Direct Delete
// ==========================================

async function deleteExamDirect(id) {

    const token = getToken();

    const response =
        await fetch(`${API_URL}/${id}`, {

            method: "DELETE",

            headers: {

                ...(token
                    ? {
                        Authorization:
                        `Bearer ${token}`
                    }
                    : {})

            }

        });


    if (!response.ok) {

        throw new Error(
            "Failed to delete examination."
        );

    }

}


// ==========================================
// Export Exams
// ==========================================

function exportExams() {

    if (exams.length === 0) {

        Swal.fire(
            "No Data",
            "There are no examinations to export.",
            "info"
        );

        return;

    }


    const rows = [

        [

            "Exam Name",

            "Subject Code",

            "Subject Name",

            "Semester",

            "Date",

            "Session",

            "Start Time",

            "End Time"

        ]

    ];


    exams.forEach(exam => {

        rows.push([

            exam.examName || "",

            exam.subjectCode || "",

            exam.subjectName || "",

            exam.semester || "",

            exam.examDate
                ? exam.examDate.substring(0, 10)
                : "",

            exam.session || "",

            exam.startTime || "",

            exam.endTime || ""

        ]);

    });


    const worksheet =
        XLSX.utils.aoa_to_sheet(rows);


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Examinations"
    );


    XLSX.writeFile(
        workbook,
        "examinations.xlsx"
    );

}