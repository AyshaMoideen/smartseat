/* ==========================================
   SMARTSEAT REPORTS
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    loadStatistics();

    loadReportHistory();

    initializeButtons();

});

/* ==========================
   Statistics
========================== */

function loadStatistics(){

    const students =
    StorageManager.getStudents();

    const rooms =
    StorageManager.getRooms();

    const seating =
    StorageManager.getSeating();

    document.getElementById("reportStudents").textContent =
    students.length;

    document.getElementById("reportRooms").textContent =
    rooms.length;

    document.getElementById("reportSeated").textContent =
    seating.length;

    let capacity = 0;

    rooms.forEach(room=>{

        capacity += Number(room.capacity);

    });

    document.getElementById("reportCapacity").textContent =
    capacity;

    document.getElementById("remainingSeats").textContent =
    capacity - seating.length;

}

/* ==========================
   Report History
========================== */

function loadReportHistory(){

    const table =
    document.getElementById("reportHistory");

    if(!table) return;

    table.innerHTML = "";

    const activities =
    ActivityManager.getActivities();

    const reports =
    activities.filter(activity=>

    activity.action.toLowerCase().includes("pdf")

    ||

    activity.action.toLowerCase().includes("report")

);

    if(reports.length===0){

        table.innerHTML = `

        <tr>

            <td colspan="3"

            class="text-center">

                No Reports Generated

            </td>

        </tr>

        `;

        return;

    }

    reports.reverse().forEach(report=>{

        table.innerHTML += `

        <tr>

            <td>${report.date}</td>

            <td>${report.action}</td>

            <td>

                <span class="badge bg-success">

                    Generated

                </span>

            </td>

        </tr>

        `;

    });

}

/* ==========================
   Buttons
========================== */

function initializeButtons(){

    const seatingBtn =
    document.getElementById(
        "downloadSeatingPdf"
    );

    const officialBtn =
    document.getElementById(
        "downloadOfficialPdf"
    );

    const excelBtn =
    document.getElementById(
        "downloadExcel"
    );

    if(seatingBtn){

        seatingBtn.onclick = ()=>{

            ActivityManager.addActivity(

                "Seating PDF Downloaded"

            );

            AlertManager.success(

                "Seating PDF",

                "Please download it from the Seating Generator page."

            );

        };

    }

    if(officialBtn){

        officialBtn.onclick = ()=>{

            ActivityManager.addActivity(

                "Official Room PDF Downloaded"

            );

            AlertManager.success(

                "Official Room PDF",

                "Please download it from the Seating Generator page."

            );

        };

    }

    if(excelBtn){

        excelBtn.onclick = ()=>{

            exportExcel();

        };

    }

}

/* ==========================
   Excel Export
========================== */

function exportExcel(){

    const seating =
    StorageManager.getSeating();

    if(seating.length===0){

        AlertManager.warning(

            "No Seating Data",

            "Generate seating first."

        );

        return;

    }

    let csv =

    "Room,Bench,Seat,Register Number,Department\n";

    seating.forEach(student=>{

        csv +=

        `${student.room},${student.bench},${student.seat},${student.regNo},${student.department}\n`;

    });

    const blob =

    new Blob(

        [csv],

        {

            type:"text/csv"

        }

    );

    const url =

    window.URL.createObjectURL(blob);

    const a =

    document.createElement("a");

    a.href = url;

    a.download =

    "SmartSeat_Report.csv";

    a.click();

    window.URL.revokeObjectURL(url);

    ActivityManager.addActivity(

        "Excel Report Downloaded"

    );

    AlertManager.success(

        "Excel Exported Successfully"

    );

}

console.log("✅ Reports Module Loaded");