// ==========================================
// SmartSeat
// Nominal Roll Manager
// ==========================================

console.log("Nominal Roll JS Loaded");

const API_URL = "http://localhost:5000/api/exams";

let rolls = [];
let currentStudents = [];
let currentExam = "";
let currentExamName = "";
let currentExamData = null;


// ==========================================
// DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Nominal Roll Page Loaded");

    loadRolls();
    loadExams();

    const examSelect = document.getElementById("examSelect");
    const importBtn = document.getElementById("importBtn");
    const searchStudent = document.getElementById("searchStudent");
    const exportExcelBtn = document.getElementById("exportExcelBtn");
    const clearRollBtn = document.getElementById("clearRollBtn");
    const downloadSampleBtn = document.getElementById("downloadSampleBtn");
    const uploadExcelBtn = document.getElementById("uploadExcelBtn");
    const excelFiles = document.getElementById("excelFiles");


    // ======================================
    // EXAM SELECT
    // ======================================

    examSelect.addEventListener("change", () => {

        currentExam = examSelect.value;

        const selectedOption =
            examSelect.options[examSelect.selectedIndex];

        currentExamName =
            selectedOption && examSelect.value
                ? selectedOption.textContent.trim()
                : "";

        // Find selected exam data
        if (currentExam) {

            currentExamData =
                window.smartSeatExams?.find(
                    exam => String(exam._id) === String(currentExam)
                ) || null;

        } else {

            currentExamData = null;

        }


        console.log("Exam Selected:", {
            id: currentExam,
            name: currentExamName,
            data: currentExamData
        });


        // Find nominal roll
        const foundRoll =
            rolls.find(
                roll =>
                    String(roll.examId) ===
                    String(currentExam)
            );


        if (foundRoll) {

            currentStudents =
                Array.isArray(foundRoll.students)
                    ? [...foundRoll.students]
                    : [];

        } else {

            currentStudents = [];

        }


        renderStudents();

    });


    // ======================================
    // IMPORT
    // ======================================

    importBtn.addEventListener(
        "click",
        importExcelFiles
    );


    // ======================================
    // SEARCH
    // ======================================

    searchStudent.addEventListener(
        "input",
        searchStudents
    );


    // ======================================
    // EXPORT
    // ======================================

    exportExcelBtn.addEventListener(
        "click",
        exportExcel
    );


    // ======================================
    // CLEAR
    // ======================================

    clearRollBtn.addEventListener(
        "click",
        clearCurrentRoll
    );


    // ======================================
    // SAMPLE
    // ======================================

    downloadSampleBtn.addEventListener(
        "click",
        downloadSample
    );


    // ======================================
    // UPLOAD BUTTON
    // ======================================

    uploadExcelBtn.addEventListener(
        "click",
        () => {

            excelFiles.click();

        }
    );

});


// ==========================================
// GET TOKEN
// ==========================================

function getToken() {

    return localStorage.getItem("token");

}


// ==========================================
// LOAD EXAMS
// ==========================================

async function loadExams() {

    const examSelect =
        document.getElementById("examSelect");


    if (!examSelect) {

        console.error("examSelect not found");

        return;

    }


    try {

        const token = getToken();


        const response =
            await fetch(API_URL, {

                method: "GET",

                headers: {

                    "Content-Type":
                        "application/json",

                    ...(token
                        ? {
                            Authorization:
                                `Bearer ${token}`
                        }
                        : {})

                }

            });


        const data =
            await response.json();


        console.log(
            "Exams API Response:",
            response.status,
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                `Failed to load exams: ${response.status}`
            );

        }


        let exams = [];


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


        // Store globally
        window.smartSeatExams = exams;


        populateExamSelect(exams);


        console.log(
            `${exams.length} examinations loaded.`
        );

    }

    catch (error) {

        console.error(
            "Load exams error:",
            error
        );


        if (
            typeof AlertManager !==
            "undefined"
        ) {

            AlertManager.error(
                "Unable to Load Exams",
                error.message ||
                "Could not load examinations."
            );

        }

        else {

            Swal.fire(
                "Error",
                "Could not load examinations.",
                "error"
            );

        }

    }

}


// ==========================================
// POPULATE EXAM DROPDOWN
// ==========================================

function populateExamSelect(exams) {

    const examSelect =
        document.getElementById("examSelect");


    examSelect.innerHTML = `

        <option value="">
            Choose Examination
        </option>

    `;


    exams.forEach(exam => {

        const option =
            document.createElement("option");


        option.value =
            exam._id;


        option.textContent =
            `${exam.examName || "Unnamed Exam"} - Semester ${exam.semester || "-"}`;


        examSelect.appendChild(option);

    });


    console.log(
        "Exam dropdown populated."
    );

}


// ==========================================
// LOAD SAVED ROLLS
// ==========================================

function loadRolls() {

    try {

        rolls =
            JSON.parse(
                localStorage.getItem(
                    "nominalRolls"
                )
            ) || [];


        if (!Array.isArray(rolls)) {

            rolls = [];

        }

    }

    catch (error) {

        console.error(
            "Unable to load nominal rolls:",
            error
        );

        rolls = [];

    }


    updateFileCount();

}


// ==========================================
// UPDATE FILE COUNT
// ==========================================

function updateFileCount() {

    const totalFiles =
        document.getElementById("totalFiles");


    if (!totalFiles) return;


    totalFiles.textContent =
        rolls.length;

}


// ==========================================
// RENDER STUDENTS
// ==========================================

function renderStudents(
    data = currentStudents
) {

    const studentTable =
        document.getElementById(
            "studentTable"
        );


    if (!studentTable) return;


    studentTable.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center py-4">

                    <i class="bi bi-people fs-3 d-block mb-2"></i>

                    No Students Imported

                </td>

            </tr>

        `;


        updateStatistics();

        return;

    }


    data.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(student.regNo || "-")}
                </strong>
            </td>

            <td>
                ${escapeHTML(student.name || "-")}
            </td>

            <td>
                ${escapeHTML(student.department || "-")}
            </td>

            <td>
                ${escapeHTML(student.semester || "-")}
            </td>

            <td>
                ${escapeHTML(currentExamName || "-")}
            </td>

            <td>

                <button
                    class="btn btn-sm btn-danger delete-student-btn"
                    data-reg="${escapeHTML(student.regNo || "")}">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        `;


        studentTable.appendChild(row);

    });


    // Attach delete events
    document
        .querySelectorAll(".delete-student-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteStudent(
                        button.dataset.reg
                    );

                }
            );

        });


    updateStatistics();

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

    const total =
        currentStudents.length;


    const departments =
        new Set(

            currentStudents
                .map(
                    student =>
                        String(
                            student.department || ""
                        ).trim()
                )
                .filter(Boolean)

        );


    const semesters =
        new Set(

            currentStudents
                .map(
                    student =>
                        String(
                            student.semester || ""
                        ).trim()
                )
                .filter(Boolean)

        );


    const totalStudents =
        document.getElementById(
            "totalStudents"
        );

    const totalDepartments =
        document.getElementById(
            "totalDepartments"
        );

    const totalSemesters =
        document.getElementById(
            "totalSemesters"
        );

    const summaryStudents =
        document.getElementById(
            "summaryStudents"
        );

    const summaryDepartments =
        document.getElementById(
            "summaryDepartments"
        );

    const summarySemesters =
        document.getElementById(
            "summarySemesters"
        );

    const summaryExam =
        document.getElementById(
            "summaryExam"
        );


    if (totalStudents)
        totalStudents.textContent = total;


    if (totalDepartments)
        totalDepartments.textContent =
            departments.size;


    if (totalSemesters)
        totalSemesters.textContent =
            semesters.size;


    if (summaryStudents)
        summaryStudents.textContent =
            total;


    if (summaryDepartments)
        summaryDepartments.textContent =
            departments.size;


    if (summarySemesters)
        summarySemesters.textContent =
            semesters.size;


    if (summaryExam)
        summaryExam.textContent =
            currentExamName || "-";

}


// ==========================================
// IMPORT EXCEL FILES
// ==========================================

async function importExcelFiles() {

    const examSelect =
        document.getElementById(
            "examSelect"
        );


    const excelFiles =
        document.getElementById(
            "excelFiles"
        );


    // ======================================
    // CHECK EXAM
    // ======================================

    if (!examSelect.value) {

        showWarning(
            "Select Examination",
            "Please choose an examination first."
        );

        return;

    }


    // ======================================
    // CHECK FILE
    // ======================================

    if (
        !excelFiles.files ||
        excelFiles.files.length === 0
    ) {

        showWarning(
            "No Files",
            "Please choose one or more Excel files."
        );

        return;

    }


    let importedCount = 0;
    let duplicateCount = 0;


    try {

        // ==================================
        // READ ALL FILES
        // ==================================

        for (
            const file of excelFiles.files
        ) {

            console.log(
                "Reading:",
                file.name
            );


            const students =
                await readExcelFile(file);


            students.forEach(student => {

                if (!student.regNo) {

                    return;

                }


                const normalizedReg =
                    student.regNo
                        .toLowerCase()
                        .trim();


                const exists =
                    currentStudents.some(
                        existing =>
                            String(
                                existing.regNo || ""
                            )
                            .toLowerCase()
                            .trim() ===
                            normalizedReg
                    );


                if (exists) {

                    duplicateCount++;

                    return;

                }


                currentStudents.push({

                    regNo:
                        student.regNo,

                    name:
                        student.name,

                    department:
                        student.department,

                    semester:
                        student.semester

                });


                importedCount++;

            });

        }


        // ==================================
        // SAVE
        // ==================================

        saveCurrentRoll();


        // Clear file input
        excelFiles.value = "";


        // ==================================
        // SUCCESS MESSAGE
        // ==================================

        let message =
            `${importedCount} new student(s) imported.`;


        if (duplicateCount > 0) {

            message +=
                ` ${duplicateCount} duplicate(s) skipped.`;

        }


        showSuccess(
            "Import Successful",
            message
        );

    }

    catch (error) {

        console.error(
            "Excel import error:",
            error
        );


        showError(
            "Import Failed",
            error.message ||
            "Unable to import Excel file."
        );

    }

}


// ==========================================
// SAVE CURRENT ROLL
// ==========================================

function saveCurrentRoll() {

    const examSelect =
        document.getElementById(
            "examSelect"
        );


    const examId =
        examSelect.value;


    if (!examId) {

        return;

    }


    const selectedOption =
        examSelect.options[
            examSelect.selectedIndex
        ];


    const examName =
        selectedOption
            ? selectedOption.textContent.trim()
            : "Unnamed Exam";


    const index =
        rolls.findIndex(
            roll =>
                String(roll.examId) ===
                String(examId)
        );


    const roll = {

        examId:
            examId,

        exam:
            examName,

        importedOn:
            new Date().toISOString(),

        students:
            [...currentStudents]

    };


    if (index === -1) {

        rolls.push(roll);

    }

    else {

        rolls[index] = roll;

    }


    localStorage.setItem(
        "nominalRolls",
        JSON.stringify(rolls)
    );


    updateFileCount();


    renderStudents();


    // ======================================
    // ACTIVITY
    // ======================================

    if (
        typeof ActivityManager !==
        "undefined"
    ) {

        ActivityManager.addActivity(
            `Nominal Roll Updated : ${examName}`
        );

    }

}


// ==========================================
// READ EXCEL FILE
// ==========================================

function readExcelFile(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    try {

                        const workbook =
                            XLSX.read(
                                new Uint8Array(
                                    event.target.result
                                ),
                                {
                                    type: "array"
                                }
                            );


                        if (
                            !workbook.SheetNames ||
                            workbook.SheetNames.length === 0
                        ) {

                            throw new Error(
                                "Excel file contains no worksheets."
                            );

                        }


                        const sheet =
                            workbook.Sheets[
                                workbook.SheetNames[0]
                            ];


                        const rows =
                            XLSX.utils.sheet_to_json(
                                sheet,
                                {
                                    defval: ""
                                }
                            );


                        if (
                            !rows ||
                            rows.length === 0
                        ) {

                            throw new Error(
                                `No student data found in ${file.name}.`
                            );

                        }


                        const students =
                            rows.map(row => {

                                return {

                                    regNo:
    getExcelValue(
        row,
        [
            "Register No",
            "Register No.",
            "Reg No",
            "Reg No.",
            "Register Number",
            "Register Number.",
            "RegisterNo",
            "RegNo",
            "Register",
            "REG.NO",
            "REGISTER NO",
            "Register Name"
        ]
    ),

                                    name:
                                        getExcelValue(
                                            row,
                                            [
                                                "Student Name",
                                                "Name",
                                                "StudentName"
                                            ]
                                        ),

                                    department:
                                        getExcelValue(
                                            row,
                                            [
                                                "Department",
                                                "Dept"
                                            ]
                                        ),

                                    semester:
                                        getExcelValue(
                                            row,
                                            [
                                                "Semester",
                                                "Sem"
                                            ]
                                        )

                                };

                            });


                        resolve(students);

                    }

                    catch (error) {

                        reject(error);

                    }

                };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            `Unable to read ${file.name}.`
                        )
                    );

                };


            reader.readAsArrayBuffer(file);

        }
    );

}


// ==========================================
// GET EXCEL VALUE
// ==========================================

function getExcelValue(
    row,
    possibleNames
) {

    for (
        const name of possibleNames
    ) {

        if (
            row[name] !== undefined &&
            row[name] !== null &&
            String(row[name]).trim() !== ""
        ) {

            return String(
                row[name]
            ).trim();

        }

    }


    // Case-insensitive fallback
    const keys =
        Object.keys(row);


    for (
        const wanted of possibleNames
    ) {

        const found =
            keys.find(
                key =>
                    key
                        .toLowerCase()
                        .replace(/\s/g, "") ===
                    wanted
                        .toLowerCase()
                        .replace(/\s/g, "")
            );


        if (found) {

            return String(
                row[found]
            ).trim();

        }

    }


    return "";

}


// ==========================================
// SEARCH STUDENTS
// ==========================================

function searchStudents() {

    const keyword =
        document
            .getElementById(
                "searchStudent"
            )
            .value
            .toLowerCase()
            .trim();


    if (!keyword) {

        renderStudents();

        return;

    }


    const filtered =
        currentStudents.filter(
            student => {

                return (

                    String(
                        student.regNo || ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(
                        student.name || ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(
                        student.department || ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    String(
                        student.semester || ""
                    )
                    .toLowerCase()
                    .includes(keyword)

                );

            }
        );


    renderStudents(filtered);

}


// ==========================================
// DELETE STUDENT
// ==========================================

async function deleteStudent(regNo) {

    const result =
        await Swal.fire({

            title:
                "Delete Student?",

            text:
                "This student will be removed from this nominal roll.",

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Delete",

            cancelButtonText:
                "Cancel",

            confirmButtonColor:
                "#EF4444"

        });


    if (
        !result.isConfirmed
    ) {

        return;

    }


    currentStudents =
        currentStudents.filter(
            student =>
                String(
                    student.regNo
                ) !==
                String(regNo)
        );


    saveCurrentRoll();


    showSuccess(
        "Deleted",
        "Student removed from nominal roll."
    );

}


// ==========================================
// CLEAR CURRENT ROLL
// ==========================================

async function clearCurrentRoll() {

    if (!currentExam) {

        showWarning(
            "Select Examination",
            "Please select an examination first."
        );

        return;

    }


    const result =
        await Swal.fire({

            title:
                "Clear Nominal Roll?",

            text:
                `All students for ${currentExamName} will be removed.`,

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Clear Roll",

            cancelButtonText:
                "Cancel",

            confirmButtonColor:
                "#EF4444"

        });


    if (
        !result.isConfirmed
    ) {

        return;

    }


    rolls =
        rolls.filter(
            roll =>
                String(roll.examId) !==
                String(currentExam)
        );


    currentStudents = [];


    localStorage.setItem(
        "nominalRolls",
        JSON.stringify(rolls)
    );


    updateFileCount();


    renderStudents();


    showSuccess(
        "Cleared",
        "Nominal roll removed successfully."
    );


    if (
        typeof ActivityManager !==
        "undefined"
    ) {

        ActivityManager.addActivity(
            `Nominal Roll Cleared : ${currentExamName}`
        );

    }

}


// ==========================================
// EXPORT EXCEL
// ==========================================

function exportExcel() {

    if (
        currentStudents.length === 0
    ) {

        showWarning(
            "No Data",
            "There are no students to export."
        );

        return;

    }


    const rows =
        currentStudents.map(
            student => ({

                "Register No":
                    student.regNo || "",

                "Student Name":
                    student.name || "",

                "Department":
                    student.department || "",

                "Semester":
                    student.semester || "",

                "Exam":
                    currentExamName || ""

            })
        );


    const worksheet =
        XLSX.utils.json_to_sheet(
            rows
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Nominal Roll"
    );


    const safeName =
        (
            currentExamName ||
            "Exam"
        )
        .replace(
            /[\\/:*?"<>|]/g,
            "_"
        );


    XLSX.writeFile(
        workbook,
        `${safeName}-NominalRoll.xlsx`
    );


    showSuccess(
        "Export Complete",
        "Nominal roll exported successfully."
    );

}


// ==========================================
// DOWNLOAD SAMPLE
// ==========================================

function downloadSample() {

    const sample = [

        {

            "Register No":
                "BCA24001",

            "Student Name":
                "Rahul",

            "Department":
                "BCA",

            "Semester":
                "4"

        },

        {

            "Register No":
                "BCOM24001",

            "Student Name":
                "Aisha",

            "Department":
                "BCom",

            "Semester":
                "4"

        },

        {

            "Register No":
                "BCA24002",

            "Student Name":
                "Arjun",

            "Department":
                "BCA",

            "Semester":
                "4"

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
        "NominalRollSample.xlsx"
    );


    showSuccess(
        "Sample Downloaded",
        "Sample Excel file has been generated."
    );

}


// ==========================================
// ALERT HELPERS
// ==========================================

function showSuccess(
    title,
    message
) {

    if (
        typeof AlertManager !==
        "undefined"
    ) {

        AlertManager.success(
            title,
            message
        );

    }

    else {

        Swal.fire(
            title,
            message,
            "success"
        );

    }

}


// ==========================================
// WARNING
// ==========================================

function showWarning(
    title,
    message
) {

    if (
        typeof AlertManager !==
        "undefined"
    ) {

        AlertManager.warning(
            title,
            message
        );

    }

    else {

        Swal.fire(
            title,
            message,
            "warning"
        );

    }

}


// ==========================================
// ERROR
// ==========================================

function showError(
    title,
    message
) {

    if (
        typeof AlertManager !==
        "undefined"
    ) {

        AlertManager.error(
            title,
            message
        );

    }

    else {

        Swal.fire(
            title,
            message,
            "error"
        );

    }

}


// ==========================================
// DEBUG HELPER
// ==========================================

function debugNominalRoll() {

    console.log(
        "=============================="
    );

    console.log(
        "Current Exam ID:",
        currentExam
    );

    console.log(
        "Current Exam Name:",
        currentExamName
    );

    console.log(
        "Current Exam Data:",
        currentExamData
    );

    console.log(
        "Current Students:",
        currentStudents
    );

    console.log(
        "All Rolls:",
        rolls
    );

    console.log(
        "=============================="
    );

}


// ==========================================
// MAKE FUNCTIONS AVAILABLE GLOBALLY
// ==========================================

window.deleteStudent =
    deleteStudent;

window.debugNominalRoll =
    debugNominalRoll;