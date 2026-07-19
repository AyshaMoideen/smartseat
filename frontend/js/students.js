/* ==========================================
   SMARTSEAT STUDENTS
   Part 1
========================================== */

/* ==========================
   Global Variables
========================== */

let students = StorageManager.getStudents();

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

/* ==========================
   Statistics
========================== */

function updateStatistics(){

    const totalStudents =
    students.length;

    const departments =
    [...new Set(
        students.map(student=>student.department)
    )];

    document.getElementById(
        "totalStudents"
    ).textContent =
    totalStudents;

    document.getElementById(
        "departmentCount"
    ).textContent =
    departments.length;

    document.getElementById(
        "manualStudents"
    ).textContent =
    totalStudents;

    document.getElementById(
        "importedStudents"
    ).textContent =
    localStorage.getItem(
        "importedStudents"
    ) || 0;

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

                ${student.regNo}

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

    students =
    StorageManager.getStudents();

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
    document.getElementById("department").value = "";
    document.getElementById("semester").value = "";

    document.querySelector(".modal-title").innerHTML = `
        <i class="bi bi-person-plus-fill"></i>
        Add Student
    `;

    studentModal.show();

});

/* ==========================
   Save Student
========================== */

saveStudentBtn.addEventListener("click", () => {

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

    /* Validation */

    if(
        !regNo ||
        !name ||
        !department ||
        !semester
    ){

        AlertManager.warning(
            "Missing Details",
            "Please fill all fields."
        );

        return;

    }

    /* Duplicate Register Number */

    const duplicate =
    students.find((student,index)=>{

        return (
            student.regNo === regNo &&
            index !== editIndex
        );

    });

    if(duplicate){

        AlertManager.error(
            "Duplicate Register Number",
            "This register number already exists."
        );

        return;

    }

    const student = {

        regNo,
        name,
        department,
        semester

    };

    /* Add */

    if(editIndex === -1){

        StorageManager.addStudent(student);

        ActivityManager.addActivity(
            `Added Student : ${name}`
        );

        AlertManager.success(
            "Student Added Successfully"
        );

    }

    /* Edit */

    else{

        students[editIndex] = student;

        StorageManager.saveStudents(
            students
        );

        ActivityManager.addActivity(
            `Updated Student : ${name}`
        );

        AlertManager.success(
            "Student Updated Successfully"
        );

    }

    studentModal.hide();

    refreshStudents();

});

/* ==========================
   Edit Student
========================== */

function editStudent(index){

    editIndex = index;

    const student = students[index];

    document.getElementById("regNo").value =
    student.regNo;

    document.getElementById("studentName").value =
    student.name;

    document.getElementById("department").value =
    student.department;

    document.getElementById("semester").value =
    student.semester;

    document.querySelector(".modal-title").innerHTML = `
        <i class="bi bi-pencil-square"></i>
        Edit Student
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

function deleteStudent(index){

    const student = students[index];

    Swal.fire({

        title: "Delete Student?",

        text: `Do you want to delete ${student.name}?`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#dc3545",

        cancelButtonColor: "#6c757d",

        confirmButtonText: "Delete",

        cancelButtonText: "Cancel"

    }).then((result)=>{

        if(!result.isConfirmed){

            return;

        }

        StorageManager.deleteStudent(index);

        ActivityManager.addActivity(

            `Deleted Student : ${student.name}`

        );

        AlertManager.success(

            "Student Deleted Successfully"

        );

        refreshStudents();

    });

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

        localStorage.setItem(

            "importedStudents",

            Number(

                localStorage.getItem(
                    "importedStudents"
                ) || 0

            ) + imported

        );

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

    document.getElementById(

        "departmentCount"

    ).textContent =

    departments.length;

    document.getElementById(

        "manualStudents"

    ).textContent =

    students.length -

    Number(

        localStorage.getItem(

            "importedStudents"

        ) || 0

    );

    document.getElementById(

        "importedStudents"

    ).textContent =

    localStorage.getItem(

        "importedStudents"

    ) || 0;

}

/* ==========================
   Initial Load
========================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        refreshStudents();

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

