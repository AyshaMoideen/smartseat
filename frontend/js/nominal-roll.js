/* ==========================================
   SMARTSEAT
   NOMINAL ROLL MANAGER
========================================== */

let rolls = [];

let currentStudents = [];

let currentExam = "";

/* ==========================
   Elements
========================== */

const examSelect =
document.getElementById("examSelect");

const excelFile =
document.getElementById("excelFile");

const importBtn =
document.getElementById("importBtn");

const studentTable =
document.getElementById("studentTable");

const searchStudent =
document.getElementById("searchStudent");

const totalStudents =
document.getElementById("totalStudents");

const totalDepartments =
document.getElementById("totalDepartments");

const totalSemesters =
document.getElementById("totalSemesters");

const totalFiles =
document.getElementById("totalFiles");

const summaryStudents =
document.getElementById("summaryStudents");

const summaryDepartments =
document.getElementById("summaryDepartments");

const summarySemesters =
document.getElementById("summarySemesters");

const summaryExam =
document.getElementById("summaryExam");

const exportExcelBtn =
document.getElementById("exportExcelBtn");

const clearRollBtn =
document.getElementById("clearRollBtn");

const downloadSampleBtn =
document.getElementById("downloadSampleBtn");

/* ==========================================
   Load Page
========================================== */

window.onload = function(){

    loadExams();

    loadRolls();

};

/* ==========================================
   Load Exams
========================================== */

function loadExams(){

    const examSelect =
    document.getElementById("examSelect");

    if(!examSelect){

        console.log("examSelect not found");

        return;

    }

    const exams =
    StorageManager.getExams();

    console.log(exams);

    examSelect.innerHTML =
    `<option value="">Select Examination</option>`;

    exams.forEach(exam=>{

        examSelect.innerHTML += `

        <option value="${exam.name}">

            ${exam.name}

        </option>

        `;

    });

}

/* ==========================================
   Load Rolls
========================================== */

function loadRolls(){

    rolls = JSON.parse(

        localStorage.getItem("nominalRolls")

    ) || [];

    totalFiles.textContent =
    rolls.length;

}
/* ==========================================
   Change Exam
========================================== */

examSelect.addEventListener("change",()=>{

    currentExam =
    examSelect.value;

    const found =

    rolls.find(r=>{

        return r.exam===currentExam;

    });

    if(found){

        currentStudents =

        found.students;

    }

    else{

        currentStudents = [];

    }

    renderStudents();

});
/* ==========================================
   Statistics
========================================== */

function updateStatistics(){

    totalStudents.textContent =
    currentStudents.length;

    summaryStudents.textContent =
    currentStudents.length;

    const departments =

    [...new Set(

        currentStudents.map(

            s=>s.department

        )

    )];

    totalDepartments.textContent =
    departments.length;

    summaryDepartments.textContent =
    departments.length;

    const semesters =

    [...new Set(

        currentStudents.map(

            s=>s.semester

        )

    )];

    totalSemesters.textContent =
    semesters.length;

    summarySemesters.textContent =
    semesters.length;

    summaryExam.textContent =

    currentExam || "-";

}
/* ==========================================
   Render Students
========================================== */

function renderStudents(data=currentStudents){

    studentTable.innerHTML="";

    if(data.length===0){

        studentTable.innerHTML = `

        <tr>

            <td colspan="6"

            class="text-center">

            No Students Imported

            </td>

        </tr>

        `;

        updateStatistics();

        return;

    }

    data.forEach((student,index)=>{

        studentTable.innerHTML += `

        <tr>

            <td>${student.regNo}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.semester}</td>

            <td>${currentExam}</td>

            <td>

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
/* ==========================================
   Render Students
========================================== */

function renderStudents(data=currentStudents){

    studentTable.innerHTML="";

    if(data.length===0){

        studentTable.innerHTML = `

        <tr>

            <td colspan="6"

            class="text-center">

            No Students Imported

            </td>

        </tr>

        `;

        updateStatistics();

        return;

    }

    data.forEach((student,index)=>{

        studentTable.innerHTML += `

        <tr>

            <td>${student.regNo}</td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.semester}</td>

            <td>${currentExam}</td>

            <td>

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
/* ==========================================
   IMPORT EXCEL
========================================== */
/* ==========================================
IMPORT MULTIPLE EXCEL FILES
========================================== */

importBtn.addEventListener("click", () => {

    if (!currentExam) {

        AlertManager.warning(
            "Select Examination",
            "Please choose an examination first."
        );

        return;

    }

    if (excelFiles.files.length === 0) {

        AlertManager.warning(
            "No Files",
            "Choose one or more Excel files."
        );

        return;

    }

    let importedStudents = [];

    let processed = 0;

    Array.from(excelFiles.files).forEach(file => {

        const reader = new FileReader();

        reader.onload = function(e){

            const workbook = XLSX.read(

                new Uint8Array(e.target.result),

                {type:"array"}

            );

            const sheet = workbook.Sheets[
                workbook.SheetNames[0]
            ];

            const rows = XLSX.utils.sheet_to_json(sheet);

            rows.forEach(row=>{

                const student={

                    regNo:
                        row["Register No"] ||
                        row["Reg No"] ||
                        "",

                    name:
                        row["Student Name"] ||
                        row["Name"] ||
                        "",

                    department:
                        row["Department"] ||
                        "",

                    semester:
                        row["Semester"] ||
                        ""

                };

                if(

                    !currentStudents.some(

                        s=>s.regNo===student.regNo

                    )

                ){

                    currentStudents.push(student);

                    importedStudents.push(student);

                }

            });

            processed++;

            if(processed===excelFiles.files.length){

                saveCurrentRoll();

            }

        };

        reader.readAsArrayBuffer(file);

    });

});
/* ==========================================
   SAVE CURRENT ROLL
========================================== */

function saveCurrentRoll(){

    const index =

    rolls.findIndex(r=>{

        return r.exam===currentExam;

    });

    const roll={

        exam:currentExam,

        importedOn:

        new Date()

        .toLocaleDateString(),

        students:currentStudents

    };

    if(index===-1){

        rolls.push(roll);

    }

    else{

        rolls[index]=roll;

    }

    localStorage.setItem(

        "nominalRolls",

        JSON.stringify(rolls)

    );

    totalFiles.textContent=

    rolls.length;

    renderStudents();

    ActivityManager.addActivity(

        `Imported Nominal Roll : ${currentExam}`

    );

    AlertManager.success(

"Import Successful",

`${currentStudents.length} Total Students Loaded`

);

}
/* ==========================================
   SEARCH
========================================== */

searchStudent.addEventListener("keyup",()=>{

    const value=

    searchStudent.value

    .toLowerCase();

    const filtered=

    currentStudents.filter(student=>{

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

        );

    });

    renderStudents(filtered);

});
/* ==========================================
   DELETE STUDENT
========================================== */

function deleteStudent(index){

    Swal.fire({

        title:"Delete Student?",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Delete"

    }).then(result=>{

        if(!result.isConfirmed)

        return;

        currentStudents.splice(

            index,

            1

        );

        saveCurrentRoll();

    });

}
/* ==========================================
   CLEAR ROLL
========================================== */

clearRollBtn.addEventListener("click",()=>{

    if(!currentExam){

        AlertManager.warning(

            "Select Examination",

            "Choose an exam first."

        );

        return;

    }

    Swal.fire({

        title:"Clear Nominal Roll?",

        text:"All imported students will be removed.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Yes"

    }).then(result=>{

        if(!result.isConfirmed)

        return;

        rolls = rolls.filter(r=>{

            return r.exam!==currentExam;

        });

        localStorage.setItem(

            "nominalRolls",

            JSON.stringify(rolls)

        );

        currentStudents=[];

        loadRolls();

        renderStudents();

        AlertManager.success(

            "Cleared",

            "Nominal Roll removed."

        );

    });

});
/* ==========================================
   EXPORT EXCEL
========================================== */

exportExcelBtn.addEventListener("click",()=>{

    if(currentStudents.length===0){

        AlertManager.warning(

            "No Data",

            "Nothing to export."

        );

        return;

    }

    const sheet=

    XLSX.utils.json_to_sheet(

        currentStudents

    );

    const workbook=

    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        sheet,

        currentExam

    );

    XLSX.writeFile(

        workbook,

        `${currentExam}-NominalRoll.xlsx`

    );

});
/* ==========================================
   SAMPLE EXCEL
========================================== */

downloadSampleBtn.addEventListener("click",()=>{

    const sample=[

        {

            "Register No":"BCA24001",

            "Student Name":"Rahul",

            "Department":"BCA",

            "Semester":"4"

        },

        {

            "Register No":"BCOM24001",

            "Student Name":"Aisha",

            "Department":"BCom",

            "Semester":"4"

        }

    ];

    const sheet=

    XLSX.utils.json_to_sheet(sample);

    const workbook=

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

});
