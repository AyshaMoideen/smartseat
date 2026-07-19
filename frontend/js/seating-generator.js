/* ==========================================
   SMARTSEAT
   Seating Generator
========================================== */

let exams = [];
let students = [];
let rooms = [];
let seating = [];

/* ==========================
   Load Everything
========================== */

function loadData() {

    exams = StorageManager.getExams() || [];

    students = StorageManager.getStudents() || [];

    rooms = StorageManager.getRooms() || [];

    seating = StorageManager.getSeating() || [];

}

/* ==========================
   Load Exam Dropdown
========================== */

function loadExamList(){

    const examSelect =
    document.getElementById("examSelect");

    examSelect.innerHTML =
    '<option value="">Select Examination</option>';

    exams.forEach((exam,index)=>{

        examSelect.innerHTML += `

        <option value="${index}">

            ${exam.name} - Semester ${exam.semester}

        </option>

        `;

    });

}

/* ==========================
   Statistics
========================== */

function updateStatistics() {

    let capacity = 0;

    rooms.forEach(room => {

        capacity += Number(room.capacity);

    });

    document.getElementById("studentCount").textContent =
        students.length;

    document.getElementById("roomCount").textContent =
        rooms.length;

    document.getElementById("capacityCount").textContent =
        capacity;

    document.getElementById("allocatedCount").textContent =
        seating.length;

    document.getElementById("remainingCount").textContent =
        capacity - seating.length;

}

/* ==========================
   Roll Status
========================== */

function updateRollStatus() {

    const status =
        document.getElementById("rollStatus");

    if (students.length > 0) {

        status.innerHTML =

            `<i class="bi bi-check-circle-fill text-success"></i>
             ${students.length} Students Loaded`;

    }

    else {

        status.innerHTML =

            `<i class="bi bi-x-circle-fill text-danger"></i>
             No Nominal Roll`;

    }

}

/* ==========================
   Generate Seating
========================== */

document
    .getElementById("generateBtn")
    .onclick = generateSeating;

function generateSeating() {

    const examId =
        document.getElementById("examSelect").value;

    if (!examId) {

        AlertManager.warning(
            "Select Examination",
            "Please select an examination."
        );

        return;

    }

    if (students.length === 0) {

        AlertManager.warning(
            "No Students",
            "Upload Nominal Roll first."
        );

        return;

    }

    if (rooms.length === 0) {

        AlertManager.warning(
            "No Rooms",
            "Please create rooms first."
        );

        return;

    }

    seating = [];

    let roomIndex = 0;

    let bench = 1;

    let seat = 1;

    for (let i = 0; i < students.length; i++) {

        if (roomIndex >= rooms.length) {

            AlertManager.error(
                "Capacity Exceeded",
                "Not enough seats available."
            );

            break;

        }

        const room = rooms[roomIndex];

        const selectedExam = exams[examId];

seating.push({

    examId,

    examName: selectedExam.name,

    examDate: selectedExam.date,

    examTime: selectedExam.time,

    regNo: students[i].regNo,

    name: students[i].name,

    department: students[i].department,

    semester: students[i].semester,

    room: room.name,

    bench,

    seat

});

        seat++;

        if (seat > 3) {

            seat = 1;

            bench++;

        }

        const benchesPerRoom =
            Math.floor(room.capacity / 3);

        if (bench > benchesPerRoom) {

            roomIndex++;

            bench = 1;

            seat = 1;

        }

    }

    StorageManager.saveSeating(seating);

    renderTable();

    updateStatistics();

    ActivityManager.addActivity(
        "Generated Seating"
    );

    AlertManager.success(
        "Seating Generated Successfully"
    );

}
/* ==========================
   Render Seating Table
========================== */

function renderTable() {

    const table =
        document.getElementById("seatingTable");

    table.innerHTML = "";

    if (seating.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="6" class="text-center">

                No Seating Generated

            </td>

        </tr>

        `;

        return;

    }

    seating.forEach(student => {

        table.innerHTML += `

        <tr>

            <td>${student.regNo || "-"}</td>

            <td>${student.name || "-"}</td>

            <td>${student.semester}</td>

            <td>${student.room || "-"}</td>

            <td>${student.bench}</td>

            <td>${student.seat}</td>

        </tr>

        `;

    });

}

/* ==========================
   Manual Entry
========================== */

const manualModal =
new bootstrap.Modal(
document.getElementById("manualModal")
);

document.getElementById("manualBtn")
.onclick = () => {

    manualModal.show();

};

document.getElementById("allocateBtn")
.onclick = allocateStudent;

function allocateStudent(){

    const regNo = document.getElementById("manualRegNo").value.trim();

    const name = document.getElementById("manualName").value.trim();

    const semester = document.getElementById("manualSemester").value;

    const examSelect = document.getElementById("examSelect");

    const examId = examSelect.value;

    console.log({
        regNo,
        name,
        semester,
        examId
    });

    // Validation
    if(regNo === "" || name === "" || semester === ""){

        AlertManager.warning(
            "Missing Details",
            "Please fill all fields."
        );

        return;
    }

    if(examId === ""){

        AlertManager.warning(
            "Select Examination",
            "Please select an examination first."
        );

        return;
    }

    // Already allocated?
    if(seating.some(s => s.regNo === regNo)){

        AlertManager.error(
            "Already Allocated",
            "Student already has a seat."
        );

        return;
    }

    // Find next available seat
    let roomIndex = 0;
    let bench = 1;
    let seat = 1;

    if(seating.length){

        const last = seating[seating.length-1];

        roomIndex = rooms.findIndex(r => r.name === last.room);

        if(roomIndex === -1)
            roomIndex = 0;

        bench = last.bench;
        seat = last.seat + 1;

        if(seat > 3){

            seat = 1;
            bench++;

        }

        const benchesPerRoom =
        Math.floor(Number(rooms[roomIndex].capacity)/3);

        if(bench > benchesPerRoom){

            roomIndex++;
            bench = 1;
            seat = 1;

        }

    }

    if(roomIndex >= rooms.length){

        AlertManager.error(
            "Rooms Full",
            "No seats available."
        );

        return;

    }

    seating.push({

        examId,

        regNo,

        name,

        semester,

        room: rooms[roomIndex].name,

        bench,

        seat

    });

    StorageManager.saveSeating(seating);

    renderTable();

    updateStatistics();

    manualModal.hide();

    document.getElementById("manualRegNo").value="";
    document.getElementById("manualName").value="";
    document.getElementById("manualSemester").value="";

    AlertManager.success(
        "Seat Allocated Successfully"
    );

}

/* ==========================
   Clear Seating
========================== */

document.getElementById("clearBtn")
.onclick = clearSeating;

function clearSeating(){

    if(seating.length===0){

        AlertManager.warning(
            "Nothing to Clear",
            "Generate seating first."
        );

        return;

    }

    Swal.fire({

        title:"Clear Seating?",

        text:"This will remove all generated seating.",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Clear"

    }).then(result=>{

        if(!result.isConfirmed)
        return;

        seating=[];

        StorageManager.saveSeating([]);

        renderTable();

        updateStatistics();

        ActivityManager.addActivity(
            "Cleared Seating"
        );

        AlertManager.success(
            "Seating Cleared"
        );

    });

}

/* ==========================
   Preview
========================== */

document.getElementById("previewBtn").onclick=()=>{

    loadData();

    renderTable();

}

/* ==========================
   Export Excel
========================== */

document.getElementById("excelBtn")
.onclick=()=>{

    if(seating.length===0){

        AlertManager.warning(
            "No Data",
            "Generate seating first."
        );

        return;

    }

    const sheet =
    XLSX.utils.json_to_sheet(seating);

    const book =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        book,
        sheet,
        "Seating"
    );

    XLSX.writeFile(
        book,
        "SmartSeat_Seating.xlsx"
    );

    AlertManager.success(
        "Excel Exported Successfully"
    );

};

/* ==========================
   PDF
========================== */

document.getElementById("pdfBtn")
.onclick=()=>{

    Swal.fire({

        icon:"info",

        title:"Coming Soon",

        text:"Official Seating PDF will be added."

    });

};

/* ==========================
   Page Load
========================== */

document.addEventListener("DOMContentLoaded",()=>{

    loadData();

    loadExamList();

    updateStatistics();

    updateRollStatus();

    renderTable();

});

console.log("✅ Seating Generator Ready");