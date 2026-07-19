/* ==========================================
   SMARTSEAT DASHBOARD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    DashboardManager.render();

    loadTeacher();

    loadRecentActivity();

    loadCharts();

    initializeButtons();

});

/* ==========================================
   Teacher
========================================== */

function loadTeacher(){

    const teacherName =

        localStorage.getItem("teacherName")

        ||

        "Teacher";

    const teacherElement =

        document.getElementById("teacherName");

    if(teacherElement){

        teacherElement.textContent =

        teacherName;

    }

}

/* ==========================================
   Recent Activity
========================================== */

function loadRecentActivity(){

    const table =

        document.getElementById("activityTable");

    if(!table) return;

    table.innerHTML = "";

    const exams =

        DashboardManager.getRecentExams();

    if(exams.length===0){

        table.innerHTML = `

        <tr>

            <td colspan="3" class="text-center">

                No Recent Activity

            </td>

        </tr>

        `;

        return;

    }

    exams.forEach(exam=>{

        table.innerHTML += `

        <tr>

            <td>${exam.name}</td>

            <td>${exam.date}</td>

            <td>

                <span class="badge bg-success">

                    Created

                </span>

            </td>

        </tr>

        `;

    });

}

/* ==========================================
   Buttons
========================================== */

function initializeButtons(){

    const routes={

        createExamBtn:"create-exam.html",

        uploadExcelBtn:"students.html",

        manualEntryBtn:"students.html",

        manageRoomsBtn:"rooms.html",

        generateBtn:"seating-generator.html",

        reportBtn:"reports.html"

    };

    Object.keys(routes).forEach(id=>{

        const btn=

        document.getElementById(id);

        if(btn){

            btn.onclick=()=>{

                window.location.href=

                routes[id];

            };

        }

    });

}

console.log("✅ Dashboard Loaded");

let departmentChart;
let capacityChart;

function loadCharts(){

    const departmentCanvas =
    document.getElementById("departmentChart");

    const capacityCanvas =
    document.getElementById("capacityChart");

    if(!departmentCanvas || !capacityCanvas){

        return;

    }

    const students =
    StorageManager.getStudents();

    const rooms =
    StorageManager.getRooms();

    const departments = {};

    students.forEach(student=>{

        departments[student.department] =

        (departments[student.department] || 0) + 1;

    });

    if(departmentChart){

        departmentChart.destroy();

    }

    if(capacityChart){

        capacityChart.destroy();

    }

    departmentChart = new Chart(

        departmentCanvas,

        {

            type:"bar",

            data:{

                labels:Object.keys(departments),

                datasets:[{

                    label:"Students",

                    data:Object.values(departments),

                    backgroundColor:"#1D8EF7",

                    borderRadius:8

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        display:false

                    }

                }

            }

        }

    );

    const roomLabels = [];

    const capacities = [];

    rooms.forEach(room=>{

        roomLabels.push(room.name);

        capacities.push(Number(room.capacity));

    });

    capacityChart = new Chart(

        capacityCanvas,

        {

            type:"doughnut",

            data:{

                labels:roomLabels,

                datasets:[{

                    data:capacities,

                    backgroundColor:[

                        "#1D8EF7",

                        "#16C47F",

                        "#FFC107",

                        "#EF4444",

                        "#6F42C1",

                        "#20C997",

                        "#0B2D5C"

                    ]

                }]

            },

            options:{

                responsive:true

            }

        }

    );

}