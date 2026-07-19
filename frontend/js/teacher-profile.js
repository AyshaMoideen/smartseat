/* ==========================================
   SMARTSEAT
   Teacher Profile
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadTeacher();

    loadStatistics();

    loadActivities();

    initializeButtons();

});

/* ==========================
   Teacher
========================== */

function loadTeacher() {

    let teacher = JSON.parse(

        localStorage.getItem("teacherProfile")

    );

    if (!teacher) {

        teacher = {

            name: "Dr. Kareem Abdul Rahman",

            designation: "Assistant Professor",

            department: "Computer Science",

            email: "kareem@mdcgs.edu.in",

            phone: "+91 9876543210",

            employeeId: "MDCGS1024",

            qualification: "Ph.D Computer Science",

            experience: "12 Years",

            office: "B-204",

            joined: "12 June 2016",

            username: "teacher",

            college: "Malik Deenar College of Graduate Studies",

            photo: "../assets/images/default-user.png"

        };

        localStorage.setItem(

            "teacherProfile",

            JSON.stringify(teacher)

        );

    }

    set("teacherName", teacher.name);
    set("teacherDesignation", teacher.designation);
    set("teacherDepartment", teacher.department);
    set("teacherEmail", teacher.email);
    set("teacherPhone", teacher.phone);
    set("teacherEmployeeId", teacher.employeeId);
    set("teacherQualification", teacher.qualification);
    set("teacherExperience", teacher.experience);
    set("teacherOffice", teacher.office);
    set("teacherJoined", teacher.joined);
    set("teacherUsername", teacher.username);
    set("teacherCollege", teacher.college);
    set("teacherLastLogin", new Date().toLocaleString());

    const img = document.getElementById("teacherPhoto");

    if (img) {

        img.src = teacher.photo;

    }

}

/* ==========================
   Statistics
========================== */

function loadStatistics() {

    set("profileStudents",

        StorageManager.getStudents().length

    );

    set("profileRooms",

        StorageManager.getRooms().length

    );

    set("profileExams",

        StorageManager.getExams().length

    );

    set("profileAllocated",

        StorageManager.getSeating().length

    );

}

/* ==========================
   Recent Activity
========================== */

function loadActivities() {

    const body =

    document.getElementById("activityList");

    if (!body) return;

    body.innerHTML = "";

    const activities =

    ActivityManager.getActivities
    ? ActivityManager.getActivities()
    : [];

    if (activities.length === 0) {

        body.innerHTML =

        `<tr>

            <td colspan="3"

            class="text-center">

            No Recent Activity

            </td>

        </tr>`;

        return;

    }

    activities
    .slice(-10)
    .reverse()
    .forEach(activity => {

        body.innerHTML += `

        <tr>

            <td>${activity}</td>

            <td>${new Date().toLocaleDateString()}</td>

            <td>

                <span class="badge bg-success">

                    Completed

                </span>

            </td>

        </tr>

        `;

    });

}

/* ==========================
   Buttons
========================== */

function initializeButtons() {

    const edit =

    document.getElementById("editProfileBtn");

    if (edit) {

        edit.onclick = () => {

            window.location.href =

            "teacher-settings.html";

        };

    }

    const password =

    document.getElementById("changePasswordBtn");

    if (password) {

        password.onclick = () => {

            window.location.href =

            "teacher-settings.html";

        };

    }

}

/* ==========================
   Helper
========================== */

function set(id, value) {

    const el =

    document.getElementById(id);

    if (el)

        el.textContent = value;

}

console.log("✅ Teacher Profile Loaded");