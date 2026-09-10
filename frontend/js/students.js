/* ==========================================
   SMARTSEAT STUDENTS
   Part 1
========================================== */

/* ==========================
   Global Variables
========================== */

let students = [];

let editIndex = -1;

const studentTable =
document.getElementById("studentTable");

const studentModal =
new bootstrap.Modal(
    document.getElementById("studentModal")
);

const addStudentBtn =
document.getElementById("addStudentBtn");

const saveStudentBtn =
document.getElementById("saveStudentBtn");

const searchStudent =
document.getElementById("searchStudent");

const API_URL = "http://localhost:5000/api/students";

const token = localStorage.getItem("token");
const BATCH_API_URL =
    "http://localhost:5000/api/batches";

/* ==========================================
   STUDENT MASTER
   LOAD BATCHES
========================================== */

async function loadStudentBatches() {

    const batchSelect =
        document.getElementById("studentBatch");


    if (!batchSelect) {
        return;
    }


    try {

        const response = await fetch(
            BATCH_API_URL,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load batches."
            );

        }


        batchSelect.innerHTML = `
            <option value="">
                Select Batch
            </option>
        `;


        data.batches.forEach(batch => {

            const option =
                document.createElement("option");


            option.value = batch._id;


            option.textContent =
                `${batch.batchName} (${batch.prefix})`;


            option.dataset.prefix =
                batch.prefix;


            batchSelect.appendChild(option);

        });


        console.log(
            "✅ Student batches loaded"
        );

    }

    catch (error) {

        console.error(
            "Load student batches error:",
            error
        );


        AlertManager.error(
            "Batch Loading Error",
            "Unable to load batches."
        );

    }

}
/* ==========================
   Statistics
========================== */

function updateStatistics() {

    document.getElementById("totalStudents").textContent =
        students.length;

    const departments = [
        ...new Set(students.map(s => s.department))
    ];

    document.getElementById("totalDepartments").textContent =
        departments.length;

    const semesters = [
        ...new Set(students.map(s => s.semester))
    ];

    document.getElementById("totalSemesters").textContent =
        semesters.length;

    document.getElementById("activeStudents").textContent =
        students.length;

}

/* ==========================
   Render Students
========================== */

function renderStudents(data = students){

    studentTable.innerHTML = "";

    if(data.length===0){

        studentTable.innerHTML = `

        <tr>

            <td
            colspan="5"
            class="text-center">

                No Students Found

            </td>

        </tr>

        `;

        updateStatistics();

        return;

    }

    data.forEach((student,index)=>{

        studentTable.innerHTML += `

        <tr>

            <td>

                ${student.registerNumber}

            </td>

            <td>

                ${student.name}

            </td>

            <td>

                ${student.department}

            </td>

            <td>

                ${student.semester}

            </td>

            <td>

                <button
                class="btn btn-warning btn-sm me-2"
                onclick="editStudent(${index})">

                    <i class="bi bi-pencil-fill"></i>

                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="deleteStudent(${index})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

    updateStatistics();

}

/* ==========================
   Refresh Students
========================== */

function refreshStudents(){

    students = [];
    

    renderStudents();

}

console.log(
    "✅ Students Part 1 Loaded"
);

/* ==========================================
   PART 2
   Add & Edit Student
========================================== */

/* ==========================
   Open Add Student Modal
========================== */

addStudentBtn.addEventListener("click", () => {

    editIndex = -1;

    document.getElementById("regNo").value = "";

    document.getElementById("studentName").value = "";

    document.getElementById("studentBatch").value = "";

    document.getElementById("department").value = "";

    document.getElementById("semester").value = "";

    document.querySelector(".modal-title").innerHTML = `
        <i class="bi bi-person-plus-fill"></i>
        Add Student
    `;
    saveStudentBtn.innerHTML = `
        <i class="bi bi-check-circle-fill"></i>
        Save Student
    `;

    studentModal.show();

});

/* ==========================
   Save Student
========================== */
saveStudentBtn.addEventListener("click", async () => {

    console.log("🔥 SAVE BUTTON CLICKED");

    console.log("1️⃣ Starting save...");

    const regNo =
        document.getElementById("regNo")
            .value
            .trim()
            .toUpperCase();

    const name =
        document.getElementById("studentName")
            .value
            .trim();

    const department =
        document.getElementById("department")
            .value;

    const semester =
        document.getElementById("semester")
            .value;

    console.log("2️⃣ VALUES:", {
        regNo,
        name,
        department,
        semester
    });
    // =======================================
    // VALIDATION
    // =======================================

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
    console.log("3️⃣ VALIDATION PASSED");


    // =======================================
    // GET CURRENT STUDENT WHEN EDITING
    // =======================================

    const currentStudent =
        editIndex !== -1
            ? students[editIndex]
            : null;


    // =======================================
    // CHECK STUDENT ID
    // =======================================

    if (
        editIndex !== -1 &&
        (!currentStudent || !currentStudent._id)
    ) {

        console.error(
            "Invalid student:",
            currentStudent
        );

        AlertManager.error(
            "Update Failed",
            "Student ID not found."
        );

        return;
    }


    // =======================================
    // DUPLICATE REGISTER NUMBER
    // =======================================

    const duplicate =
        students.find((student, index) => {

            const existingRegNo =
                String(
                    student.registerNumber || ""
                )
                .trim()
                .toUpperCase();

            return (
                existingRegNo === regNo &&
                index !== editIndex
            );

        });


    if (duplicate) {

        AlertManager.error(
            "Duplicate Register Number",
            "This register number already exists."
        );

        return;
    }


    // =======================================
    // ADD STUDENT
    // =======================================

    if (editIndex === -1) {
        console.log("4️⃣ ADD MODE - ABOUT TO SEND POST REQUEST");

        try {
            console.log("5️⃣ POST REQUEST STARTING", API_URL);

            const response = await fetch(
    API_URL,
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({
            registerNumber: regNo,
            name: name,
            department: department,
            semester: Number(semester),
            section: "A"
        })
    }
);

console.log(
    "📡 POST STATUS:",
    response.status
);

const data = await response.json();

console.log(
    "📦 POST RESPONSE:",
    data
);


            if (!response.ok) {

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


            studentModal.hide();


            // Reload from MongoDB

            await loadStudents();


            return;

        }

        catch (error) {

            console.error(
                "Add student error:",
                error
            );


            AlertManager.error(
                "Error",
                error.message ||
                "Unable to connect to server."
            );


            return;

        }

    }


    // =======================================
    // UPDATE STUDENT
    // =======================================

    const student =
        students[editIndex];


    try {

        console.log(
            "Updating student:",
            student
        );


        const response =
            await fetch(
                `${API_URL}/${student._id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        registerNumber:
                            regNo,

                        name:
                            name,

                        department:
                            department,

                        semester:
                            Number(semester),

                        section:
                            student.section || "A"

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Update response:",
            data
        );


        if (
            !response.ok ||
            !data.success
        ) {

            AlertManager.error(
                "Update Failed",
                data.message ||
                "Unable to update student."
            );

            return;
        }


        // ===================================
        // SUCCESS
        // ===================================

        ActivityManager.addActivity(
            `Updated Student : ${name}`
        );


        AlertManager.success(
            "Student Updated Successfully"
        );


        studentModal.hide();


        // Reset edit mode

        editIndex = -1;


        // Reload fresh data from MongoDB

        await loadStudents();


    }

    catch (error) {

    console.error(
        "UPDATE STUDENT FRONTEND ERROR:",
        error
    );

    AlertManager.error(
        "Update Error",
        error.message || "Unable to update student."
    );


    }

});

/* ==========================
   Edit Student
========================== */

function editStudent(index) {

    editIndex = index;

    const student =
        students[index];


    if (!student) {

        AlertManager.error(
            "Student Not Found",
            "Unable to find the selected student."
        );

        return;
    }


    console.log(
        "Editing student:",
        student
    );


    document.getElementById("regNo").value =
        student.registerNumber || "";


    document.getElementById("studentName").value =
        student.name || "";


    document.getElementById("department").value =
        student.department || "";


    document.getElementById("semester").value =
        student.semester || "";


    document.querySelector(
        ".modal-title"
    ).innerHTML = `

        <i class="bi bi-pencil-square"></i>

        Edit Student

    `;


    saveStudentBtn.innerHTML = `

        <i class="bi bi-pencil-fill"></i>

        Update Student

    `;


    studentModal.show();

}
/* ==========================================
   PART 3
   Delete & Search Student
========================================== */

/* ==========================
   Delete Student
========================== */

async function deleteStudent(index) {

    const student = students[index];

    if (!student) {
        AlertManager.error(
            "Student Not Found",
            "Unable to find the selected student."
        );
        return;
    }

    const result = await Swal.fire({

        title: "Delete Student?",

        text: `Do you want to delete ${student.name}?`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#dc3545",

        cancelButtonColor: "#6c757d",

        confirmButtonText: "Delete",

        cancelButtonText: "Cancel"

    });

    if (!result.isConfirmed) {
        return;
    }

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

            AlertManager.error(
                "Unable to Delete Student",
                data.message || "Something went wrong."
            );

            return;
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
            "Server Error",
            "Unable to connect to the server."
        );

    }

}
/* ==========================
   Search Student
========================== */

searchStudent.addEventListener("keyup",()=>{

    const value =

    searchStudent.value

    .trim()

    .toLowerCase();

    if(value===""){

        renderStudents();

        return;

    }

    const filtered = students.filter(student=>{

        return(

            student.regNo

            .toLowerCase()

            .includes(value)

            ||

            student.name

            .toLowerCase()

            .includes(value)

            ||

            student.department

            .toLowerCase()

            .includes(value)

            ||

            student.semester

            .toString()

            .includes(value)

        );

    });

    renderStudents(filtered);

});
/* ==========================
   Search Student
========================== */

searchStudent.addEventListener("input", () => {

    const value = searchStudent.value
        .trim()
        .toLowerCase();

    if (value === "") {

        renderStudents();

        return;

    }

    const filtered = students.filter(student => {

        return (

            student.registerNumber
                .toLowerCase()
                .includes(value)

            ||

            student.name
                .toLowerCase()
                .includes(value)

            ||

            student.department
                .toLowerCase()
                .includes(value)

            ||

            String(student.semester)
                .includes(value)

        );

    });

    renderStudents(filtered);

});
/* ==========================
   Enter Key Search
========================== */

searchStudent.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        e.preventDefault();

    }

});

/* ==========================
   Empty Search Reset
========================== */

searchStudent.addEventListener("search",()=>{

    renderStudents();

});

console.log(
    "✅ Students Part 3 Loaded"
);

/* ==========================================
   PART 4
   Excel Upload
========================================== */

const excelFile =
document.getElementById("excelFile");

const uploadExcelBtn =
document.getElementById("uploadExcelBtn");

const downloadSampleBtn =
document.getElementById("downloadSampleBtn");

const clearStudentsBtn =
document.getElementById("clearStudentsBtn");

/* ==========================
   Upload Excel
========================== */

uploadExcelBtn.addEventListener("click",()=>{

    if(!excelFile.files.length){

        AlertManager.warning(

            "No File Selected",

            "Please choose an Excel file."

        );

        return;

    }

    const file =
    excelFile.files[0];

    const reader =
    new FileReader();

    reader.onload=(event)=>{

        const data =
        new Uint8Array(event.target.result);

        const workbook =
        XLSX.read(data,{
            type:"array"
        });

        const sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];

        const rows =
        XLSX.utils.sheet_to_json(sheet);

        if(rows.length===0){

            AlertManager.warning(

                "Empty File",

                "No student records found."

            );

            return;

        }

        let imported = 0;

        rows.forEach(row=>{

            const student={

                regNo:
                String(
                    row["Register No"] || ""
                ).trim().toUpperCase(),

                name:
                String(
                    row["Name"] || ""
                ).trim(),

                department:
                String(
                    row["Department"] || ""
                ).trim(),

                semester:
                String(
                    row["Semester"] || ""
                ).trim()

            };

            if(

                !student.regNo ||

                !student.name ||

                !student.department ||

                !student.semester

            ){

                return;

            }

            const exists =
            students.some(s=>

                s.regNo===student.regNo

            );

            if(!exists){

                StorageManager.addStudent(
                    student
                );

                imported++;

            }

        });

        
        ActivityManager.addActivity(

            `Imported ${imported} Students`

        );

        AlertManager.success(

            "Import Complete",

            `${imported} students imported successfully.`

        );

        excelFile.value="";

        refreshStudents();

    };

    reader.readAsArrayBuffer(file);

});

/* ==========================
   Download Sample Excel
========================== */

downloadSampleBtn.addEventListener("click",()=>{

    const sample=[

        {

            "Register No":"MD24BCA001",

            "Name":"Ameen",

            "Department":"BCA",

            "Semester":"5"

        },

        {

            "Register No":"MD24BCA002",

            "Name":"Asna",

            "Department":"BCA",

            "Semester":"5"

        }

    ];

    const worksheet =
    XLSX.utils.json_to_sheet(sample);

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

});

/* ==========================
   Clear All Students
========================== */

clearStudentsBtn.addEventListener("click",()=>{

    Swal.fire({

        title:"Clear All Students?",

        text:"This cannot be undone.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Clear",

        confirmButtonColor:"#dc3545"

    }).then(result=>{

        if(!result.isConfirmed){

            return;

        }

        StorageManager.saveStudents([]);

        localStorage.setItem(

            "importedStudents",

            0

        );

        ActivityManager.addActivity(

            "Cleared All Students"

        );

        refreshStudents();

        AlertManager.success(

            "All Students Deleted"

        );

    });

});

console.log(
    "✅ Students Part 4 Loaded"
);

/* ==========================================
   PART 5
   Statistics & Export
========================================== */

/* ==========================
   Export Students
========================== */

function exportStudents(){

    if(students.length===0){

        AlertManager.warning(

            "No Students",

            "Student list is empty."

        );

        return;

    }

    const worksheet =
    XLSX.utils.json_to_sheet(

        students.map(student=>({

            "Register No":student.regNo,

            "Name":student.name,

            "Department":student.department,

            "Semester":student.semester

        }))

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

/* ==========================
   Statistics Refresh
========================== */

function updateStatistics(){

    document.getElementById(

        "totalStudents"

    ).textContent =

    students.length;

    const departments =

    [...new Set(

        students.map(

            s=>s.department

        )

    )];

}

/* ==========================
   Initial Load
========================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadStudentBatches();

        await loadStudents();

    }
);

const exportBtn =
document.getElementById(
"exportStudentsBtn"
);

if(exportBtn){

exportBtn.addEventListener(

"click",

exportStudents

);

}

console.log(

"✅ Students Module Ready"

);

async function loadStudents() {

    console.log("🔄 LOAD STUDENTS STARTING");

    try {

        const response = await fetch(
            `${API_URL}?t=${Date.now()}`,
            {
                method: "GET",

                cache: "no-store",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Cache-Control": "no-cache"
                }
            }
        );

        console.log(
            "📡 GET STATUS:",
            response.status
        );

        const data = await response.json();

        console.log(
            "📦 STUDENTS FROM SERVER:",
            data
        );

        students = data.students || [];

        console.log(
            "👨‍🎓 STUDENT COUNT:",
            students.length
        );

        renderStudents();

        console.log(
            "✅ STUDENTS RENDERED"
        );

    }

    catch (error) {

        console.error(
            "❌ LOAD STUDENTS ERROR:",
            error
        );

        Swal.fire(
            "Error",
            "Unable to load students.",
            "error"
        );

    }
}

/* ==========================================
   STUDENT MASTER
   REGISTER NUMBER GENERATOR
========================================== */

function generateRegisterNumber() {

    const batchSelect =
        document.getElementById("studentBatch");

    const departmentSelect =
        document.getElementById("department");

    const regNoInput =
        document.getElementById("regNo");

    const preview =
        document.getElementById("regNoPreview");


    if (
        !batchSelect ||
        !departmentSelect ||
        !regNoInput
    ) {
        return;
    }


    const selectedBatch =
        batchSelect.options[
            batchSelect.selectedIndex
        ];


    const prefix =
        selectedBatch?.dataset?.prefix || "";


    const department =
        departmentSelect.value;


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

        preview.textContent =
            "Invalid department";

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
const studentBatch =
    document.getElementById("studentBatch");

if (studentBatch) {

    studentBatch.addEventListener(
        "change",
        generateRegisterNumber
    );

}
const studentDepartment =
    document.getElementById("department");

if (studentDepartment) {

    studentDepartment.addEventListener(
        "change",
        generateRegisterNumber
    );

}
