/* =========================================================
   SMARTSEAT - STUDENTS
   MASTER STUDENT MANAGEMENT
   ========================================================= */

let students = [];
let editIndex = -1;

const API_URL = "http://localhost:5000/api/students";
const BATCH_API_URL = "http://localhost:5000/api/batches";

const token = localStorage.getItem("token");

/* =========================================================
   ELEMENTS
   ========================================================= */

const studentTable = document.getElementById("studentTable");

const studentModalElement =
    document.getElementById("studentModal");

const studentModal =
    studentModalElement
        ? new bootstrap.Modal(studentModalElement)
        : null;

const addStudentBtn =
    document.getElementById("addStudentBtn");

const saveStudentBtn =
    document.getElementById("saveStudentBtn");

const searchStudent =
    document.getElementById("searchStudent");

const departmentFilter =
document.getElementById("departmentFilter");

const batchFilter =
    document.getElementById("batchFilter");

const semesterFilter =
    document.getElementById("semesterFilter");

const excelFile =
    document.getElementById("excelFile");

const uploadExcelBtn =
    document.getElementById("uploadExcelBtn");

const downloadSampleBtn =
    document.getElementById("downloadSampleBtn");

const clearStudentsBtn =
    document.getElementById("clearStudentsBtn");

const exportBtn =
    document.getElementById("exportStudentsBtn");

const studentBatch =
    document.getElementById("studentBatch");

const studentDepartment =
    document.getElementById("department");

const assignBatchSelect =
    document.getElementById("assignBatchSelect");

const assignBatchBtn =
    document.getElementById("assignBatchBtn");

/* =========================================================
   HELPER
   ========================================================= */

function authHeaders(json = false) {

    const headers = {
        "Authorization": `Bearer ${token}`
    };

    if (json) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}


/* =========================================================
   LOAD BATCHES
   ========================================================= */

async function loadStudentBatches() {

    if (!studentBatch) {
        return;
    }

    try {

        const response = await fetch(
            BATCH_API_URL,
            {
                method: "GET",
                headers: authHeaders()
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load batches."
            );

        }


        /* ==========================================
           CLEAR EXISTING OPTIONS
        ========================================== */

        studentBatch.innerHTML = `
            <option value="">
                Select Batch
            </option>
        `;


        if (batchFilter) {

            batchFilter.innerHTML = `
                <option value="">
                    All Batches
                </option>
            `;

        }


        if (assignBatchSelect) {

            assignBatchSelect.innerHTML = `
                <option value="">
                    Select Batch
                </option>
            `;

        }


        /* ==========================================
           ADD BATCH OPTIONS
        ========================================== */

        data.batches.forEach(batch => {


            /* ==========================================
               ADD STUDENT MODAL
            ========================================== */

            const studentOption =
                document.createElement("option");

            studentOption.value =
                batch._id;

            studentOption.textContent =
                `${batch.batchName} (${batch.prefix})`;

            studentOption.dataset.prefix =
                batch.prefix;

            studentOption.value = batch._id;
            studentOption.textContent =
                 `${batch.batchName} (${batch.prefix})`;

            studentOption.dataset.prefix =
                batch.prefix;               


            /* ==========================================
               BATCH FILTER
            ========================================== */

            if (batchFilter) {

    const filterOption =
        document.createElement("option");

    filterOption.value =
        batch.batchName;

    filterOption.textContent =
        batch.batchName;

    filterOption.dataset.batchId =
        batch._id;

    filterOption.dataset.prefix =
        batch.prefix;

    batchFilter.appendChild(
        filterOption
    );

}

            /* ==========================================
               ASSIGN EXISTING STUDENTS
            ========================================== */

            if (assignBatchSelect) {

                const assignOption =
                    document.createElement("option");

                assignOption.value =
                    batch._id;

                assignOption.textContent =
                    batch.batchName;

                assignBatchSelect.appendChild(
                    assignOption
                );

            }

        });


        console.log(
            "✅ Student batches loaded:",
            data.batches
        );

    }

    catch (error) {

        console.error(
            "❌ Batch loading error:",
            error
        );

        if (
            typeof AlertManager !== "undefined"
        ) {

            AlertManager.error(
                "Batch Loading Error",
                error.message ||
                "Unable to load batches."
            );

        }

    }

}

/* =========================================================
   UPDATE SEMESTER FILTER BASED ON BATCH
   ========================================================= */

function updateSemesterFilter() {

    if (!semesterFilter) {
        return;
    }

    const selectedBatch =
        batchFilter?.value || "";

    semesterFilter.innerHTML = `
        <option value="">
            All Semesters
        </option>
    `;

    let semesters = [];

    switch (selectedBatch) {

    /* ==========================
       2024-2027
       Current: Semester 5
       Next: Semester 6
    ========================== */

    case "2024-27":
    case "2024-2027":
    case "2024–2027":

        semesters = [5, 6];

        break;


    /* ==========================
       2025-2028
       Current: Semester 3
       Next: Semester 4
    ========================== */

    case "2025-28":
    case "2025-2028":
    case "2025–2028":

        semesters = [3, 4];

        break;


    /* ==========================
       2026-2029
       Current: Semester 1
       Next: Semester 2
    ========================== */

    case "2026-29":
    case "2026-2029":
    case "2026–2029":

        semesters = [1, 2];

        break;


    /* ==========================
       ALL BATCHES
    ========================== */

    default:

        semesters = [1, 2, 3, 4, 5, 6];

}


    semesters.forEach(semester => {

        const option =
            document.createElement("option");

        option.value =
            semester;

        option.textContent =
            `${semester}${getOrdinalSuffix(semester)} Semester`;

        semesterFilter.appendChild(
            option
        );

    });

}


/* =========================================================
   ORDINAL SUFFIX
   ========================================================= */

function getOrdinalSuffix(number) {

    if (number === 1) {
        return "st";
    }

    if (number === 2) {
        return "nd";
    }

    if (number === 3) {
        return "rd";
    }

    return "th";

}

/* =========================================================
   LOAD STUDENTS FROM MONGODB
   ========================================================= */

async function loadStudents() {

    console.log(
        "🔄 Loading students from MongoDB..."
    );

    try {

        const response =
            await fetch(
                `${API_URL}?t=${Date.now()}`,
                {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        ...authHeaders(),
                        "Cache-Control":
                            "no-cache"
                    }
                }
            );

        const data =
            await response.json();

        console.log(
            "📦 Students API response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load students."
            );

        }

        students =
            Array.isArray(data.students)
                ? data.students
                : [];

        console.log(
            `👨‍🎓 Total students loaded: ${students.length}`
        );

        renderStudents();

    }
    catch (error) {

        console.error(
            "❌ Load students error:",
            error
        );

        if (typeof Swal !== "undefined") {

            Swal.fire(
                "Error",
                error.message ||
                "Unable to load students.",
                "error"
            );

        }

    }

}


/* =========================================================
   STATISTICS
   ========================================================= */

function updateStatistics(data = students) {

    const totalStudents =
        document.getElementById("totalStudents");

    const totalDepartments =
        document.getElementById("totalDepartments");

    const totalSemesters =
        document.getElementById("totalSemesters");

    const activeStudents =
        document.getElementById("activeStudents");


    const currentStudents =
        Array.isArray(data) ? data : [];


    /* ==========================
       TOTAL STUDENTS
    ========================== */

    if (totalStudents) {

        totalStudents.textContent =
            currentStudents.length;

    }


    /* ==========================
       DEPARTMENTS
    ========================== */

    const departments = [
        ...new Set(
            currentStudents
                .map(student => student.department)
                .filter(Boolean)
        )
    ];


    if (totalDepartments) {

        totalDepartments.textContent =
            departments.length;

    }


    /* ==========================
       SEMESTERS
    ========================== */

    const semesters = [
        ...new Set(
            currentStudents
                .map(student => student.semester)
                .filter(value =>
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                )
        )
    ];


    if (totalSemesters) {

        totalSemesters.textContent =
            semesters.length;

    }


    /* ==========================
       ACTIVE STUDENTS
    ========================== */

    if (activeStudents) {

        activeStudents.textContent =
            currentStudents.length;

    }

}

/* =========================================================
   SAFE VALUE
   ========================================================= */

function safe(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }

    return String(value);

}

// ==========================================
// Render Students
// ==========================================

function renderStudents(data = students) {

    const studentTable =
        document.getElementById("studentTable");

    if (!studentTable) {
        return;
    }

    studentTable.innerHTML = "";


    if (!data || data.length === 0) {

        studentTable.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="text-center">
                    No Students Found
                </td>
            </tr>
        `;

        updateStatistics(data);

        return;
    }


    data.forEach((student, index) => {

        const originalIndex =
            students.indexOf(student);

        studentTable.innerHTML += `
            <tr>

                <td class="student-sno">
                    ${index + 1}
                </td>

                <td>
                    ${student.registerNumber || "-"}
                </td>

                <td>
                    ${student.name || "-"}
                </td>

                <td>
                    ${student.department || "-"}
                </td>

                <td>
                    ${student.semester || "-"}
                </td>

                <td class="student-actions">

                    <button
                        class="btn btn-warning btn-sm"
                        onclick="editStudent(${originalIndex})"
                        title="Edit Student">

                        <i class="bi bi-pencil-fill"></i>

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteStudent(${originalIndex})"
                        title="Delete Student">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>

            </tr>
        `;

    });


    updateStatistics(data);

}

/* =========================================================
   GENERATE REGISTER NUMBER
   ========================================================= */

function generateRegisterNumber() {

    const regNoInput =
        document.getElementById("regNo");

    const preview =
        document.getElementById(
            "regNoPreview"
        );


    if (
        !studentBatch ||
        !studentDepartment ||
        !regNoInput
    ) {
        return;
    }


    const selectedOption =
        studentBatch.options[
            studentBatch.selectedIndex
        ];


    const prefix =
        selectedOption?.dataset?.prefix ||
        "";


    const department =
        studentDepartment.value;


    if (!prefix || !department) {

        regNoInput.value = "";

        if (preview) {

            preview.textContent =
                "Select batch and department";

        }

        return;
    }


    let departmentCode = "";


    switch (department) {

        case "BCA":
            departmentCode = "BCA";
            break;

        case "BSc CS":
            departmentCode = "BSC";
            break;

        case "BCom":
            departmentCode = "BCOM";
            break;

        case "BBA":
            departmentCode = "BBA";
            break;

        case "BA English":
            departmentCode = "BAE";
            break;

        case "BA Economics":
            departmentCode = "BAECO";
            break;

        default:
            departmentCode = "";

    }


    if (!departmentCode) {

        regNoInput.value = "";

        if (preview) {
            preview.textContent =
                "Invalid department";
        }

        return;
    }


    const generated =
        `${prefix}${departmentCode}001`;


    regNoInput.value =
        generated;


    if (preview) {

        preview.textContent =
            `Preview: ${generated}`;

    }

}


/* =========================================================
   ADD STUDENT MODAL
   ========================================================= */

if (addStudentBtn) {

    addStudentBtn.addEventListener(
        "click",
        () => {

            editIndex = -1;


            const regNo =
                document.getElementById(
                    "regNo"
                );

            const studentName =
                document.getElementById(
                    "studentName"
                );

            const department =
                document.getElementById(
                    "department"
                );

            const semester =
                document.getElementById(
                    "semester"
                );


            if (regNo) {
                regNo.value = "";
            }

            if (studentName) {
                studentName.value = "";
            }

            if (studentBatch) {
                studentBatch.value = "";
            }

            if (department) {
                department.value = "";
            }

            if (semester) {
                semester.value = "";
            }


            const title =
                document.querySelector(
                    ".modal-title"
                );

            if (title) {

                title.innerHTML = `
                    <i class="bi bi-person-plus-fill"></i>
                    Add Student
                `;

            }


            if (saveStudentBtn) {

                saveStudentBtn.innerHTML = `
                    <i class="bi bi-check-circle-fill"></i>
                    Save Student
                `;

            }


            if (studentModal) {
                studentModal.show();
            }

        }
    );

}


/* =========================================================
   SAVE / UPDATE STUDENT
   ========================================================= */

if (saveStudentBtn) {

    saveStudentBtn.addEventListener(
        "click",
        async () => {

            const regNo =
                document.getElementById(
                    "regNo"
                )?.value
                .trim()
                .toUpperCase();


            const name =
                document.getElementById(
                    "studentName"
                )?.value
                .trim();


            const department =
                document.getElementById(
                    "department"
                )?.value;


            const semester =
                document.getElementById(
                    "semester"
                )?.value;


            if (
                !regNo ||
                !name ||
                !department ||
                !semester
            ) {

                AlertManager.warning(
                    "Missing Details",
                    "Please fill all fields."
                );

                return;
            }


            /* ==========================================
               DUPLICATE CHECK
               ========================================== */

            const duplicate =
                students.find(
                    (student, index) => {

                        const existing =
                            safe(
                                student.registerNumber
                            )
                            .trim()
                            .toUpperCase();


                        return (
                            existing === regNo &&
                            index !== editIndex
                        );

                    }
                );


            if (duplicate) {

                AlertManager.error(
                    "Duplicate Register Number",
                    "This register number already exists."
                );

                return;
            }


            /* ==========================================
               ADD
               ========================================== */

            if (editIndex === -1) {

                try {

                    const response =
                        await fetch(
                            API_URL,
                            {
                                method: "POST",

                                headers:
                                    authHeaders(true),

                                body: JSON.stringify({

    registerNumber: regNo,

    name: name,

    department: department,

    semester: Number(semester),

    section: "A",

    batch:
        studentBatch?.value || null

})
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        throw new Error(
                            data.message ||
                            "Unable to add student."
                        );

                    }


                    ActivityManager.addActivity(
                        `Added Student : ${name}`
                    );


                    AlertManager.success(
                        "Student Added Successfully"
                    );


                    if (studentModal) {
                        studentModal.hide();
                    }


                    await loadStudents();

                }
                catch (error) {

                    console.error(
                        "Add student error:",
                        error
                    );


                    AlertManager.error(
                        "Add Student Failed",
                        error.message ||
                        "Unable to connect to server."
                    );

                }

                return;
            }


            /* ==========================================
               UPDATE
               ========================================== */

            const student =
                students[editIndex];


            if (
                !student ||
                !student._id
            ) {

                AlertManager.error(
                    "Update Failed",
                    "Student ID not found."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/${student._id}`,
                        {
                            method: "PUT",

                            headers:
                                authHeaders(true),

                            body: JSON.stringify({

    registerNumber: regNo,

    name: name,

    department: department,

    semester: Number(semester),

    section:
        student.section || "A",

    batch:
        studentBatch?.value || null

})
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to update student."
                    );

                }


                ActivityManager.addActivity(
                    `Updated Student : ${name}`
                );


                AlertManager.success(
                    "Student Updated Successfully"
                );


                if (studentModal) {
                    studentModal.hide();
                }


                editIndex = -1;


                await loadStudents();

            }
            catch (error) {

                console.error(
                    "Update student error:",
                    error
                );


                AlertManager.error(
                    "Update Failed",
                    error.message ||
                    "Unable to update student."
                );

            }

        }
    );

}


/* =========================================================
   EDIT STUDENT
   ========================================================= */

window.editStudent = function(index) {

    const student =
        students[index];


    if (!student) {

        AlertManager.error(
            "Student Not Found",
            "Unable to find selected student."
        );

        return;
    }


    editIndex = index;


    const regNo =
        document.getElementById("regNo");

    const studentName =
        document.getElementById(
            "studentName"
        );

    const department =
        document.getElementById(
            "department"
        );

    const semester =
        document.getElementById(
            "semester"
        );

    const batch =
    document.getElementById("studentBatch");


    if (regNo) {

        regNo.value =
            student.registerNumber || "";

    }


    if (studentName) {

        studentName.value =
            student.name || "";

    }


    if (department) {

        department.value =
            student.department || "";

    }


    if (semester) {

        semester.value =
            student.semester || "";

    }

    if (batch) {

    batch.value =
        student.batch?._id ||
        student.batch ||
        "";

    }


    const title =
        document.querySelector(
            ".modal-title"
        );


    if (title) {

        title.innerHTML = `
            <i class="bi bi-pencil-square"></i>
            Edit Student
        `;

    }


    if (saveStudentBtn) {

        saveStudentBtn.innerHTML = `
            <i class="bi bi-pencil-fill"></i>
            Update Student
        `;

    }


    if (studentModal) {
        studentModal.show();
    }

};


/* =========================================================
   DELETE STUDENT
   ========================================================= */

window.deleteStudent = async function(index) {

    const student =
        students[index];


    if (!student) {

        AlertManager.error(
            "Student Not Found",
            "Unable to find selected student."
        );

        return;
    }


    const result =
        await Swal.fire({

            title:
                "Delete Student?",

            text:
                `Do you want to delete ${student.name}?`,

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonColor:
                "#dc3545",

            cancelButtonColor:
                "#6c757d",

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
                `${API_URL}/${student._id}`,
                {
                    method: "DELETE",
                    headers: authHeaders()
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Unable to delete student."
            );

        }


        ActivityManager.addActivity(
            `Deleted Student : ${student.name}`
        );


        AlertManager.success(
            "Student Deleted",
            "Student deleted successfully."
        );


        await loadStudents();

    }
    catch (error) {

        console.error(
            "Delete student error:",
            error
        );


        AlertManager.error(
            "Delete Failed",
            error.message ||
            "Unable to connect to server."
        );

    }

};

/* ==========================================
   SEARCH + BATCH + SEMESTER + DEPARTMENT
========================================== */

function applyStudentFilters() {

    const searchValue =
        searchStudent?.value
            ?.trim()
            .toLowerCase() || "";


    const departmentValue =
        departmentFilter?.value
            ?.trim()
            .toLowerCase() || "";


    const batchValue =
        batchFilter?.value
            ?.trim()
            .toLowerCase() || "";


    const semesterValue =
        semesterFilter?.value
            ?.trim() || "";


    const filtered =
        students.filter(student => {


            const registerNumber =
                String(
                    student.registerNumber || ""
                )
                .trim()
                .toLowerCase();


            const name =
                String(
                    student.name || ""
                )
                .trim()
                .toLowerCase();


            const department =
                String(
                    student.department || ""
                )
                .trim()
                .toLowerCase();


            const semester =
                String(
                    student.semester ?? ""
                )
                .trim();


            const batch =
                String(
                    student.batch?.batchName ||
                    student.batchName ||
                    ""
                )
                .trim()
                .toLowerCase();


            /* ==========================
               SEARCH MATCH
            ========================== */

            const matchesSearch =

                searchValue === "" ||

                registerNumber.includes(
                    searchValue
                ) ||

                name.includes(
                    searchValue
                ) ||

                department.includes(
                    searchValue
                ) ||

                semester.includes(
                    searchValue
                );


            /* ==========================
               DEPARTMENT MATCH
            ========================== */

            const matchesDepartment =

                departmentValue === "" ||

                department ===
                    departmentValue;


            /* ==========================
               BATCH MATCH
            ========================== */

            const matchesBatch =

                batchValue === "" ||

                batch === batchValue;


            /* ==========================
               SEMESTER MATCH
            ========================== */

            const matchesSemester =

                semesterValue === "" ||

                semester === semesterValue;


            return (

                matchesSearch &&

                matchesDepartment &&

                matchesBatch &&

                matchesSemester

            );

        });


    renderStudents(filtered);

}
/* ==========================================
   SEARCH EVENT
========================================== */

if(searchStudent){

    searchStudent.addEventListener(
        "input",
        applyStudentFilters
    );

}

/* ==========================================
   DEPARTMENT FILTER EVENT
========================================== */

if(departmentFilter){

    departmentFilter.addEventListener(
        "change",
        applyStudentFilters
    );

}
/* ==========================================
   BATCH FILTER EVENT
========================================== */

if (batchFilter) {

    batchFilter.addEventListener(
        "change",
        () => {

            updateSemesterFilter();

            applyStudentFilters();

        }
    );

}


/* ==========================================
   SEMESTER FILTER EVENT
========================================== */

if (semesterFilter) {

    semesterFilter.addEventListener(
        "change",
        applyStudentFilters
    );

}
/* =========================================================
   SMART EXCEL IMPORT
   WITH LIVE PROGRESS
   ========================================================= */

if (uploadExcelBtn && excelFile) {

    uploadExcelBtn.addEventListener(
        "click",
        async () => {

            if (!excelFile.files.length) {

                AlertManager.warning(
                    "No File Selected",
                    "Please choose an Excel file."
                );

                return;
            }

            const file = excelFile.files[0];

            try {

                console.log(
                    "📂 Reading Excel:",
                    file.name
                );

                const buffer =
                    await file.arrayBuffer();

                const workbook =
                    XLSX.read(
                        buffer,
                        {
                            type: "array"
                        }
                    );

                console.log(
                    "📚 Sheets found:",
                    workbook.SheetNames
                );

                let imported = 0;
                let skipped = 0;
                let failed = 0;

                let skipReasons = {
                    missingRegister: 0,
                    missingName: 0,
                    invalidSemester: 0,
                    alreadyExists: 0,
                    duplicateInExcel: 0
                };

                let importedStudents = [];

                /* =================================================
                   FIRST PASS
                   FIND TOTAL STUDENT ROWS
                   ================================================= */

                let totalRows = 0;

                for (
                    const sheetName of workbook.SheetNames
                ) {

                    const worksheet =
                        workbook.Sheets[sheetName];

                    const rows =
                        XLSX.utils.sheet_to_json(
                            worksheet,
                            {
                                header: 1,
                                defval: "",
                                raw: false
                            }
                        );

                    if (!rows.length) {
                        continue;
                    }

                    let headerRowIndex = -1;

                    for (
                        let i = 0;
                        i < rows.length;
                        i++
                    ) {

                        const row =
                            rows[i].map(
                                cell =>
                                    String(cell)
                                        .trim()
                                        .toLowerCase()
                            );

                        const hasRegister =
                            row.some(
                                cell =>
                                    cell === "register no" ||
                                    cell === "register number" ||
                                    cell === "reg no"
                            );

                        const hasName =
                            row.some(
                                cell =>
                                    cell === "name" ||
                                    cell === "student name"
                            );

                        if (
                            hasRegister &&
                            hasName
                        ) {

                            headerRowIndex = i;

                            break;
                        }
                    }

                    if (
                        headerRowIndex === -1
                    ) {
                        continue;
                    }

                    /*
                     * Count only non-empty rows
                     * after the header.
                     */
                    for (
                        let i =
                            headerRowIndex + 1;
                        i < rows.length;
                        i++
                    ) {

                        const row = rows[i];

                        const hasData =
                            row.some(
                                cell =>
                                    String(cell)
                                        .trim() !== ""
                            );

                        if (hasData) {
                            totalRows++;
                        }
                    }
                }

                console.log(
                    `📊 Total rows to process: ${totalRows}`
                );

                /* =================================================
                   SHOW IMPORT PROGRESS
                   ================================================= */

                Swal.fire({
                    title: "Importing Students...",
                    html: `
                        <div style="
                            font-size:16px;
                            margin-bottom:15px;
                        ">
                            Please wait while students are being imported.
                        </div>

                        <div style="
                            width:100%;
                            height:12px;
                            background:#e9ecef;
                            border-radius:10px;
                            overflow:hidden;
                            margin-bottom:15px;
                        ">
                            <div id="importProgressBar"
                                style="
                                    width:0%;
                                    height:100%;
                                    background:#198754;
                                    transition:width 0.25s ease;
                                ">
                            </div>
                        </div>

                        <div id="importProgressText"
                            style="
                                font-size:17px;
                                font-weight:600;
                            ">
                            Processing 0 of ${totalRows} students...
                        </div>

                        <div id="importProgressStats"
                            style="
                                margin-top:10px;
                                font-size:14px;
                            ">
                            ✅ Imported: 0
                            &nbsp;&nbsp;
                            ⏭️ Skipped: 0
                            &nbsp;&nbsp;
                            ❌ Failed: 0
                        </div>
                    `,

                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,

                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                /* =================================================
                   PROGRESS UPDATE FUNCTION
                   ================================================= */

                let processedRows = 0;

                function updateImportProgress() {

                    processedRows++;

                    const percentage =
                        totalRows > 0
                            ? Math.round(
                                (processedRows / totalRows) * 100
                            )
                            : 100;

                    const progressBar =
                        document.getElementById(
                            "importProgressBar"
                        );

                    const progressText =
                        document.getElementById(
                            "importProgressText"
                        );

                    const progressStats =
                        document.getElementById(
                            "importProgressStats"
                        );

                    if (progressBar) {

                        progressBar.style.width =
                            `${percentage}%`;
                    }

                    if (progressText) {

                        progressText.innerHTML =
                            `
                            Processing
                            <strong>${processedRows}</strong>
                            of
                            <strong>${totalRows}</strong>
                            students...
                            `;
                    }

                    if (progressStats) {

                        progressStats.innerHTML =
                            `
                            ✅ Imported: ${imported}
                            &nbsp;&nbsp;
                            ⏭️ Skipped: ${skipped}
                            &nbsp;&nbsp;
                            ❌ Failed: ${failed}
                            `;
                    }

                    /*
                     * Force browser to repaint the popup
                     * before continuing with the next request.
                     */
                    return new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                10
                            )
                    );
                }

                /* =================================================
                   PROCESS EVERY SHEET
                   ================================================= */

                for (
                    const sheetName of workbook.SheetNames
                ) {

                    console.log(
                        `📄 Processing sheet: ${sheetName}`
                    );

                    const worksheet =
                        workbook.Sheets[
                            sheetName
                        ];

                    const rows =
                        XLSX.utils.sheet_to_json(
                            worksheet,
                            {
                                header: 1,
                                defval: "",
                                raw: false
                            }
                        );

                    if (!rows.length) {
                        continue;
                    }

                    /* =================================================
                       FIND HEADER ROW
                       ================================================= */

                    let headerRowIndex = -1;

                    for (
                        let i = 0;
                        i < rows.length;
                        i++
                    ) {

                        const row =
                            rows[i].map(
                                cell =>
                                    String(cell)
                                        .trim()
                                        .toLowerCase()
                            );

                        const hasRegister =
                            row.some(
                                cell =>
                                    cell === "register no" ||
                                    cell === "register number" ||
                                    cell === "reg no"
                            );

                        const hasName =
                            row.some(
                                cell =>
                                    cell === "name" ||
                                    cell === "student name"
                            );

                        if (
                            hasRegister &&
                            hasName
                        ) {

                            headerRowIndex = i;

                            break;
                        }
                    }

                    if (
                        headerRowIndex === -1
                    ) {

                        console.warn(
                            `⚠️ Header not found in ${sheetName}`
                        );

                        continue;
                    }

                    console.log(
                        `✅ Header found at row ${headerRowIndex + 1}`
                    );

                    const headers =
                        rows[
                            headerRowIndex
                        ].map(
                            cell =>
                                String(cell)
                                    .trim()
                                    .toLowerCase()
                        );

                    /* =================================================
                       FIND COLUMN INDEXES
                       ================================================= */

                    let registerIndex =
                        headers.findIndex(
                            header =>
                                header === "register no" ||
                                header === "register number" ||
                                header === "reg no"
                        );

                    let nameIndex =
                        headers.findIndex(
                            header =>
                                header === "name" ||
                                header === "student name"
                        );

                    let departmentIndex =
                        headers.findIndex(
                            header =>
                                header === "department" ||
                                header === "dept"
                        );

                    let semesterIndex =
                        headers.findIndex(
                            header =>
                                header === "semester" ||
                                header === "sem"
                        );

                        /* =================================================
   GET BATCH FOR EXCEL IMPORT
   ================================================= */

/*
   IMPORTANT:
   Excel import uses the MAIN STUDENT BATCH dropdown.

   studentBatch = batch selected for the students
   batchFilter  = table filtering only

   DO NOT use batchFilter here.
*/

const selectedBatchOption =
    studentBatch?.options[
        studentBatch.selectedIndex
    ];

const selectedBatchId =
    selectedBatchOption?.value || "";

const prefix =
    selectedBatchOption
        ?.dataset
        ?.prefix
        ?.trim()
        .toUpperCase()
        .replace(/\s+/g, "") || "";


/* =================================================
   VALIDATE BATCH
   ================================================= */

if (!selectedBatchId) {

    console.error(
        "❌ No batch selected for Excel import."
    );

    throw new Error(
        "Please select the correct batch in the Student Batch dropdown before importing."
    );
}


if (!prefix) {

    console.error(
        "❌ Batch prefix not found."
    );

    throw new Error(
        "The selected batch does not have a valid register prefix."
    );
}


console.log(
    "================================"
);

console.log(
    "📚 Import Batch:",
    selectedBatchOption?.textContent
);

console.log(
    "🆔 Batch ID:",
    selectedBatchId
);

console.log(
    "🔢 Prefix:",
    prefix
);

console.log(
    "================================"
);

console.log(
    "================================"
);

console.log(
    "📚 Import Batch:",
    selectedBatchOption?.textContent
);

console.log(
    "🆔 Batch ID:",
    selectedBatchId
);

console.log(
    "🔢 Prefix:",
    prefix
);

console.log(
    "================================"
);

                    
                    /* =================================================
                       PROCESS STUDENT ROWS
                       ================================================= */

                    for (
                        let i =
                            headerRowIndex + 1;
                        i < rows.length;
                        i++
                    ) {

                        const row = rows[i];

                        /*
                         * Ignore completely empty rows.
                         */
                        const hasData =
                            row.some(
                                cell =>
                                    String(cell)
                                        .trim() !== ""
                            );

                        if (!hasData) {
                            continue;
                        }

                        const rawRegister =
                            registerIndex >= 0
                                ? String(
                                    row[
                                        registerIndex
                                    ] || ""
                                ).trim()
                                : "";

                        const name =
                            nameIndex >= 0
                                ? String(
                                    row[
                                        nameIndex
                                    ] || ""
                                ).trim()
                                : "";

                        let department =
                            departmentIndex >= 0
                                ? String(
                                    row[
                                        departmentIndex
                                    ] || ""
                                ).trim()
                                : "";

                        const semester =
                            semesterIndex >= 0
                                ? String(
                                    row[
                                        semesterIndex
                                    ] || ""
                                ).trim()
                                : "";

                        /* =================================================
                           VALIDATE REGISTER + NAME
                           ================================================= */

                        if (!rawRegister || !name) {

    if (!rawRegister) {
        skipReasons.missingRegister++;
    }

    if (!name) {
        skipReasons.missingName++;
    }

    console.warn(
        "⚠️ Skipping invalid row:",
        row
    );

    skipped++;

    await updateImportProgress();

    continue;
}
                        /* =================================================
   BUILD REGISTER NUMBER
   ================================================= */

let registerNumber =
    rawRegister
        .toUpperCase()
        .replace(
            /\s+/g,
            ""
        );


/*
   Remove any existing MDxx prefix from Excel.

   Example:

   Excel:
   MD24CCAR001

   Selected batch:
   MD25

   Result:
   MD25CCAR001

   This prevents the old MD24 prefix from
   contaminating the 2025-2028 batch.
*/

registerNumber =
    registerNumber.replace(
        /^MD\d{2}/,
        ""
    );


/*
   Add the prefix belonging to the
   selected batch.
*/

registerNumber =
    prefix +
    registerNumber;


console.log(
    `🔢 Register: ${rawRegister} → ${registerNumber}`
);

                        /* =================================================
                           DEPARTMENT FALLBACK
                           ================================================= */

                        if (!department) {

                            department =
                                sheetName
                                    .trim()
                                    .toUpperCase();
                        }

                        department =
                            department.trim();

                        /* =================================================
                           NORMALIZE SEMESTER
                           ================================================= */

                        const semesterNumber =
                            Number(semester);

                        if (
    !semester ||
    Number.isNaN(semesterNumber)
) {

    console.warn(
        "⚠️ Invalid semester:",
        registerNumber,
        semester
    );

    skipReasons.invalidSemester++;

    skipped++;

    await updateImportProgress();

    continue;
}

                        /* =================================================
                           CHECK EXISTING STUDENTS
                           ================================================= */

                        const alreadyExists =
                            students.some(
                                student =>
                                    String(
                                        student.registerNumber ||
                                        ""
                                    )
                                        .trim()
                                        .toUpperCase()
                                    ===
                                    registerNumber
                            );

                        if (alreadyExists) {

    console.log(
        `⏭️ Already exists: ${registerNumber}`
    );

    skipReasons.alreadyExists++;

    skipped++;

    await updateImportProgress();

    continue;
}
                        /* =================================================
                           CHECK DUPLICATE IN CURRENT EXCEL
                           ================================================= */

                        const alreadyImported =
                            importedStudents.some(
                                student =>
                                    student.registerNumber
                                    ===
                                    registerNumber
                            );

                        if (alreadyImported) {

    console.log(
        `⏭️ Duplicate in Excel: ${registerNumber}`
    );

    skipReasons.duplicateInExcel++;

    skipped++;

    await updateImportProgress();

    continue;
}

                        /* =================================================
                           CREATE STUDENT
                           ================================================= */

                        const studentData = {
                            registerNumber: registerNumber,
                            name: name,
                            department: department,
                            semester: semesterNumber,
                            section: "A",
                            batch: selectedBatchId
                        };

                        console.log(
                            "👨‍🎓 Importing:",
                            studentData
                        );

                        /* =================================================
                           SEND TO MONGODB
                           ================================================= */

                        try {

                            const response =
                                await fetch(
                                    API_URL,
                                    {
                                        method: "POST",

                                        headers:
                                            authHeaders(
                                                true
                                            ),

                                        body:
                                            JSON.stringify(
                                                studentData
                                            )
                                    }
                                );

                            const result =
                                await response.json();

                            if (
                                response.ok &&
                                result.success
                            ) {

                                imported++;

                                importedStudents.push(
                                    {
                                        registerNumber:
                                            registerNumber
                                    }
                                );

                                console.log(
                                    `✅ Imported: ${registerNumber}`
                                );

                            }

                            else if (
    response.status === 400
) {

                                skipped++;

                                console.log(
                                    `⏭️ Duplicate: ${registerNumber}`
                                );

                            }

                            else {

                                failed++;

                                console.error(
                                    `❌ Failed: ${registerNumber}`,
                                    result
                                );
                            }

                        }
                        catch (error) {

                            failed++;

                            console.error(
                                `❌ Request failed: ${registerNumber}`,
                                error
                            );
                        }

                        /*
                         * Update progress AFTER
                         * this student has finished.
                         */
                        await updateImportProgress();
                    }
                }

                /* =================================================
                   RELOAD DATABASE
                   ================================================= */

                await loadStudents();

                /* =================================================
                   ACTIVITY
                   ================================================= */

                if (imported > 0) {

                    ActivityManager.addActivity(
                        `Imported ${imported} Students`
                    );
                }

                /* =================================================
                   CLEAR FILE
                   ================================================= */

                excelFile.value = "";

                /* =================================================
                   FINAL RESULT
                   ================================================= */

                console.log(
                    "================================"
                );

                console.log(
                    "📊 EXCEL IMPORT COMPLETE"
                );

                console.log(
                    `✅ Imported: ${imported}`
                );

                console.log(
                    `⏭️ Skipped: ${skipped}`
                );

                console.log(
                    `❌ Failed: ${failed}`
                );

                console.log(
                    "================================"
                );

                console.log(
    "📋 SKIP REASONS:",
    skipReasons
);

                await Swal.fire({

                    title:
                        "Import Complete",

                    html: `
                        <div style="
                            font-size:18px;
                            margin-bottom:15px;
                        ">
                            Student import finished successfully.
                        </div>

                        <div style="
                            font-size:16px;
                            line-height:2;
                        ">
                            ✅ Imported:
                            <strong>${imported}</strong>
                            <br>

                            ⏭️ Skipped:
                            <strong>${skipped}</strong>
                            <br>

                            ❌ Failed:
                            <strong>${failed}</strong>
                        </div>
                    `,

                    icon:
                        failed > 0
                            ? "warning"
                            : "success",

                    confirmButtonText:
                        "OK"
                });

            }
            catch (error) {

                console.error(
                    "❌ Excel import error:",
                    error
                );

                await loadStudents();

                AlertManager.error(
                    "Import Failed",
                    error.message ||
                    "Unable to process Excel file."
                );
            }
        }
    );
}

/* =========================================================
   DOWNLOAD SAMPLE EXCEL
   ========================================================= */

if (downloadSampleBtn) {

    downloadSampleBtn.addEventListener(
        "click",
        () => {

            const sample = [

                {
                    "Register No":
                        "MD24BCAR001",

                    "Name":
                        "Ameen",

                    "Department":
                        "BCA",

                    "Semester":
                        "5"
                },

                {
                    "Register No":
                        "MD24BCAR002",

                    "Name":
                        "Asna",

                    "Department":
                        "BCA",

                    "Semester":
                        "5"
                }

            ];


            const worksheet =
                XLSX.utils.json_to_sheet(
                    sample
                );


            const workbook =
                XLSX.utils.book_new();


            XLSX.utils.book_append_sheet(
                workbook,
                worksheet,
                "Students"
            );


            XLSX.writeFile(
                workbook,
                "Sample_Students.xlsx"
            );

        }
    );

}


/* =========================================================
   EXPORT STUDENTS
   ========================================================= */

function exportStudents() {

    if (!students.length) {

        AlertManager.warning(
            "No Students",
            "Student list is empty."
        );

        return;
    }


    const exportData =
        students.map(
            student => ({

                "Register No":
                    student.registerNumber,

                "Name":
                    student.name,

                "Department":
                    student.department,

                "Semester":
                    student.semester,

                "Section":
                    student.section || "A"

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
        "Students"
    );


    XLSX.writeFile(
        workbook,
        "Students_List.xlsx"
    );


    ActivityManager.addActivity(
        "Exported Student List"
    );


    AlertManager.success(
        "Export Successful",
        "Student list downloaded."
    );

}


if (exportBtn) {

    exportBtn.addEventListener(
        "click",
        exportStudents
    );

}

/* ==========================
   Clear All Students
========================== */

clearStudentsBtn.addEventListener("click", async () => {

    // Make sure we have the latest students
    await loadStudents();

    if (students.length === 0) {
        AlertManager.warning(
            "No Students",
            "There are no students to delete."
        );
        return;
    }

    const totalStudents = students.length;

    const result = await Swal.fire({
        title: "Clear All Students?",
        html: `
            <strong>${totalStudents} students</strong> will be permanently deleted
            from the database.<br><br>
            <span style="color:#dc3545;">
                This action cannot be undone.
            </span>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, Delete All",
        cancelButtonText: "Cancel"
    });

    if (!result.isConfirmed) {
        return;
    }

    // Show loading popup
    Swal.fire({
        title: "Deleting Students...",
        html: `
            Please wait.<br>
            Deleting <strong>${totalStudents}</strong> students...
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    try {

        let deleted = 0;
        let failed = 0;

        /*
         * Delete students in small batches.
         * This avoids sending hundreds of requests
         * at exactly the same time.
         */

        const batchSize = 20;

        for (let i = 0; i < students.length; i += batchSize) {

            const batch = students.slice(i, i + batchSize);

            const results = await Promise.all(
                batch.map(async (student) => {

                    try {

                        const response = await fetch(
                            `${API_URL}/${student._id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    "Authorization": `Bearer ${token}`
                                }
                            }
                        );

                        const data = await response.json();

                        if (!response.ok || !data.success) {
                            throw new Error(
                                data.message || "Delete failed"
                            );
                        }

                        return true;

                    } catch (error) {

                        console.error(
                            "Failed to delete student:",
                            student,
                            error
                        );

                        return false;
                    }
                })
            );

            results.forEach(success => {

                if (success) {
                    deleted++;
                } else {
                    failed++;
                }

            });

            // Update loading message
            Swal.update({
                html: `
                    Deleted <strong>${deleted}</strong>
                    of <strong>${totalStudents}</strong> students...
                `
            });
        }

        // Reload actual MongoDB data
        await loadStudents();

        ActivityManager.addActivity(
            `Cleared All Students : ${deleted} deleted`
        );

        if (failed === 0) {

            await Swal.fire({
                title: "All Students Deleted",
                html: `
                    Successfully deleted
                    <strong>${deleted}</strong> students.
                `,
                icon: "success",
                confirmButtonText: "OK"
            });

        } else {

            await Swal.fire({
                title: "Clear Completed",
                html: `
                    Deleted: <strong>${deleted}</strong><br>
                    Failed: <strong>${failed}</strong>
                `,
                icon: "warning",
                confirmButtonText: "OK"
            });

        }

    } catch (error) {

        console.error(
            "Clear all students error:",
            error
        );

        await loadStudents();

        AlertManager.error(
            "Clear Failed",
            error.message ||
            "Unable to clear students."
        );
    }

});


/* =========================================================
   REGISTER NUMBER EVENTS
   ========================================================= */

if (studentBatch) {

    studentBatch.addEventListener(
        "change",
        generateRegisterNumber
    );

}


if (studentDepartment) {

    studentDepartment.addEventListener(
        "change",
        generateRegisterNumber
    );

}

/* =========================================================
   ASSIGN EXISTING STUDENTS TO BATCH
========================================================= */

if (assignBatchBtn) {

    assignBatchBtn.addEventListener(
        "click",
        async () => {

            const batchId =
                assignBatchSelect?.value || "";

            if (!batchId) {

                AlertManager.warning(
                    "Select Batch",
                    "Please select a batch first."
                );

                return;
            }


            const selectedBatch =
                assignBatchSelect.options[
                    assignBatchSelect.selectedIndex
                ];


            const batchName =
                selectedBatch?.textContent ||
                "selected batch";


            /*
             * Count students that currently
             * don't have a batch.
             */

            const unassignedStudents =
                students.filter(
                    student =>
                        !student.batch
                );


            if (unassignedStudents.length === 0) {

                AlertManager.info(
                    "No Unassigned Students",
                    "All students already have a batch assigned."
                );

                return;
            }


            /* ==========================================
               CONFIRMATION
            ========================================== */

            const result =
                await Swal.fire({

                    title:
                        "Assign Students to Batch?",

                    html: `
                        <strong>${unassignedStudents.length}</strong>
                        students currently have no batch.<br><br>

                        They will be assigned to:
                        <strong>${batchName}</strong>
                    `,

                    icon:
                        "warning",

                    showCancelButton:
                        true,

                    confirmButtonText:
                        "Yes, Assign Batch",

                    cancelButtonText:
                        "Cancel"

                });


            if (!result.isConfirmed) {

                return;

            }


            /* ==========================================
               LOADING
            ========================================== */

            Swal.fire({

                title:
                    "Assigning Batch...",

                html:
                    "Please wait while students are being updated.",

                allowOutsideClick:
                    false,

                allowEscapeKey:
                    false,

                didOpen: () => {

                    Swal.showLoading();

                }

            });


            try {

                const response =
                    await fetch(
                        `${API_URL}/assign-batch`,
                        {
                            method: "PUT",

                            headers:
                                authHeaders(true),

                            body:
                                JSON.stringify({
                                    batchId
                                })
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to assign batch."
                    );

                }


                /* ==========================================
                   ACTIVITY
                ========================================== */

                ActivityManager.addActivity(
                    `Assigned ${data.studentsUpdated} Students to ${batchName}`
                );


                /* ==========================================
                   RELOAD STUDENTS
                ========================================== */

                await loadStudents();


                /* ==========================================
                   SUCCESS
                ========================================== */

                await Swal.fire({

                    title:
                        "Batch Assigned Successfully",

                    html: `
                        <strong>${data.studentsUpdated}</strong>
                        students assigned to
                        <strong>${batchName}</strong>.
                    `,

                    icon:
                        "success",

                    confirmButtonText:
                        "OK"

                });


                /*
                 * Reset dropdown after successful
                 * assignment.
                 */

                assignBatchSelect.value = "";

            }

            catch (error) {

                console.error(
                    "Assign batch error:",
                    error
                );


                AlertManager.error(
                    "Batch Assignment Failed",
                    error.message ||
                    "Unable to assign students to batch."
                );

            }

        }
    );

}

/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "🚀 SmartSeat Students Module Starting..."
        );


        await loadStudentBatches();

        await loadStudents();


        console.log(
            "✅ SmartSeat Students Module Ready"
        );

    }
);