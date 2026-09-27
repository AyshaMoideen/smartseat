// ==========================================
// SmartSeat - Exam Management
// Multi-Batch / Multi-Semester Version
// ==========================================

const API_BASE =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:5000"
        : "";

const API_URL = `${API_BASE}/api/exams`;
const BATCH_API_URL = `${API_BASE}/api/batches`;

const token = localStorage.getItem("token");

let exams = [];
let batches = [];
let editExamId = null;

const examModalElement =
    document.getElementById("examModal");

const examModal =
    examModalElement
        ? new bootstrap.Modal(examModalElement)
        : null;


// ==========================================
// DEPARTMENTS
// ==========================================

const DEPARTMENTS = [
    "BBA.TTM",
    "BBA.AVH",
    "BBA.HA",
    "BCOM.CA",
    "BCOM.CP",
    "BCA",
    "BA.ENG"
];


// ==========================================
// AUTH HEADERS
// ==========================================

function authHeaders(json = false) {

    const headers = {
        Authorization: `Bearer ${token}`
    };

    if (json) {
        headers["Content-Type"] =
            "application/json";
    }

    return headers;
}


// ==========================================
// LOAD BATCHES
// ==========================================

async function loadBatches() {

    try {

        const response =
            await fetch(
                BATCH_API_URL,
                {
                    headers:
                        authHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load batches"
            );

        }


        const data =
            await response.json();


        /*
         * Batch API may return:
         *
         * [
         *   ...
         * ]
         *
         * OR:
         *
         * {
         *   batches: [...]
         * }
         */

        batches =
            Array.isArray(data)
                ? data
                : Array.isArray(data.batches)
                    ? data.batches
                    : [];


        console.log(
            "📦 Batches loaded:",
            batches
        );

    }

    catch (error) {

        console.error(
            "Load Batches Error:",
            error
        );


        Swal.fire(
            "Error",
            "Unable to load batches.",
            "error"
        );

    }

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
                    headers:
                        authHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load exams"
            );

        }


        const data =
            await response.json();


        exams =
            Array.isArray(data)
                ? data
                : Array.isArray(data.exams)
                    ? data.exams
                    : [];


        renderTable();

        updateStatistics();

    }

    catch (error) {

        console.error(
            "Load Exams Error:",
            error
        );


        Swal.fire(
            "Error",
            "Unable to load exams.",
            "error"
        );

    }

}


// ==========================================
// GET BATCH NAME
// ==========================================

function getBatchName(batchId) {

    const batch =
        batches.find(
            item =>
                String(item._id) ===
                String(batchId)
        );


    if (batch) {
        return batch.batchName;
    }


    return "Unknown Batch";

}


// ==========================================
// GET BATCH OBJECT
// ==========================================

function getBatch(batchId) {

    return batches.find(
        item =>
            String(item._id) ===
            String(batchId)
    );

}


// ==========================================
// GET PARTICIPATING LABEL
// ==========================================

function getParticipatingLabel(exam) {

    if (
        !Array.isArray(
            exam.participatingSemesters
        )
    ) {
        return "—";
    }


    return exam.participatingSemesters
        .map(item => {

            const batchName =
                item.batchName ||
                item.batch?.batchName ||
                "Unknown Batch";

            return `${batchName} → Sem ${item.semester}`;

        })
        .join("<br>");

}


// ==========================================
// GET SUBJECT SUMMARY
// ==========================================

function getSubjectSummary(exam) {

    if (
        !Array.isArray(exam.subjects) ||
        exam.subjects.length === 0
    ) {

        return "—";

    }


    return exam.subjects
        .map(subject => {

            const code =
                subject.subjectCode
                    ? `<strong>${subject.subjectCode}</strong><br>`
                    : "";

            return `
                ${code}
                <small>
                    ${subject.subjectName}
                </small>
            `;

        })
        .join('<hr class="my-1">');

}


// ==========================================
// RENDER TABLE
// ==========================================

function renderTable(data = exams) {

    const table =
        document.getElementById(
            "examTable"
        );


    if (!table) return;


    table.innerHTML = "";


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center">

                    No Exams Found

                </td>

            </tr>

        `;

        return;

    }


    data.forEach(exam => {

        table.innerHTML += `

            <tr>

                <td>
                    ${exam.examName}
                </td>


                <td>

                    ${getSubjectSummary(exam)}

                </td>


                <td>

                    ${getParticipatingLabel(exam)}

                </td>


                <td>

                    ${new Date(
                        exam.examDate
                    ).toLocaleDateString()}

                </td>


                <td>

                    ${exam.session}

                </td>


                <td>

                    <span
                        class="badge ${
                            exam.status
                                ? "bg-success"
                                : "bg-secondary"
                        }">

                        ${
                            exam.status
                                ? "Active"
                                : "Inactive"
                        }

                    </span>

                </td>


                <td>

                    <button
                        class="btn btn-sm btn-warning editBtn"
                        data-id="${exam._id}">

                        <i
                            class="bi bi-pencil-fill">
                        </i>

                    </button>


                    <button
                        class="btn btn-sm btn-danger deleteBtn"
                        data-id="${exam._id}">

                        <i
                            class="bi bi-trash-fill">
                        </i>

                    </button>

                </td>

            </tr>

        `;

    });

}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const today =
        new Date().toDateString();


    const now =
        new Date();


    const upcoming =
        exams.filter(exam => {

            const date =
                new Date(exam.examDate);

            return date > now;

        }).length;


    const todayCount =
        exams.filter(exam => {

            return (
                new Date(
                    exam.examDate
                ).toDateString() === today
            );

        }).length;


    const completed =
        exams.filter(exam => {

            const date =
                new Date(exam.examDate);

            return date < now;

        }).length;


    document.getElementById(
        "totalExams"
    ).textContent =
        exams.length;


    document.getElementById(
        "upcomingExams"
    ).textContent =
        upcoming;


    document.getElementById(
        "todayExams"
    ).textContent =
        todayCount;


    document.getElementById(
        "completedExams"
    ).textContent =
        completed;


    document.getElementById(
        "summaryExams"
    ).textContent =
        exams.length;


    document.getElementById(
        "summaryUpcoming"
    ).textContent =
        upcoming;


    document.getElementById(
        "summaryToday"
    ).textContent =
        todayCount;


    document.getElementById(
        "summaryCompleted"
    ).textContent =
        completed;

}


// ==========================================
// CREATE BATCH / SEMESTER ROW
// ==========================================

function createSemesterRow(
    selectedBatchId = "",
    selectedSemester = ""
) {

    const container =
        document.getElementById(
            "participatingSemesterContainer"
        );


    if (!container) return;


    const row =
        document.createElement("div");


    row.className =
        "row g-2 align-items-end mb-2 participating-semester-row";


    row.innerHTML = `

        <div class="col-md-6">

            <label class="form-label">

                Batch

            </label>

            <select
                class="form-select participating-batch">

                <option value="">
                    Select Batch
                </option>

                ${batches.map(batch => `

                    <option
                        value="${batch._id}"
                        ${
                            String(
                                selectedBatchId
                            ) ===
                            String(batch._id)
                                ? "selected"
                                : ""
                        }>

                        ${batch.batchName}

                    </option>

                `).join("")}

            </select>

        </div>


        <div class="col-md-4">

            <label class="form-label">

                Semester

            </label>

            <select
                class="form-select participating-semester">

                <option value="">
                    Select Semester
                </option>

                ${[1,2,3,4,5,6].map(
                    semester => `

                        <option
                            value="${semester}"
                            ${
                                Number(
                                    selectedSemester
                                ) === semester
                                    ? "selected"
                                    : ""
                            }>

                            Semester ${semester}

                        </option>

                    `
                ).join("")}

            </select>

        </div>


        <div class="col-md-2">

            <button
                type="button"
                class="btn btn-outline-danger w-100 remove-semester-btn">

                <i class="bi bi-trash"></i>

            </button>

        </div>

    `;


    container.appendChild(row);


    row
        .querySelector(
            ".remove-semester-btn"
        )
        .addEventListener(
            "click",
            () => {

                row.remove();

                refreshSubjectBatchOptions();

            }
        );


    row
        .querySelector(
            ".participating-batch"
        )
        .addEventListener(
            "change",
            refreshSubjectBatchOptions
        );


    row
        .querySelector(
            ".participating-semester"
        )
        .addEventListener(
            "change",
            refreshSubjectBatchOptions
        );

}


// ==========================================
// GET SELECTED PARTICIPATING SEMESTERS
// ==========================================

function getParticipatingSemesters() {

    const rows =
        document.querySelectorAll(
            ".participating-semester-row"
        );


    const result = [];


    rows.forEach(row => {

        const batch =
            row.querySelector(
                ".participating-batch"
            )?.value;


        const semester =
            row.querySelector(
                ".participating-semester"
            )?.value;


        if (batch && semester) {

            result.push({
                batch,
                semester:
                    Number(semester)
            });

        }

    });


    return result;

}


// ==========================================
// CHECK DUPLICATE PARTICIPATING COMBINATION
// ==========================================

function hasDuplicateParticipatingSemesters() {

    const selected =
        getParticipatingSemesters();


    const combinations =
        new Set();


    for (const item of selected) {

        const key =
            `${item.batch}_${item.semester}`;


        if (
            combinations.has(key)
        ) {

            return true;

        }


        combinations.add(key);

    }


    return false;

}


// ==========================================
// CREATE SUBJECT ROW
// ==========================================

function createSubjectRow(
    selectedData = {}
) {

    const container =
        document.getElementById(
            "subjectContainer"
        );


    if (!container) return;


    const row =
        document.createElement("tr");


    row.className =
        "subject-row";


    const selectedBatch =
        selectedData.batch || "";


    const selectedSemester =
        selectedData.semester || "";


    const selectedDepartment =
        selectedData.department || "";


    row.innerHTML = `

        <td>

            <select
                class="form-select subject-batch">

                <option value="">
                    Select Batch
                </option>

            </select>

        </td>


        <td>

            <select
                class="form-select subject-semester">

                <option value="">
                    Select Semester
                </option>

                ${[1,2,3,4,5,6].map(
                    semester => `

                        <option
                            value="${semester}"
                            ${
                                Number(
                                    selectedSemester
                                ) === semester
                                    ? "selected"
                                    : ""
                            }>

                            ${semester}

                        </option>

                    `
                ).join("")}

            </select>

        </td>


        <td>

            <select
                class="form-select subject-department">

                <option value="">
                    Select Department
                </option>

                ${DEPARTMENTS.map(
                    department => `

                        <option
                            value="${department}"
                            ${
                                selectedDepartment ===
                                department
                                    ? "selected"
                                    : ""
                            }>

                            ${department}

                        </option>

                    `
                ).join("")}

            </select>

        </td>


        <td>

            <input
                type="text"
                class="form-control subject-code"
                placeholder="Code"
                value="${
                    selectedData.subjectCode || ""
                }">

        </td>


        <td>

            <input
                type="text"
                class="form-control subject-name"
                placeholder="Subject Name"
                value="${
                    selectedData.subjectName || ""
                }">

        </td>


        <td>

            <button
                type="button"
                class="btn btn-sm btn-outline-danger remove-subject-btn">

                <i class="bi bi-trash"></i>

            </button>

        </td>

    `;


    container.appendChild(row);


    populateSubjectBatchOptions(
        row,
        selectedBatch
    );


    row
        .querySelector(
            ".remove-subject-btn"
        )
        .addEventListener(
            "click",
            () => row.remove()
        );


    row
        .querySelector(
            ".subject-batch"
        )
        .addEventListener(
            "change",
            () => {

                syncSubjectSemester(
                    row
                );

            }
        );

}


// ==========================================
// POPULATE SUBJECT BATCH OPTIONS
// ==========================================

function populateSubjectBatchOptions(
    row,
    selectedBatch = ""
) {

    const select =
        row.querySelector(
            ".subject-batch"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="">
            Select Batch
        </option>

        ${batches.map(batch => `

            <option
                value="${batch._id}"
                ${
                    String(
                        selectedBatch
                    ) ===
                    String(batch._id)
                        ? "selected"
                        : ""
                }>

                ${batch.batchName}

            </option>

        `).join("")}

    `;

}


// ==========================================
// GET SELECTED BATCH/SEMESTER PAIRS
// ==========================================

function getAllowedBatchSemesters() {

    return getParticipatingSemesters();

}


// ==========================================
// SYNC SUBJECT SEMESTER
// ==========================================

function syncSubjectSemester(row) {

    const batch =
        row.querySelector(
            ".subject-batch"
        )?.value;


    const semesterSelect =
        row.querySelector(
            ".subject-semester"
        );


    if (!semesterSelect) return;


    const allowed =
        getAllowedBatchSemesters()
            .filter(
                item =>
                    String(item.batch) ===
                    String(batch)
            );


    const currentValue =
        semesterSelect.value;


    semesterSelect.innerHTML = `

        <option value="">
            Select Semester
        </option>

        ${
            allowed.map(
                item => `

                    <option
                        value="${item.semester}">

                        Semester ${item.semester}

                    </option>

                `
            ).join("")
        }

    `;


    if (
        allowed.some(
            item =>
                String(item.semester) ===
                String(currentValue)
        )
    ) {

        semesterSelect.value =
            currentValue;

    }

}


// ==========================================
// REFRESH ALL SUBJECT BATCH OPTIONS
// ==========================================

function refreshSubjectBatchOptions() {

    const selected =
        getAllowedBatchSemesters();


    document
        .querySelectorAll(
            ".subject-row"
        )
        .forEach(row => {

            const batchSelect =
                row.querySelector(
                    ".subject-batch"
                );


            const semesterSelect =
                row.querySelector(
                    ".subject-semester"
                );


            const currentBatch =
                batchSelect?.value;


            const currentSemester =
                semesterSelect?.value;


            populateSubjectBatchOptions(
                row,
                currentBatch
            );


            const allowedSemesters =
                selected
                    .filter(
                        item =>
                            String(item.batch) ===
                            String(currentBatch)
                    )
                    .map(
                        item =>
                            Number(item.semester)
                    );


            if (
                semesterSelect
            ) {

                semesterSelect.innerHTML = `

                    <option value="">
                        Select Semester
                    </option>

                    ${
                        allowedSemesters.map(
                            semester => `

                                <option
                                    value="${semester}">

                                    Semester ${semester}

                                </option>

                            `
                        ).join("")
                    }

                `;


                if (
                    allowedSemesters.includes(
                        Number(currentSemester)
                    )
                ) {

                    semesterSelect.value =
                        currentSemester;

                }

            }

        });

}


// ==========================================
// CLEAR EXAM MODAL
// ==========================================

function clearExamModal() {

    document.getElementById(
        "examName"
    ).value = "";


    document.getElementById(
        "examDate"
    ).value = "";


    document.getElementById(
        "session"
    ).value = "Morning";


    document.getElementById(
        "startTime"
    ).value = "10:00";


    document.getElementById(
        "endTime"
    ).value = "12:00";


    document.getElementById(
        "duration"
    ).value = "2 Hours";


    document.getElementById(
        "examStatus"
    ).value = "true";


    document.getElementById(
        "participatingSemesterContainer"
    ).innerHTML = "";


    document.getElementById(
        "subjectContainer"
    ).innerHTML = "";


    createSemesterRow();


    createSubjectRow();

}


// ==========================================
// LOAD EXAM INTO MODAL
// ==========================================

function loadExamIntoModal(exam) {

    document.getElementById(
        "examName"
    ).value =
        exam.examName || "";


    document.getElementById(
        "examDate"
    ).value =
        exam.examDate
            ? exam.examDate.substring(0, 10)
            : "";


    document.getElementById(
        "session"
    ).value =
        exam.session || "Morning";


    document.getElementById(
        "startTime"
    ).value =
        exam.startTime || "10:00";


    document.getElementById(
        "endTime"
    ).value =
        exam.endTime || "12:00";


    document.getElementById(
        "duration"
    ).value =
        exam.duration || "2 Hours";


    document.getElementById(
        "examStatus"
    ).value =
        exam.status
            ? "true"
            : "false";


    const semesterContainer =
        document.getElementById(
            "participatingSemesterContainer"
        );


    const subjectContainer =
        document.getElementById(
            "subjectContainer"
        );


    semesterContainer.innerHTML = "";


    subjectContainer.innerHTML = "";


    if (
        Array.isArray(
            exam.participatingSemesters
        )
    ) {

        exam.participatingSemesters
            .forEach(item => {

                createSemesterRow(
                    item.batch?._id ||
                    item.batch,
                    item.semester
                );

            });

    }


    if (
        Array.isArray(exam.subjects)
    ) {

        exam.subjects.forEach(
            subject => {

                createSubjectRow({

                    batch:
                        subject.batch?._id ||
                        subject.batch,

                    semester:
                        subject.semester,

                    department:
                        subject.department,

                    subjectCode:
                        subject.subjectCode,

                    subjectName:
                        subject.subjectName

                });

            }
        );

    }


    refreshSubjectBatchOptions();

}

// ==========================================
// OPEN ADD EXAM MODAL
// ==========================================

const addExamBtn =
    document.getElementById("addExamBtn");

if (addExamBtn) {

    addExamBtn.addEventListener(
        "click",
        () => {

            console.log(
                "➕ Add Exam button clicked"
            );

            editExamId = null;


            const modalTitle =
                document.querySelector(
                    "#examModal .modal-title"
                );

            if (modalTitle) {

                modalTitle.innerHTML = `

                    <i class="bi bi-journal-plus"></i>

                    Add Exam

                `;

            }


            const saveButton =
                document.getElementById(
                    "saveExamBtn"
                );

            if (saveButton) {

                saveButton.textContent =
                    "Save Exam";

            }


            clearExamModal();


            if (examModal) {

                examModal.show();

            } else {

                console.error(
                    "❌ Exam modal was not initialized."
                );

            }

        }
    );

}

// ==========================================
// ADD SEMESTER BUTTON
// ==========================================

document
    .getElementById("addSemesterBtn")
    .addEventListener(
        "click",
        () => {

            createSemesterRow();

        }
    );


// ==========================================
// ADD SUBJECT BUTTON
// ==========================================

document
    .getElementById("addSubjectBtn")
    .addEventListener(
        "click",
        () => {

            createSubjectRow();

            refreshSubjectBatchOptions();

        }
    );


// ==========================================
// SAVE EXAM
// ==========================================

document
    .getElementById("saveExamBtn")
    .addEventListener(
        "click",
        saveExam
    );


async function saveExam() {

    const examName =
        document.getElementById(
            "examName"
        ).value.trim();


    const examDate =
        document.getElementById(
            "examDate"
        ).value;


    const session =
        document.getElementById(
            "session"
        ).value;


    const startTime =
        document.getElementById(
            "startTime"
        ).value;


    const endTime =
        document.getElementById(
            "endTime"
        ).value;


    const duration =
        document.getElementById(
            "duration"
        ).value;


    const status =
        document.getElementById(
            "examStatus"
        ).value === "true";


    const participatingSemesters =
        getParticipatingSemesters();


    // ======================================
    // VALIDATION
    // ======================================

    if (!examName) {

        Swal.fire(
            "Validation Error",
            "Please enter the exam name.",
            "warning"
        );

        return;

    }


    if (!examDate) {

        Swal.fire(
            "Validation Error",
            "Please select the exam date.",
            "warning"
        );

        return;

    }


    if (!startTime || !endTime) {

        Swal.fire(
            "Validation Error",
            "Please enter the exam start and end time.",
            "warning"
        );

        return;

    }


    if (endTime <= startTime) {

        Swal.fire(
            "Validation Error",
            "End time must be after start time.",
            "warning"
        );

        return;

    }


    if (
        participatingSemesters.length === 0
    ) {

        Swal.fire(
            "Validation Error",
            "Please select at least one batch and semester.",
            "warning"
        );

        return;

    }


    if (
        hasDuplicateParticipatingSemesters()
    ) {

        Swal.fire(
            "Duplicate Selection",
            "The same batch and semester has been selected more than once.",
            "warning"
        );

        return;

    }


    // ======================================
    // SUBJECTS
    // ======================================

    const subjects = [];


    document
        .querySelectorAll(
            ".subject-row"
        )
        .forEach(row => {

            const batch =
                row.querySelector(
                    ".subject-batch"
                )?.value;


            const semester =
                row.querySelector(
                    ".subject-semester"
                )?.value;


            const department =
                row.querySelector(
                    ".subject-department"
                )?.value;


            const subjectCode =
                row.querySelector(
                    ".subject-code"
                )?.value
                .trim();


            const subjectName =
                row.querySelector(
                    ".subject-name"
                )?.value
                .trim();


            if (
                batch ||
                semester ||
                department ||
                subjectCode ||
                subjectName
            ) {

                subjects.push({

                    batch,

                    semester:
                        Number(semester),

                    department,

                    subjectCode,

                    subjectName

                });

            }

        });


    if (subjects.length === 0) {

        Swal.fire(
            "Validation Error",
            "Please add at least one examination subject.",
            "warning"
        );

        return;

    }


    for (
        const subject of subjects
    ) {

        if (
            !subject.batch ||
            !subject.semester ||
            !subject.department ||
            !subject.subjectName
        ) {

            Swal.fire(
                "Validation Error",
                "Please complete every subject row.",
                "warning"
            );

            return;

        }

    }


    // ======================================
    // BUILD DATA
    // ======================================

    const examData = {

        examName,

        examDate,

        session,

        startTime,

        endTime,

        participatingSemesters,

        subjects,

        duration,

        status

    };


    console.log(
        "📤 Saving Exam:",
        examData
    );


    try {

        let url =
            API_URL;

        let method =
            "POST";


        if (editExamId) {

            url =
                `${API_URL}/${editExamId}`;

            method =
                "PUT";

        }


        const response =
            await fetch(
                url,
                {

                    method,

                    headers:
                        authHeaders(true),

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
                "Save failed"
            );

        }


        examModal.hide();


        Swal.fire(
            "Success",
            editExamId
                ? "Exam updated successfully."
                : "Exam added successfully.",
            "success"
        );


        await loadExams();

    }

    catch (error) {

        console.error(
            "Save Exam Error:",
            error
        );


        Swal.fire(
            "Error",
            error.message ||
                "Unable to save exam.",
            "error"
        );

    }

}


// ==========================================
// EDIT / DELETE
// ==========================================

document
    .getElementById("examTable")
    .addEventListener(
        "click",
        async e => {

            const button =
                e.target.closest(
                    "button"
                );


            if (!button) return;


            const id =
                button.dataset.id;


            if (!id) return;


            // ==================================
            // EDIT
            // ==================================

            if (
                button.classList.contains(
                    "editBtn"
                )
            ) {

                const exam =
                    exams.find(
                        item =>
                            item._id === id
                    );


                if (!exam) return;


                editExamId =
                    id;


                document.querySelector(
                    ".modal-title"
                ).innerHTML = `

                    <i class="bi bi-pencil-fill"></i>

                    Edit Exam

                `;


                document.getElementById(
                    "saveExamBtn"
                ).textContent =
                    "Update Exam";


                loadExamIntoModal(
                    exam
                );


                examModal.show();

            }


            // ==================================
            // DELETE
            // ==================================

            if (
                button.classList.contains(
                    "deleteBtn"
                )
            ) {

                const result =
                    await Swal.fire({

                        title:
                            "Delete Exam?",

                        text:
                            "This action cannot be undone.",

                        icon:
                            "warning",

                        showCancelButton:
                            true,

                        confirmButtonText:
                            "Delete"

                    });


                if (
                    !result.isConfirmed
                ) {
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
                                    authHeaders()

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Delete failed"
                        );

                    }


                    Swal.fire(
                        "Deleted",
                        "Exam deleted successfully.",
                        "success"
                    );


                    await loadExams();

                }

                catch (error) {

                    console.error(
                        error
                    );


                    Swal.fire(
                        "Error",
                        error.message ||
                            "Unable to delete exam.",
                        "error"
                    );

                }

            }

        }
    );


// ==========================================
// SEARCH
// ==========================================

document
    .getElementById("searchExam")
    .addEventListener(
        "input",
        function () {

            const keyword =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                exams.filter(exam => {

                    const examName =
                        String(
                            exam.examName || ""
                        ).toLowerCase();


                    const subjects =
                        Array.isArray(
                            exam.subjects
                        )
                            ? exam.subjects
                            : [];


                    const subjectMatch =
                        subjects.some(
                            subject => {

                                return (

                                    String(
                                        subject.subjectCode ||
                                        ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            keyword
                                        )

                                    ||

                                    String(
                                        subject.subjectName ||
                                        ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            keyword
                                        )

                                    ||

                                    String(
                                        subject.department ||
                                        ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            keyword
                                        )

                                );

                            }
                        );


                    return (
                        examName.includes(
                            keyword
                        ) ||
                        subjectMatch
                    );

                });


            renderTable(
                filtered
            );

        }
    );


// ==========================================
// EXPORT EXAMS
// ==========================================

document
    .getElementById("exportExamsBtn")
    .addEventListener(
        "click",
        () => {

            if (
                exams.length === 0
            ) {

                Swal.fire(
                    "No Data",
                    "There are no exams to export.",
                    "info"
                );

                return;

            }


            const rows = [

                [

                    "Exam Name",

                    "Batch",

                    "Semester",

                    "Department",

                    "Subject Code",

                    "Subject Name",

                    "Exam Date",

                    "Session",

                    "Start Time",

                    "End Time",

                    "Duration",

                    "Status"

                ]

            ];


            exams.forEach(
                exam => {

                    const subjects =
                        Array.isArray(
                            exam.subjects
                        )
                            ? exam.subjects
                            : [];


                    subjects.forEach(
                        subject => {

                            const batchName =
                                subject.batch?.batchName ||
                                getBatchName(
                                    subject.batch
                                );


                            rows.push([

                                exam.examName,

                                batchName,

                                subject.semester,

                                subject.department,

                                subject.subjectCode,

                                subject.subjectName,

                                exam.examDate
                                    ? exam.examDate
                                        .substring(0, 10)
                                    : "",

                                exam.session,

                                exam.startTime,

                                exam.endTime,

                                exam.duration,

                                exam.status
                                    ? "Active"
                                    : "Inactive"

                            ]);

                        }
                    );

                }
            );


            const csv =
                rows
                    .map(
                        row =>
                            row
                                .map(
                                    value =>
                                        `"${String(
                                            value ?? ""
                                        ).replace(
                                            /"/g,
                                            '""'
                                        )}"`
                                )
                                .join(",")
                    )
                    .join("\n");


            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const a =
                document.createElement(
                    "a"
                );


            a.href =
                url;


            a.download =
                "exams.csv";


            a.click();


            URL.revokeObjectURL(
                url
            );

        }
    );


// ==========================================
// CLEAR ALL EXAMS
// ==========================================

document
    .getElementById("clearExamsBtn")
    .addEventListener(
        "click",
        async () => {

            const result =
                await Swal.fire({

                    title:
                        "Delete All Exams?",

                    text:
                        "This will permanently remove every exam.",

                    icon:
                        "warning",

                    showCancelButton:
                        true,

                    confirmButtonText:
                        "Delete All"

                });


            if (
                !result.isConfirmed
            ) {
                return;
            }


            try {

                for (
                    const exam
                    of exams
                ) {

                    await fetch(
                        `${API_URL}/${exam._id}`,
                        {

                            method:
                                "DELETE",

                            headers:
                                authHeaders()

                        }
                    );

                }


                Swal.fire(
                    "Success",
                    "All exams deleted successfully.",
                    "success"
                );


                await loadExams();

            }

            catch (error) {

                console.error(
                    error
                );


                Swal.fire(
                    "Error",
                    "Unable to clear exams.",
                    "error"
                );

            }

        }
    );


// ==========================================
// INITIAL LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadBatches();

        await loadExams();

    }
);