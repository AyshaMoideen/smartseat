// ==========================================
// SmartSeat - Exam Management
// ==========================================

const API_URL = "http://localhost:5000/api/exams";

const token = localStorage.getItem("token");

let exams = [];
let editExamId = null;

const examModal = new bootstrap.Modal(
    document.getElementById("examModal")
);

// ==========================================
// Load Exams
// ==========================================

async function loadExams() {

    try {

        const response = await fetch(API_URL, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        if (!response.ok) {

            throw new Error("Failed to load exams");

        }

        exams = await response.json();

        renderTable();

        updateStatistics();

    }

    catch (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Unable to load exams.",
            "error"
        );

    }

}

// ==========================================
// Render Table
// ==========================================

function renderTable(data = exams) {

    const table = document.getElementById("examTable");

    table.innerHTML = "";

    data.forEach(exam => {

        table.innerHTML += `

<tr>

<td>${exam.examName}</td>

<td>

<strong>${exam.subjectCode}</strong>

<br>

<small>${exam.subjectName}</small>

</td>

<td>

Semester ${exam.semester}

</td>

<td>

${new Date(exam.examDate).toLocaleDateString()}

</td>

<td>

${exam.session}

</td>

<td>

<span class="badge ${exam.status ? "bg-success" : "bg-secondary"}">

${exam.status ? "Active" : "Inactive"}

</span>

</td>

<td>

<button
class="btn btn-sm btn-warning editBtn"
data-id="${exam._id}">

<i class="bi bi-pencil-fill"></i>

</button>

<button
class="btn btn-sm btn-danger deleteBtn"
data-id="${exam._id}">

<i class="bi bi-trash-fill"></i>

</button>

</td>

</tr>

`;

    });

}

// ==========================================
// Statistics
// ==========================================

function updateStatistics() {

    const today = new Date().toDateString();

    const upcoming = exams.filter(exam =>

        new Date(exam.examDate) > new Date()

    ).length;

    const todayCount = exams.filter(exam =>

        new Date(exam.examDate).toDateString() === today

    ).length;

    const completed = exams.filter(exam =>

        new Date(exam.examDate) < new Date()

    ).length;

    document.getElementById("totalExams").textContent =
        exams.length;

    document.getElementById("upcomingExams").textContent =
        upcoming;

    document.getElementById("todayExams").textContent =
        todayCount;

    document.getElementById("completedExams").textContent =
        completed;

    document.getElementById("summaryExams").textContent =
        exams.length;

    document.getElementById("summaryUpcoming").textContent =
        upcoming;

    document.getElementById("summaryToday").textContent =
        todayCount;

    document.getElementById("summaryCompleted").textContent =
        completed;

}

// ==========================================
// Initial Load
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadExams();

});
// ==========================================
// Open Add Exam Modal
// ==========================================

document.getElementById("addExamBtn").addEventListener("click", () => {

    editExamId = null;

    document.querySelector(".modal-title").innerHTML = `
        <i class="bi bi-journal-plus"></i>
        Add Exam
    `;

    document.getElementById("saveExamBtn").textContent = "Save Exam";

    document.getElementById("examName").value = "";
    document.getElementById("subjectCode").value = "";
    document.getElementById("subjectName").value = "";
    document.getElementById("semester").value = "1";
    document.getElementById("examDate").value = "";
    document.getElementById("session").value = "Morning";
    document.getElementById("duration").value = "3 Hours";
    document.getElementById("examStatus").value = "true";

    document.querySelectorAll(".department").forEach(box => {
        box.checked = false;
    });

    examModal.show();

});

// ==========================================
// Save Exam
// ==========================================

document.getElementById("saveExamBtn").addEventListener("click", saveExam);

async function saveExam() {

    const departments = [];

    document.querySelectorAll(".department:checked").forEach(box => {
        departments.push(box.value);
    });

    const examData = {

        examName: document.getElementById("examName").value.trim(),
        subjectCode: document.getElementById("subjectCode").value.trim(),
        subjectName: document.getElementById("subjectName").value.trim(),
        semester: Number(document.getElementById("semester").value),
        departments,
        examDate: document.getElementById("examDate").value,
        session: document.getElementById("session").value,
        duration: document.getElementById("duration").value,
        status: document.getElementById("examStatus").value === "true"

    };

    if (
        !examData.examName ||
        !examData.subjectCode ||
        !examData.subjectName ||
        !examData.examDate
    ) {

        Swal.fire(
            "Validation Error",
            "Please fill all required fields.",
            "warning"
        );

        return;

    }

    try {

        let url = API_URL;
        let method = "POST";

        if (editExamId) {

            url = `${API_URL}/${editExamId}`;
            method = "PUT";

        }

        const response = await fetch(url, {

            method,

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify(examData)

        });

        if (!response.ok) {

            throw new Error("Save failed");

        }

        examModal.hide();

        Swal.fire(
            "Success",
            editExamId ? "Exam updated successfully." : "Exam added successfully.",
            "success"
        );

        loadExams();

    }

    catch (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Unable to save exam.",
            "error"
        );

    }

}
// ==========================================
// Edit & Delete Buttons
// ==========================================

document.getElementById("examTable").addEventListener("click", async (e) => {

    const id = e.target.closest("button")?.dataset.id;

    if (!id) return;

    // ----------------------------
    // Edit Exam
    // ----------------------------

    if (e.target.closest(".editBtn")) {

        const exam = exams.find(item => item._id === id);

        if (!exam) return;

        editExamId = id;

        document.querySelector(".modal-title").innerHTML = `
            <i class="bi bi-pencil-fill"></i>
            Edit Exam
        `;

        document.getElementById("saveExamBtn").textContent = "Update Exam";

        document.getElementById("examName").value = exam.examName;
        document.getElementById("subjectCode").value = exam.subjectCode;
        document.getElementById("subjectName").value = exam.subjectName;
        document.getElementById("semester").value = exam.semester;
        document.getElementById("examDate").value =
            exam.examDate.substring(0, 10);
        document.getElementById("session").value = exam.session;
        document.getElementById("duration").value = exam.duration;
        document.getElementById("examStatus").value =
            exam.status ? "true" : "false";

        document.querySelectorAll(".department").forEach(box => {
            box.checked = exam.departments.includes(box.value);
        });

        examModal.show();

    }

    // ----------------------------
    // Delete Exam
    // ----------------------------

    if (e.target.closest(".deleteBtn")) {

        const result = await Swal.fire({

            title: "Delete Exam?",

            text: "This action cannot be undone.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Delete"

        });

        if (!result.isConfirmed) return;

        try {

            const response = await fetch(`${API_URL}/${id}`, {

                method: "DELETE",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

            if (!response.ok) {

                throw new Error("Delete failed");

            }

            Swal.fire(
                "Deleted",
                "Exam deleted successfully.",
                "success"
            );

            loadExams();

        }

        catch (error) {

            console.error(error);

            Swal.fire(
                "Error",
                "Unable to delete exam.",
                "error"
            );

        }

    }

});

// ==========================================
// Search Exams
// ==========================================

document.getElementById("searchExam").addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const filtered = exams.filter(exam =>

        exam.examName.toLowerCase().includes(keyword) ||

        exam.subjectCode.toLowerCase().includes(keyword) ||

        exam.subjectName.toLowerCase().includes(keyword)

    );

    renderTable(filtered);

});
// ==========================================
// Export Exams to CSV
// ==========================================

document.getElementById("exportExamsBtn").addEventListener("click", () => {

    if (exams.length === 0) {

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
            "Subject Code",
            "Subject Name",
            "Semester",
            "Exam Date",
            "Session",
            "Duration",
            "Departments",
            "Status"
        ]

    ];

    exams.forEach(exam => {

        rows.push([

            exam.examName,
            exam.subjectCode,
            exam.subjectName,
            exam.semester,
            exam.examDate.substring(0, 10),
            exam.session,
            exam.duration,
            exam.departments.join(", "),
            exam.status ? "Active" : "Inactive"

        ]);

    });

    const csv = rows.map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "exams.csv";

    a.click();

    URL.revokeObjectURL(url);

});

// ==========================================
// Clear All Exams
// ==========================================

document.getElementById("clearExamsBtn").addEventListener("click", async () => {

    const result = await Swal.fire({

        title: "Delete All Exams?",

        text: "This will permanently remove every exam.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Delete All"

    });

    if (!result.isConfirmed) return;

    try {

        for (const exam of exams) {

            await fetch(`${API_URL}/${exam._id}`, {

                method: "DELETE",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            });

        }

        Swal.fire(
            "Success",
            "All exams deleted successfully.",
            "success"
        );

        loadExams();

    }

    catch (error) {

        console.error(error);

        Swal.fire(
            "Error",
            "Unable to clear exams.",
            "error"
        );

    }

});