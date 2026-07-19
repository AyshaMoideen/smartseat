/* ==========================================
   SMARTSEAT
   Find My Seat
========================================== */

const searchBtn = document.getElementById("searchBtn");
const registerInput = document.getElementById("registerNumber");
const resultSection = document.getElementById("resultSection");

searchBtn.addEventListener("click", findSeat);

function findSeat() {

    const regNo = registerInput.value.trim().toUpperCase();

    if (regNo === "") {

        Swal.fire({
            icon: "warning",
            title: "Register Number Required",
            text: "Please enter your Register Number.",
            confirmButtonColor: "#2563eb"
        });

        return;
    }

    const seating = StorageManager.getSeating();

    const student = seating.find(s =>
        s.regNo.toUpperCase() === regNo
    );

    if (!student) {

        Swal.fire({
            icon: "error",
            title: "Seat Not Found",
            text: "Please check your Register Number.",
            confirmButtonColor: "#2563eb"
        });

        return;
    }

    document.getElementById("studentName").textContent = student.name;
    document.getElementById("studentReg").textContent = student.regNo;
    document.getElementById("studentDept").textContent = student.department;
    document.getElementById("studentExam").textContent = student.examName;
    document.getElementById("studentRoom").textContent = student.room;
    document.getElementById("studentBench").textContent = student.bench;
    document.getElementById("studentSeat").textContent = student.seat;
    document.getElementById("studentDate").textContent = student.examDate;
    document.getElementById("studentTime").textContent = student.examTime;

    resultSection.style.display = "block";

    resultSection.scrollIntoView({
        behavior: "smooth"
    });

}
document.getElementById("printBtn").addEventListener("click", () => {

    window.print();

});
document.getElementById("resetBtn").addEventListener("click", () => {

    registerInput.value = "";

    resultSection.style.display = "none";

    registerInput.focus();

});