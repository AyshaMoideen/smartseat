/* ==========================================
   SMARTSEAT
   DASHBOARD
   MongoDB Version
========================================== */

const STUDENTS_API = "http://localhost:5000/api/students";
const ROOMS_API = "http://localhost:5000/api/rooms";
const EXAMS_API = "http://localhost:5000/api/exams";

const token = localStorage.getItem("token");


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadTeacher();

    loadDashboard();

    initializeButtons();

});


/* ==========================================
   TEACHER
========================================== */

function loadTeacher() {

    const teacherName =
        localStorage.getItem("teacherName") || "Teacher";

    const element =
        document.getElementById("teacherName");

    if (element) {

        element.textContent = teacherName;

    }

}


/* ==========================================
   LOAD DASHBOARD
========================================== */

async function loadDashboard() {

    try {

        const headers = {

            "Content-Type": "application/json",

            "Authorization": `Bearer ${token}`

        };


        const [
            studentsResponse,
            roomsResponse,
            examsResponse
        ] = await Promise.all([

            fetch(STUDENTS_API, {
                headers
            }),

            fetch(ROOMS_API, {
                headers
            }),

            fetch(EXAMS_API, {
                headers
            })

        ]);


        if (!studentsResponse.ok) {

            throw new Error("Unable to load students");

        }

        if (!roomsResponse.ok) {

            throw new Error("Unable to load rooms");

        }

        if (!examsResponse.ok) {

            throw new Error("Unable to load examinations");

        }


        const studentsData =
            await studentsResponse.json();

        const roomsData =
            await roomsResponse.json();

        const examsData =
            await examsResponse.json();


        const students =
            extractArray(studentsData, "students");

        const rooms =
            extractArray(roomsData, "rooms");

        const exams =
            extractArray(examsData, "exams");


        console.log("Dashboard Students:", students);
        console.log("Dashboard Rooms:", rooms);
        console.log("Dashboard Exams:", exams);


        const generatedReport =
    getGeneratedSeating();

const seating =
    generatedReport.seating;

updateStatistics(
    students,
    rooms,
    exams,
    seating
);


        /* Dashboard sections */

        renderDepartments(students);

        renderRooms(rooms);

        renderExams(exams);


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        showDashboardError(
            "Unable to load dashboard data."
        );

    }

}


/* ==========================================
   EXTRACT ARRAY
========================================== */

function extractArray(data, key) {

    if (Array.isArray(data)) {

        return data;

    }

    if (
        data &&
        Array.isArray(data[key])
    ) {

        return data[key];

    }

    if (
        data &&
        Array.isArray(data.data)
    ) {

        return data.data;

    }

    return [];

}

/* ==========================================
   GET GENERATED SEATING
========================================== */

function getGeneratedSeating() {

    try {

        const saved =
            localStorage.getItem(
                "smartseatGeneratedReport"
            );

        if (!saved) {

            return {
                seating: []
            };

        }

        const data =
            JSON.parse(saved);

        return {

            seating:
                Array.isArray(data.seating)
                    ? data.seating
                    : []

        };

    } catch (error) {

        console.error(
            "Unable to read generated seating:",
            error
        );

        return {
            seating: []
        };

    }

}
/* ==========================================
   STATISTICS
========================================== */

function updateStatistics(
    students,
    rooms,
    exams,
    seating
) {

    const studentCount =
        document.getElementById("studentCount");

    const roomCount =
        document.getElementById("roomCount");

    const examCount =
        document.getElementById("examCount");

    const seatingCount =
        document.getElementById("seatingCount");


    if (studentCount) {

        studentCount.textContent =
            students.length;

    }


    if (roomCount) {

        roomCount.textContent =
            rooms.length;

    }


    if (examCount) {

        examCount.textContent =
            exams.length;

    }

    if (seatingCount) {

    seatingCount.textContent =
        Array.isArray(seating)
            ? seating.length
            : 0;

}
}

/* ==========================================
   STUDENTS BY DEPARTMENT
========================================== */

function renderDepartments(students) {

    const container =
        findOverviewContainer(
            "Students by Department"
        );

    if (!container) {

        console.warn(
            "Students by Department container not found"
        );

        return;

    }


    const departments = {};


    students.forEach(student => {

        let department =
            student.department || "Unknown";


        const normalized =
            department
                .toUpperCase()
                .replace(/\s+/g, "");


        if (
            normalized === "BCOMCA" ||
            normalized === "BCOM.CA"
        ) {

            department = "BCOM.CA";

        }

        else if (
            normalized === "BCOMCP" ||
            normalized === "BCOM.CP"
        ) {

            department = "BCOM.CP";

        }


        departments[department] =
            (departments[department] || 0) + 1;

    });


    const departmentNames =
        Object.keys(departments);


    if (departmentNames.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No students available
            </div>
        `;

        return;

    }


    container.innerHTML = `

        <div class="department-list">

            ${departmentNames.map(department => `

                <div class="dashboard-item">

                    <div>

                        <strong>
                            ${department}
                        </strong>

                        <span>
                            Students
                        </span>

                    </div>

                    <div class="dashboard-number">
                        ${departments[department]}
                    </div>

                </div>

            `).join("")}

        </div>

    `;

}

/* ==========================================
   ROOM OVERVIEW
========================================== */
function renderRooms(rooms) {

    const container =
        findOverviewContainer(
            "Room Overview"
        );

    if (!container) {

        console.warn(
            "Room Overview container not found"
        );

        return;

    }


    if (rooms.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No rooms available
            </div>
        `;

        return;

    }


    container.innerHTML = `

        <div class="room-list">

            ${rooms.map(room => {

                const roomNumber =
                    room.roomNumber ||
                    room.name ||
                    "Room";


                const capacity =
                    room.maxCapacity ||
                    room.capacity ||
                    0;


                const status =
                    room.isActive === false
                        ? "Inactive"
                        : "Active";


                return `

                    <div class="dashboard-item">

                        <div>

                            <strong>
                                Room ${roomNumber}
                            </strong>

                            <span>
                                Capacity: ${capacity}
                            </span>

                        </div>

                        <span class="room-status">
                            ${status}
                        </span>

                    </div>

                `;

            }).join("")}

        </div>

    `;

}

/* ==========================================
   EXAMINATION OVERVIEW
========================================== */

function renderExams(exams) {

    const container =
        document.getElementById(
            "examOverview"
        );

    if (!container) return;


    if (exams.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No examinations created
            </div>
        `;

        return;

    }


    container.innerHTML =
        exams
            .slice()
            .reverse()
            .slice(0, 5)
            .map(exam => {

                return `

                    <div class="dashboard-item">

                        <div>

                            <strong>
                                ${exam.examName || "Examination"}
                            </strong>

                            <span>
                                ${exam.subjectName || ""}
                            </span>

                        </div>

                        <span>
                            ${formatDate(exam.examDate)}
                        </span>

                    </div>

                `;

            }).join("");

}


/* ==========================================
   DATE FORMAT
========================================== */

function formatDate(date) {

    if (!date) return "-";


    const d =
        new Date(date);


    if (isNaN(d.getTime())) {

        return date;

    }


    return d.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

/* ==========================================
   FIND DASHBOARD OVERVIEW CONTAINER
========================================== */

function findOverviewContainer(title) {

    const cards =
        document.querySelectorAll(".dashboard-card");

    for (const card of cards) {

        const heading =
            card.querySelector("h4");

        if (
            heading &&
            heading.textContent
                .trim()
                .toLowerCase()
                .includes(title.toLowerCase())
        ) {

            /*
             Find the element containing
             the loading message.
            */

            const elements =
                card.querySelectorAll("*");

            for (const element of elements) {

                if (
                    element.children.length === 0 &&
                    element.textContent
                        .trim()
                        .toLowerCase()
                        .includes("loading")
                ) {

                    return element;

                }

            }

            /*
             If no loading element exists,
             use the card itself.
            */

            return card;

        }

    }

    return null;

}
/* ==========================================
   ERROR
========================================== */

function showDashboardError(message) {

    console.error(message);

}


/* ==========================================
   QUICK ACTIONS
========================================== */

function initializeButtons() {

    const routes = {

        createExamBtn:
            "create-exam.html",

        uploadExcelBtn:
            "nominal-roll.html",

        manualEntryBtn:
            "students.html",

        manageRoomsBtn:
            "rooms.html",

        generateBtn:
            "seating-generator.html",

        reportBtn:
            "reports.html"

    };


    Object.keys(routes).forEach(id => {

        const button =
            document.getElementById(id);


        if (button) {

            button.onclick = () => {

                window.location.href =
                    routes[id];

            };

        }

    });

}


console.log(
    "✅ SmartSeat Dashboard Loaded"
);