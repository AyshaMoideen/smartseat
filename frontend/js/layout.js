/* ==========================
   Login Check
========================== */

const currentPage = window.location.pathname.split("/").pop();

const publicPages = [
    "teacher-login.html",
    "index.html"
];

if (
    !publicPages.includes(currentPage) &&
    localStorage.getItem("teacherLoggedIn") !== "true"
) {
    window.location.href = "teacher-login.html";
}
/* ==========================================
   SMARTSEAT
   Layout Manager
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent("sidebar");

    await loadComponent("topbar");

/* ==========================
   Teacher Name
========================== */

const teacherElement =
document.getElementById("teacherName");

if(teacherElement){

    teacherElement.textContent =
    localStorage.getItem("teacherName")
    || "Aysha";

}

/* ==========================
   Page Title
========================== */

const pageTitle =
document.getElementById("pageTitle");

if(pageTitle){

    const file =
    window.location.pathname
    .split("/")
    .pop();

    const titles = {

        "dashboard.html":"Dashboard",

        "students.html":"Students",

        "rooms.html":"Rooms",

        "create-exam.html":"Create Exam",
  
        "seating-generator.html":"Seating",

        "nominal-roll.html": "Nominal Roll",

        "reports.html":"Reports",

        "teacher-profile.html":"Profile",

        "teacher-settings.html":"Settings"

        
    };

    pageTitle.textContent =
    titles[file] || "SmartSeat";

}

    initializeNavigation();

    initializeLogout();

});

async function loadComponent(component) {

    const container = document.getElementById(component);

    if (!container) return;

    try {

        const response = await fetch(`/frontend/components/${component}.html`);

        if (!response.ok) {
            throw new Error("Component not found");
        }

        container.innerHTML = await response.text();

    } catch (err) {

        console.error(err);

    }

}

function initializeNavigation(){

    document.querySelectorAll("[data-page]")

    .forEach(item=>{

        item.onclick=()=>{

            const routes={

                dashboard:"dashboard.html",

                students:"students.html",

                rooms:"rooms.html",

                createExam:"create-exam.html",

                nominalRoll: "nominal-roll.html",

                seating:"seating-generator.html",

                reports:"reports.html",

                profile:"teacher-profile.html",

                settings:"teacher-settings.html",

                changePassword:"change-password.html",
                
            };

            window.location.href=routes[item.dataset.page];

        };

    });

}

function initializeLogout(){

    const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", () => {

        Swal.fire({

            title: "Logout?",
            text: "Are you sure you want to logout from SmartSeat?",
            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6c757d",

            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",

            reverseButtons: true

        }).then((result) => {

            if (result.isConfirmed) {

                localStorage.removeItem("teacherLoggedIn");

                Swal.fire({

                    icon: "success",

                    title: "Logged Out",

                    text: "You have been logged out successfully.",

                    timer: 1500,

                    showConfirmButton: false

                }).then(() => {

                    window.location.href = "teacher-login.html";

                });

            }

        });

    });

}

}