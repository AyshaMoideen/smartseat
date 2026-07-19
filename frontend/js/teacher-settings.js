/* =========================================
   SMARTSEAT
   Teacher Settings
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadProfile();

});

/* ==========================
   Elements
========================== */

const form = document.getElementById("profileForm");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("email");

const phoneInput = document.getElementById("phone");

const departmentInput = document.getElementById("department");

const qualificationInput = document.getElementById("qualification");

const officeInput = document.getElementById("office");

const addressInput = document.getElementById("address");

/* ==========================
   Load Profile
========================== */

function loadProfile() {

    const teacher = JSON.parse(

        localStorage.getItem("teacherProfile")

    );

    if (!teacher) return;

    nameInput.value = teacher.name;

    emailInput.value = teacher.email;

    phoneInput.value = teacher.phone;

    departmentInput.value = teacher.department;

    qualificationInput.value = teacher.qualification;

    officeInput.value = teacher.office;

    addressInput.value = teacher.address;

}

/* ==========================
   Save Profile
========================== */

form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (
    nameInput.value.trim() === "" ||
    emailInput.value.trim() === "" ||
    phoneInput.value.trim() === ""
) {

    Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all required fields.",
        confirmButtonColor: "#2563eb"
    });

    return;
}

    const teacher = {

        name: nameInput.value,

        email: emailInput.value,

        phone: phoneInput.value,

        department: departmentInput.value,

        qualification: qualificationInput.value,

        office: officeInput.value,

        address: addressInput.value

    };

    localStorage.setItem(

        "teacherProfile",

        JSON.stringify(teacher)

    );

    Swal.fire({

    icon: "success",

    title: "Profile Updated!",

    text: "Your account settings have been updated successfully.",

    confirmButtonColor: "#2563eb"

}).then(() => {

    window.location.href = "teacher-profile.html";

});

});

/* ==========================
   Sidebar Navigation
========================== */

const menuItems = document.querySelectorAll(".sidebar ul li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i =>

            i.classList.remove("active")

        );

        item.classList.add("active");

    });

});

/* ==========================
   Future MongoDB API
========================== */

// fetch("/api/teacher/profile")
// .then(res => res.json())
// .then(data => console.log(data));

console.log("Teacher Settings Ready");