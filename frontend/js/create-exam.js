// ==========================================
// SmartSeat - Create Examination
// ==========================================

console.log("Create Exam JS Loaded");

const API_URL = "http://localhost:5000/api/exams";

let exams = [];


// ==========================================
// AVAILABLE DEPARTMENTS
// ==========================================

const DEPARTMENTS = [
    "BBA.TTM",
    "BBA.AVH",
    "BCOM.CA/CP",
    "BCA",
    "BA.ENG"
];


// ==========================================
// DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Create Exam Page Loaded");

    loadExams();

    initializeDepartmentRows();

    document
        .getElementById("addDepartmentBtn")
        .addEventListener("click", addDepartmentRow);

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
// TOKEN
// ==========================================

function getToken() {

    return localStorage.getItem("token");

}


// ==========================================
// AUTH HEADERS
// ==========================================

function getHeaders() {

    const token = getToken();

    return {
        "Content-Type": "application/json",

        ...(token
            ? {
                Authorization: `Bearer ${token}`
            }
            : {})
    };

}


// ==========================================
// INITIAL DEPARTMENT ROW
// ==========================================

function initializeDepartmentRows() {

    const container =
        document.getElementById(
            "departmentSubjectsContainer"
        );

    container.innerHTML = "";

    addDepartmentRow();

}


// ==========================================
// ADD DEPARTMENT ROW
// ==========================================

function addDepartmentRow() {

    const container =
        document.getElementById(
            "departmentSubjectsContainer"
        );

    const row = document.createElement("div");

    row.className =
        "department-subject-row row align-items-end mb-3";


    row.innerHTML = `

        <div class="col-md-3">

            <label class="form-label">
                Department / Programme
            </label>

            <select
                class="form-select department-select">

                <option value="">
                    Select Department
                </option>

                ${DEPARTMENTS.map(department => `
                    <option value="${escapeHTML(department)}">
                        ${escapeHTML(department)}
                    </option>
                `).join("")}

            </select>

        </div>


        <div class="col-md-3">

            <label class="form-label">
                Subject Code
                <small class="text-muted">
                    (Optional)
                </small>
            </label>

            <input
                type="text"
                class="form-control subject-code"
                placeholder="Example: CS501">

        </div>


        <div class="col-md-4">

            <label class="form-label">
                Subject Name
            </label>

            <input
                type="text"
                class="form-control subject-name"
                placeholder="Enter subject name">

        </div>


        <div class="col-md-2">

            <button
                type="button"
                class="btn btn-outline-danger w-100 remove-department-btn">

                <i class="bi bi-trash"></i>

                Remove

            </button>

        </div>

    `;


    container.appendChild(row);


    row
        .querySelector(".remove-department-btn")
        .addEventListener(
            "click",
            () => {

                row.remove();

                updateCommonSubjects();

            }
        );


    row
        .querySelector(".subject-name")
        .addEventListener(
            "input",
            updateCommonSubjects
        );

}


// ==========================================
// COLLECT DEPARTMENT SUBJECTS
// ==========================================

function collectDepartmentSubjects() {

    const rows =
        document.querySelectorAll(
            ".department-subject-row"
        );

    const subjects = [];


    rows.forEach(row => {

        const department =
            row
                .querySelector(".department-select")
                .value
                .trim();


        const subjectCode =
            row
                .querySelector(".subject-code")
                .value
                .trim();


        const subjectName =
            row
                .querySelector(".subject-name")
                .value
                .trim();


        if (
            department ||
            subjectCode ||
            subjectName
        ) {

            subjects.push({

                department,

                subjectCode,

                subjectName

            });

        }

    });


    return subjects;

}


// ==========================================
// COMMON SUBJECT DETECTION
// ==========================================

function getCommonSubjects(subjects) {

    const groups = {};


    subjects.forEach(subject => {

        const name =
            subject.subjectName
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ");


        if (!name) {
            return;
        }


        if (!groups[name]) {

            groups[name] = [];

        }


        groups[name].push(
            subject.department
        );

    });


    return Object.entries(groups)

        .filter(
            ([name, departments]) =>
                departments.length > 1
        )

        .map(
            ([name, departments]) => ({
                subjectName: name,
                departments
            })
        );

}


// ==========================================
// UPDATE COMMON SUBJECT INFO
// ==========================================

function updateCommonSubjects() {

    const subjects =
        collectDepartmentSubjects();


    const commonSubjects =
        getCommonSubjects(subjects);


    const info =
        document.getElementById(
            "commonSubjectsInfo"
        );


    const text =
        document.getElementById(
            "commonSubjectsText"
        );


    if (commonSubjects.length === 0) {

        info.style.display = "none";

        text.textContent = "";

        return;

    }


    info.style.display = "block";


    text.innerHTML =
        commonSubjects
            .map(common => {

                return `
                    <strong>
                        ${escapeHTML(
                            common.subjectName
                        )}
                    </strong>

                    →
                    
                    ${common.departments
                        .map(escapeHTML)
                        .join(", ")}
                `;

            })
            .join("<br>");

}


// ==========================================
// LOAD EXAMS
// ==========================================

async function loadExams() {

    try {

        const response =
            await fetch(
                API_URL,
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
                data.error ||
                "Failed to load examinations."
            );

        }


        if (Array.isArray(data)) {

            exams = data;

        }

        else if (Array.isArray(data.exams)) {

            exams = data.exams;

        }

        else if (Array.isArray(data.data)) {

            exams = data.data;

        }

        else {

            exams = [];

        }


        renderTable(exams);

        updateStatistics();

    }

    catch (error) {

        console.error(
            "Load examinations error:",
            error
        );


        Swal.fire({

            icon: "error",

            title: "Unable to Load Exams",

            text: error.message

        });

    }

}


// ==========================================
// SAVE EXAM
// ==========================================

async function saveExam() {

    console.log("Save Examination clicked");


    // ======================================
    // COMMON DETAILS
    // ======================================

    const examName =
        document
            .getElementById("examName")
            .value
            .trim();
    console.log("EXAM NAME:", examName);


    const semester =
        document
            .getElementById("examSemester")
            .value;


    const session =
        document
            .getElementById("session")
            .value;


    const examDate =
        document
            .getElementById("examDate")
            .value;


    const startTime =
        document
            .getElementById("startTime")
            .value;


    const endTime =
        document
            .getElementById("endTime")
            .value;


    // ======================================
    // DEPARTMENT SUBJECTS
    // ======================================

    const departmentSubjects =
        collectDepartmentSubjects();


    // ======================================
    // VALIDATION
    // ======================================

    if (!examName) {

        Swal.fire(
            "Required",
            "Please enter the exam name.",
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


    if (departmentSubjects.length === 0) {

        Swal.fire(
            "Departments Required",
            "Please add at least one department and subject.",
            "warning"
        );

        return;
    }


    // ======================================
    // VALIDATE EACH ROW
    // ======================================

    for (
        const subject
        of departmentSubjects
    ) {

        if (!subject.department) {

            Swal.fire(
                "Department Required",
                "Please select a department for every row.",
                "warning"
            );

            return;
        }


        if (!subject.subjectName) {

            Swal.fire(
                "Subject Required",
                `Please enter the subject name for ${subject.department}.`,
                "warning"
            );

            return;
        }

    }


    // ======================================
    // CHECK DUPLICATE DEPARTMENTS
    // ======================================

    const departmentNames =
        departmentSubjects.map(
            subject =>
                subject.department
        );


    const duplicateDepartments =
        departmentNames.filter(
            (department, index) =>
                departmentNames.indexOf(
                    department
                ) !== index
        );


    if (duplicateDepartments.length > 0) {

        Swal.fire(
            "Duplicate Department",
            `${duplicateDepartments[0]} has been added more than once.`,
            "warning"
        );

        return;
    }


    // ======================================
    // COMMON SUBJECTS
    // ======================================

    const commonSubjects =
        getCommonSubjects(
            departmentSubjects
        );


    console.log(
        "Common subjects:",
        commonSubjects
    );


    // ======================================
    // EXAM DATA
    // ======================================

    const examData = {

        examName,

        semester: Number(semester),

        session,

        examDate,

        startTime,

        endTime,

        subjects: departmentSubjects,

        status: true

    };


    console.log(
        "Sending examination:",
        examData
    );


    // ======================================
    // SAVE TO MONGODB
    // ======================================

    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: getHeaders(),

                    body:
                        JSON.stringify(
                            examData
                        )

                }
            );


        const data =
            await response.json();


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
                "The examination and department subjects were created successfully.",

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

            text: error.message

        });

    }

}


// ==========================================
// CLEAR FORM
// ==========================================

function clearForm() {

    document
        .getElementById("examName")
        .value = "";


    document
        .getElementById("examSemester")
        .value = "";


    document
        .getElementById("session")
        .value = "";


    document
        .getElementById("examDate")
        .value = "";


    document
        .getElementById("startTime")
        .value = "";


    document
        .getElementById("endTime")
        .value = "";


    initializeDepartmentRows();

}


// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(data) {

    const table =
        document.getElementById(
            "examTable"
        );


    table.innerHTML = "";


    if (!data || data.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center">

                    No Exams Created

                </td>

            </tr>

        `;

        return;
    }


    data.forEach(exam => {

        const date =
            exam.examDate
                ? new Date(
                    exam.examDate
                ).toLocaleDateString()
                : "-";


        const time =
            exam.startTime &&
            exam.endTime

                ? `${exam.startTime} - ${exam.endTime}`

                : exam.session || "-";


        const examId =
            exam._id || exam.id;


        const subjects =
            Array.isArray(exam.subjects)
                ? exam.subjects
                : [];


        const departments =
            subjects
                .map(
                    subject =>
                        subject.department
                )
                .filter(Boolean);


        table.innerHTML += `

            <tr>

                <td>

                    <strong>
                        ${escapeHTML(
                            exam.examName || "-"
                        )}
                    </strong>

                    <br>

                    <small>

                        ${subjects.length}
                        subject(s)

                    </small>

                </td>


                <td>

                    Semester
                    ${exam.semester || "-"}

                </td>


                <td>

                    ${date}

                </td>


                <td>

                    ${time}

                </td>


                <td>

                    ${departments.length}

                    Department(s)

                </td>


                <td>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="deleteExam('${examId}')">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>

            </tr>

        `;

    });

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const today =
        new Date().toDateString();


    const todayCount =
        exams.filter(exam => {

            if (!exam.examDate) {
                return false;
            }

            return new Date(
                exam.examDate
            ).toDateString() === today;

        }).length;


    const upcoming =
        exams.filter(exam => {

            if (!exam.examDate) {
                return false;
            }

            return new Date(
                exam.examDate
            ) > new Date();

        }).length;


    const semesters =
        new Set(

            exams
                .map(exam => exam.semester)
                .filter(Boolean)

        );


    document.getElementById(
        "totalExams"
    ).textContent = exams.length;


    document.getElementById(
        "todayExams"
    ).textContent = todayCount;


    document.getElementById(
        "upcomingExams"
    ).textContent = upcoming;


    document.getElementById(
        "departmentCount"
    ).textContent = semesters.size;


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
// SEARCH
// ==========================================

function searchExams() {

    const keyword =
        document
            .getElementById("searchExam")
            .value
            .toLowerCase()
            .trim();


    const filtered =
        exams.filter(exam => {

            const subjects =
                Array.isArray(exam.subjects)
                    ? exam.subjects
                    : [];


            const subjectText =
                subjects
                    .map(subject =>
                        `${subject.department} ${subject.subjectName} ${subject.subjectCode}`
                    )
                    .join(" ")
                    .toLowerCase();


            return (

                String(
                    exam.examName || ""
                )
                .toLowerCase()
                .includes(keyword)

                ||

                String(
                    exam.semester || ""
                )
                .toLowerCase()
                .includes(keyword)

                ||

                subjectText.includes(
                    keyword
                )

            );

        });


    renderTable(filtered);

}


// ==========================================
// DELETE EXAM
// ==========================================

async function deleteExam(id) {

    if (!id) {

        Swal.fire(
            "Error",
            "Invalid examination ID.",
            "error"
        );

        return;
    }


    const result =
        await Swal.fire({

            title:
                "Delete Examination?",

            text:
                "This will remove the examination and its department subjects.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Delete",

            cancelButtonText:
                "Cancel"

        });


    if (!result.isConfirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method:
                        "DELETE",

                    headers:
                        getHeaders()

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Delete failed."
            );

        }


        await Swal.fire({

            icon:
                "success",

            title:
                "Deleted",

            text:
                "Examination deleted successfully."

        });


        await loadExams();

    }

    catch (error) {

        console.error(error);


        Swal.fire(
            "Error",
            error.message,
            "error"
        );

    }

}


// ==========================================
// CLEAR ALL
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

            title:
                "Delete All Examinations?",

            text:
                "This will permanently remove all examinations.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Delete All",

            cancelButtonText:
                "Cancel"

        });


    if (!result.isConfirmed) {
        return;
    }


    try {

        for (
            const exam
            of exams
        ) {

            const id =
                exam._id || exam.id;


            await deleteExamDirect(id);

        }


        await Swal.fire({

            icon:
                "success",

            title:
                "Success",

            text:
                "All examinations deleted."

        });


        await loadExams();

    }

    catch (error) {

        console.error(error);


        Swal.fire(
            "Error",
            error.message,
            "error"
        );

    }

}


// ==========================================
// DIRECT DELETE
// ==========================================

async function deleteExamDirect(id) {

    const response =
        await fetch(
            `${API_URL}/${id}`,
            {

                method:
                    "DELETE",

                headers:
                    getHeaders()

            }
        );


    if (!response.ok) {

        let data = {};

        try {

            data =
                await response.json();

        }

        catch (error) {

            // Ignore invalid JSON

        }


        throw new Error(
            data.message ||
            "Failed to delete examination."
        );

    }

}


// ==========================================
// EXPORT EXAMS
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
            "Semester",
            "Date",
            "Session",
            "Start Time",
            "End Time",
            "Department",
            "Subject Code",
            "Subject Name"
        ]

    ];


    exams.forEach(exam => {

        const subjects =
            Array.isArray(exam.subjects)
                ? exam.subjects
                : [];


        subjects.forEach(subject => {

            rows.push([

                exam.examName || "",

                exam.semester || "",

                exam.examDate
                    ? String(
                        exam.examDate
                    ).substring(0, 10)
                    : "",

                exam.session || "",

                exam.startTime || "",

                exam.endTime || "",

                subject.department || "",

                subject.subjectCode || "",

                subject.subjectName || ""

            ]);

        });

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