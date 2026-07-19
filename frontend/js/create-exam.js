/* ==========================================
   SMARTSEAT
   CREATE EXAM
========================================== */

/* ==========================
   Global Variables
========================== */

let exams = StorageManager.getExams();
let editIndex = -1;

/* ==========================
   Elements
========================== */

const examTable = document.getElementById("examTable");
const saveExamBtn = document.getElementById("saveExamBtn");
const searchExam = document.getElementById("searchExam");

/* ==========================
   Statistics
========================== */

function updateStatistics() {

    const today = new Date().toISOString().split("T")[0];

    let todayCount = 0;
    let upcomingCount = 0;

    exams.forEach(exam => {

        if (exam.date === today) {

            todayCount++;

        } else if (exam.date > today) {

            upcomingCount++;

        }

    });

    const semesters = [...new Set(exams.map(exam => exam.semester))];

    document.getElementById("totalExams").textContent = exams.length;
    document.getElementById("todayExams").textContent = todayCount;
    document.getElementById("upcomingExams").textContent = upcomingCount;

    const semesterCard = document.getElementById("departmentCount");
    if (semesterCard) {

        semesterCard.textContent = semesters.length;

    }

    document.getElementById("summaryTotal").textContent = exams.length;
    document.getElementById("summaryToday").textContent = todayCount;
    document.getElementById("summaryUpcoming").textContent = upcomingCount;

    const summarySemester = document.getElementById("summaryDepartments");
    if (summarySemester) {

        summarySemester.textContent = semesters.length;

    }

}

/* ==========================
   Render Exams
========================== */

function renderExams(data = exams) {

    examTable.innerHTML = "";

    if (data.length === 0) {

        examTable.innerHTML = `

            <tr>

                <td colspan="6" class="text-center">

                    No Exams Created

                </td>

            </tr>

        `;

        updateStatistics();

        return;

    }

    data.forEach((exam, index) => {

        examTable.innerHTML += `

            <tr>

                <td>${exam.name}</td>

                <td>${exam.semester}</td>

                <td>${exam.date}</td>

                <td>${exam.startTime} - ${exam.endTime}</td>

                <td>

                    <button
                        class="btn btn-warning btn-sm me-2"
                        onclick="editExam(${index})">

                        <i class="bi bi-pencil-fill"></i>

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteExam(${index})">

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </td>

            </tr>

        `;

    });

    updateStatistics();

}

/* ==========================
   Initial Load
========================== */

renderExams();

console.log("✅ Create Exam Part 1 Loaded");

/* ==========================================
   SAVE EXAM
========================================== */

saveExamBtn.addEventListener("click", () => {

    const exam = {

        name: document.getElementById("examName").value.trim(),

        semester: document.getElementById("examSemester").value,

        date: document.getElementById("examDate").value,

        startTime: document.getElementById("startTime").value,

        endTime: document.getElementById("endTime").value

    };

    /* ==========================
       Validation
    ========================== */
    if(
    !exam.name ||
    !exam.semester ||
    !exam.date ||
    !exam.startTime ||
    !exam.endTime
){
    AlertManager.warning(
        "Missing Details",
        "Please fill the required fields."
    );
    return;
}
    /* ==========================
       Duplicate Check
    ========================== */
const duplicate = exams.some((e, index) => {

    if(index === editIndex) return false;

    return (

        e.name.trim().toLowerCase() ===
        exam.name.trim().toLowerCase()

        &&

        e.semester === exam.semester

        &&

        e.date === exam.date

    );

});
if(duplicate){

    AlertManager.error(

        "Duplicate Exam",

        "An exam with the same Name, Semester and Date already exists."

    );

    return;

}

    /* ==========================
       Add New Exam
    ========================== */

    if (editIndex === -1) {

        exams.push(exam);

        StorageManager.saveExams(exams);

        ActivityManager.addActivity(

            `Created Exam : ${exam.name}`

        );

        AlertManager.success(

            "Exam Created Successfully"

        );

    }

    /* ==========================
       Update Exam
    ========================== */

    else {

        exams[editIndex] = exam;

        StorageManager.saveExams(exams);

        ActivityManager.addActivity(

            `Updated Exam : ${exam.name}`

        );

        AlertManager.success(

            "Exam Updated Successfully"

        );

        editIndex = -1;

    }

    clearForm();

    refreshExams();

});


/* ==========================================
   EDIT EXAM
========================================== */

function editExam(index) {

    editIndex = index;

    const exam = exams[index];

    document.getElementById("examName").value = exam.name;

    document.getElementById("examSemester").value = exam.semester;

    document.getElementById("examDate").value = exam.date;

    document.getElementById("startTime").value = exam.startTime;

    document.getElementById("endTime").value = exam.endTime;

}


/* ==========================================
   CLEAR FORM
========================================== */

function clearForm(){

    editIndex = -1;

    document.getElementById("examName").value="";

    document.getElementById("examSemester").value="";

    document.getElementById("examDate").value="";

    document.getElementById("startTime").value="";

    document.getElementById("endTime").value="";

}

console.log("✅ Create Exam Part 2 Loaded");

/* ==========================================
   DELETE EXAM
========================================== */

function deleteExam(index) {

    Swal.fire({

        title: "Delete Exam?",

        text: "This action cannot be undone.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#d33",

        confirmButtonText: "Delete"

    }).then((result) => {

        if (!result.isConfirmed) return;

        ActivityManager.addActivity(
            `Deleted Exam : ${exams[index].name}`
        );

        exams.splice(index, 1);

        StorageManager.saveExams(exams);

        refreshExams();

        AlertManager.success(
            "Exam Deleted Successfully"
        );

    });

}


/* ==========================================
   REFRESH
========================================== */

function refreshExams() {

    exams = StorageManager.getExams();

    renderExams();

}


/* ==========================================
   SEARCH
========================================== */

if (searchExam) {

    searchExam.addEventListener("input", () => {

        const keyword = searchExam.value
            .trim()
            .toLowerCase();

        const filtered = exams.filter(exam => {

            return (

                exam.name.toLowerCase().includes(keyword)

                ||

                exam.semester.toString().includes(keyword)

                ||

                exam.room.toLowerCase().includes(keyword)

            );

        });

        renderExams(filtered);

    });

}


/* ==========================================
   CLEAR ALL EXAMS
========================================== */

function clearAllExams() {

    if (exams.length === 0) {

        AlertManager.warning(

            "No Exams",

            "There are no exams to clear."

        );

        return;

    }

    Swal.fire({

        title: "Clear All Exams?",

        text: "This action cannot be undone.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#d33",

        confirmButtonText: "Yes, Clear"

    }).then((result) => {

        if (!result.isConfirmed) return;

        exams = [];

        StorageManager.saveExams(exams);

        renderExams();

        ActivityManager.addActivity(
            "Cleared all examinations"
        );

        AlertManager.success(
            "All Exams Cleared"
        );

    });

}


const clearTop =
document.getElementById("clearExamBtn");

if (clearTop) {

    clearTop.onclick = clearAllExams;

}

const clearBottom =
document.getElementById("clearExamBtnBottom");

if (clearBottom) {

    clearBottom.onclick = clearAllExams;

}


/* ==========================================
   EXPORT EXCEL
========================================== */

const exportBtn =
document.getElementById("exportExamBtn");

if (exportBtn) {

    exportBtn.onclick = () => {

        if (exams.length === 0) {

            AlertManager.warning(

                "No Exams",

                "Nothing to export."

            );

            return;

        }

        const exportData = exams.map(exam => ({

            "Exam Name": exam.name,

            "Semester": exam.semester,

            "Room": exam.room,

            "Date": exam.date,

            "Start Time": exam.startTime,

            "End Time": exam.endTime

        }));

        const sheet =
        XLSX.utils.json_to_sheet(exportData);

        const workbook =
        XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(

            workbook,

            sheet,

            "Exams"

        );

        XLSX.writeFile(

            workbook,

            "SmartSeat_Exams.xlsx"

        );

        AlertManager.success(

            "Excel Exported Successfully"

        );

    };

}


console.log("✅ Create Exam Loaded Successfully");