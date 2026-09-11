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
// DOM Ready
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("Nominal Roll Page Loaded");

    loadExams();
    loadRolls();

    const examSelect =
        document.getElementById("examSelect");

    const importBtn =
        document.getElementById("importBtn");

    const searchStudent =
        document.getElementById("searchStudent");

    const exportExcelBtn =
        document.getElementById("exportExcelBtn");

    const clearRollBtn =
        document.getElementById("clearRollBtn");

    const downloadSampleBtn =
        document.getElementById("downloadSampleBtn");

    const uploadExcelBtn =
        document.getElementById("uploadExcelBtn");

    const excelFiles =
        document.getElementById("excelFiles");

// --------------------------------------
// Select Exam
// --------------------------------------

examSelect.addEventListener("change", () => {

    currentExam = examSelect.value;

    const selectedOption =
        examSelect.options[examSelect.selectedIndex];

    currentExamName =
        selectedOption
            ? selectedOption.textContent.trim()
            : "";

    console.log("=================================");
    console.log("EXAM SELECTED");
    console.log("Exam ID:", currentExam);
    console.log("Exam Name:", currentExamName);
    console.log("Available Rolls:", rolls);
    console.log("=================================");

    // Find nominal roll using Exam ID
    const foundRoll = rolls.find(roll => {

        return roll.examId === currentExam;

    });

    if (foundRoll) {

        console.log(
            "Nominal Roll Found:",
            foundRoll
        );

        currentStudents =
            foundRoll.students || [];

    }

    else {

        console.log(
            "No nominal roll found for this exam."
        );

        currentStudents = [];

    }

    renderStudents();

});
    
    // --------------------------------------
    // Import
    // --------------------------------------

    importBtn.addEventListener(
        "click",
        importExcelFiles
    );


    // --------------------------------------
    // Search
    // --------------------------------------

    searchStudent.addEventListener(
        "input",
        searchStudents
    );


    // --------------------------------------
    // Export
    // --------------------------------------

    exportExcelBtn.addEventListener(
        "click",
        exportExams
    );


    // --------------------------------------
    // Clear
    // --------------------------------------

    clearRollBtn.addEventListener(
        "click",
        clearCurrentRoll
    );


    // --------------------------------------
    // Sample
    // --------------------------------------

    downloadSampleBtn.addEventListener(
        "click",
        downloadSample
    );


    // --------------------------------------
    // Upload button
    // --------------------------------------

    uploadExcelBtn.addEventListener(
        "click",
        () => {

            excelFiles.click();

        }
    );

});


// ==========================================
// Get Token
// ==========================================

function getToken() {

    return localStorage.getItem("token");

}


/* ==========================================
   LOAD EXAMS FROM MONGODB
========================================== */

async function loadExams(){

    const examSelect =
        document.getElementById("examSelect");

    if(!examSelect){

        console.log("examSelect not found");

        return;

    }

    try{

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                "http://localhost:5000/api/exams",
                {

                    method:"GET",

                    headers:{

                        "Content-Type":
                            "application/json",

                        ...(token
                            ? {
                                Authorization:
                                    `Bearer ${token}`
                            }
                            : {})

                    }

                }
            );

        if(!response.ok){

            throw new Error(
                `Failed to load exams: ${response.status}`
            );

        }

        const data =
            await response.json();

        console.log(
            "Exams loaded from MongoDB:",
            data
        );

        /*
         * Backend returns:
         *
         * {
         *   success:true,
         *   exams:[]
         * }
         */

        const exams =
            data.exams || [];

        examSelect.innerHTML =
            `<option value="">Select Examination</option>`;

        exams.forEach(exam => {

            examSelect.innerHTML += `

                <option value="${exam._id}">

                    ${exam.examName}

                </option>

            `;

        });

        console.log(
            `${exams.length} examinations loaded.`
        );

    }

    catch(error){

        console.error(
            "Load exams error:",
            error
        );

        AlertManager.error(

            "Unable to Load Exams",

            "Could not load examinations from the server."

        );

    }

}

// ==========================================
// Populate Exam Dropdown
// ==========================================

function populateExamSelect(exams) {

    const examSelect =
        document.getElementById(
            "examSelect"
        );


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
            `${exam.examName || "Unnamed Exam"}
             - Semester ${exam.semester || "-"}`;


        option.dataset.examName =
            exam.examName || "";


        examSelect.appendChild(option);

    });


    console.log(
        "Exam dropdown populated."
    );

}


// ==========================================
// Load Saved Rolls
// ==========================================

function loadRolls() {

    rolls =
        JSON.parse(
            localStorage.getItem(
                "nominalRolls"
            )
        ) || [];


    document.getElementById(
        "totalFiles"
    ).textContent =
        rolls.length;

}

// ==========================================
// Render Students
// ==========================================

function renderStudents(
    data = currentStudents
) {

    const studentTable =
        document.getElementById(
            "studentTable"
        );


    studentTable.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        studentTable.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center">

                    No Students Imported

                </td>

            </tr>

        `;


        updateStatistics();

        return;

    }


    data.forEach(student => {

        studentTable.innerHTML += `

            <tr>

                <td>
                    ${student.regNo || "-"}
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

                <td>
                    ${currentExam || "-"}
                </td>

                <td>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="deleteStudent('${student.regNo}')">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>

            </tr>

        `;

    });


    updateStatistics();

}


// ==========================================
// Statistics
// ==========================================

function updateStatistics() {

    const total =
        currentStudents.length;


    const departments =
        new Set(
            currentStudents
                .map(
                    student =>
                        student.department
                )
                .filter(Boolean)
        );


    const semesters =
        new Set(
            currentStudents
                .map(
                    student =>
                        student.semester
                )
                .filter(Boolean)
        );


    document.getElementById(
        "totalStudents"
    ).textContent =
        total;


    document.getElementById(
        "totalDepartments"
    ).textContent =
        departments.size;


    document.getElementById(
        "totalSemesters"
    ).textContent =
        semesters.size;


    document.getElementById(
        "summaryStudents"
    ).textContent =
        total;


    document.getElementById(
        "summaryDepartments"
    ).textContent =
        departments.size;


    document.getElementById(
        "summarySemesters"
    ).textContent =
        semesters.size;


    document.getElementById(
        "summaryExam"
    ).textContent =
        currentExamName || "-";

}

// ==========================================
// Import Excel Files
// ==========================================

async function importExcelFiles() {

    const examSelect =
        document.getElementById("examSelect");

    const excelFiles =
        document.getElementById("excelFiles");

    // --------------------------------------
    // Check Exam
    // --------------------------------------

    if (!examSelect.value) {

        AlertManager.warning(
            "Select Examination",
            "Please choose an examination first."
        );

        return;

    }

    // --------------------------------------
    // Check Files
    // --------------------------------------

    if (
        !excelFiles.files ||
        excelFiles.files.length === 0
    ) {

        AlertManager.warning(
            "No Files",
            "Please choose one or more Excel files."
        );

        return;

    }

    let importedCount = 0;

    try {

        // ----------------------------------
        // Read every selected Excel file
        // ----------------------------------

        for (
            const file of excelFiles.files
        ) {

            const students =
                await readExcelFile(file);

            students.forEach(student => {

                const exists =
                    currentStudents.some(
                        existing =>
                            existing.regNo ===
                            student.regNo
                    );

                if (
                    student.regNo &&
                    !exists
                ) {

                    currentStudents.push(student);

                    importedCount++;

                }

            });

        }

        // ----------------------------------
        // Save Roll
        // ----------------------------------

        saveCurrentRoll();

        // Clear selected files
        excelFiles.value = "";

        // ----------------------------------
        // Success
        // ----------------------------------

        AlertManager.success(
            "Import Successful",
            `${importedCount} new students imported.`
        );

    }

    catch (error) {

        console.error(
            "Excel import error:",
            error
        );

        AlertManager.error(
            "Import Failed",
            error.message
        );

    }

}


// ==========================================
// Save Current Roll
// ==========================================

function saveCurrentRoll() {

    const examId =
        document.getElementById(
            "examSelect"
        ).value;

    const examName =
        currentExamName ||
        "Unnamed Exam";

    // --------------------------------------
    // Find existing roll
    // --------------------------------------

    const index =
        rolls.findIndex(
            roll =>
                roll.examId === examId
        );

    // --------------------------------------
    // Create roll
    // --------------------------------------

    const roll = {

        examId: examId,

        exam: examName,

        importedOn:
            new Date().toISOString(),

        students:
            currentStudents

    };

    // --------------------------------------
    // Add / Update
    // --------------------------------------

    if (index === -1) {

        rolls.push(roll);

    }

    else {

        rolls[index] = roll;

    }

    // --------------------------------------
    // Save to Local Storage
    // --------------------------------------

    localStorage.setItem(
        "nominalRolls",
        JSON.stringify(rolls)
    );

    // --------------------------------------
    // Update UI
    // --------------------------------------

    document.getElementById(
        "totalFiles"
    ).textContent =
        rolls.length;

    renderStudents();

    // --------------------------------------
    // Activity
    // --------------------------------------

    if (
        typeof ActivityManager !==
        "undefined"
    ) {

        ActivityManager.addActivity(
            `Imported Nominal Roll : ${examName}`
        );

    }

}

// ==========================================
// Read Excel File
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


                        const sheet =
                            workbook.Sheets[
                                workbook.SheetNames[0]
                            ];


                        const rows =
                            XLSX.utils.sheet_to_json(
                                sheet
                            );


                        const students =
                            rows.map(row => ({

                                regNo:
                                    String(
                                        row["Register No"] ||
                                        row["Reg No"] ||
                                        row["Register Number"] ||
                                        ""
                                    ).trim(),

                                name:
                                    String(
                                        row["Student Name"] ||
                                        row["Name"] ||
                                        ""
                                    ).trim(),

                                department:
                                    String(
                                        row["Department"] ||
                                        ""
                                    ).trim(),

                                semester:
                                    String(
                                        row["Semester"] ||
                                        ""
                                    ).trim()

                            }));


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
                            "Unable to read Excel file."
                        )
                    );

                };


            reader.readAsArrayBuffer(file);

        }
    );

}


// ==========================================
// Save Current Roll
// ==========================================

function saveCurrentRoll() {

    const examId =
        document.getElementById(
            "examSelect"
        ).value;


    const index =
        rolls.findIndex(
            roll =>
                roll.examId === examId
        );


    const roll = {

        examId: examId,

        exam: currentExam,

        importedOn:
            new Date().toISOString(),

        students:
            currentStudents

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


    document.getElementById(
        "totalFiles"
    ).textContent =
        rolls.length;


    renderStudents();


    if (
        typeof ActivityManager !==
        "undefined"
    ) {

        ActivityManager.addActivity(

            `Imported Nominal Roll : ${currentExam}`

        );

    }

}


// ==========================================
// Search
// ==========================================

function searchStudents() {

    const keyword =
        document.getElementById(
            "searchStudent"
        )
        .value
        .toLowerCase()
        .trim();


    const filtered =
        currentStudents.filter(student => {

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

            );

        });


    renderStudents(filtered);

}


// ==========================================
// Delete Student
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
                "Cancel"

        });


    if (
        !result.isConfirmed
    ) {

        return;

    }


    currentStudents =
        currentStudents.filter(
            student =>
                student.regNo !== regNo
        );


    saveCurrentRoll();


    AlertManager.success(

        "Deleted",

        "Student removed from nominal roll."

    );

}


// ==========================================
// Clear Current Roll
// ==========================================

async function clearCurrentRoll() {

    if (!currentExam) {

        AlertManager.warning(

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
                `All students for ${currentExam} will be removed.`,

            icon:
                "warning",

            showCancelButton:
                true,

            confirmButtonText:
                "Clear Roll",

            cancelButtonText:
                "Cancel"

        });


    if (
        !result.isConfirmed
    ) {

        return;

    }


    const examId =
        document.getElementById(
            "examSelect"
        ).value;


    rolls =
        rolls.filter(
            roll =>
                roll.examId !== examId
        );


    currentStudents = [];


    localStorage.setItem(

        "nominalRolls",

        JSON.stringify(rolls)

    );


    loadRolls();

    renderStudents();


    AlertManager.success(

        "Cleared",

        "Nominal roll removed."

    );

}


// ==========================================
// Export Excel
// ==========================================

function exportExams() {

    if (
        currentStudents.length === 0
    ) {

        AlertManager.warning(

            "No Data",

            "There are no students to export."

        );

        return;

    }


    const rows =
        currentStudents.map(
            student => ({

                "Register No":
                    student.regNo,

                "Student Name":
                    student.name,

                "Department":
                    student.department,

                "Semester":
                    student.semester

            })
        );


    const sheet =
        XLSX.utils.json_to_sheet(rows);


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(

        workbook,

        sheet,

        "Nominal Roll"

    );


    XLSX.writeFile(

        workbook,

        `${currentExam || "Exam"}-NominalRoll.xlsx`

    );

}


// ==========================================
// Download Sample Excel
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

        }

    ];


    const sheet =
        XLSX.utils.json_to_sheet(
            sample
        );


    const workbook =
        XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(

        workbook,

        sheet,

        "Sample"

    );


    XLSX.writeFile(

        workbook,

        "NominalRollSample.xlsx"

    );

}