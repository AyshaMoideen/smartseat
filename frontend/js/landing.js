/* ==========================================
   SMARTSEAT
   PUBLIC LANDING PAGE
   MongoDB Version
========================================== */

const STUDENTS_API = "http://localhost:5000/api/students";
const ROOMS_API = "http://localhost:5000/api/rooms";
const EXAMS_API = "http://localhost:5000/api/exams";

document.addEventListener("DOMContentLoaded", () => {

    updateDashboard();

    // Refresh statistics every 30 seconds
    setInterval(updateDashboard, 30000);

});


/* ==========================================
   UPDATE LANDING PAGE STATISTICS
========================================== */

async function updateDashboard() {

    try {

        const token =
            localStorage.getItem("token");

        const headers = {
            "Content-Type": "application/json"
        };

        // Use teacher token when available.
        // This allows the page to show live MongoDB
        // data while testing from the teacher browser.
        if (token) {

            headers.Authorization =
                `Bearer ${token}`;

        }


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
            extractArray(
                studentsData,
                "students"
            );

        const rooms =
            extractArray(
                roomsData,
                "rooms"
            );

        const exams =
            extractArray(
                examsData,
                "exams"
            );


        /*
         * Generated seating is currently saved
         * after generation under this key.
         */
        const seating =
            getGeneratedSeating();


        console.log(
            "SmartSeat Landing Statistics:",
            {
                students: students.length,
                rooms: rooms.length,
                examinations: exams.length,
                seatsGenerated: seating.length
            }
        );


        animateCounter(
            "studentCount",
            students.length
        );

        animateCounter(
            "roomCount",
            rooms.length
        );

        animateCounter(
            "examCount",
            exams.length
        );

        animateCounter(
            "seatCount",
            seating.length
        );


        const lastUpdated =
            document.getElementById(
                "lastUpdated"
            );

        if (lastUpdated) {

            lastUpdated.textContent =
                new Date().toLocaleTimeString();

        }


    } catch (error) {

        console.error(
            "SmartSeat Landing Error:",
            error
        );

    }

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

            return [];

        }


        const data =
            JSON.parse(saved);


        if (
            data &&
            Array.isArray(data.seating)
        ) {

            return data.seating;

        }


        return [];


    } catch (error) {

        console.error(
            "Unable to read generated seating:",
            error
        );

        return [];

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
   ANIMATE COUNTER
========================================== */

function animateCounter(id, target) {

    const element =
        document.getElementById(id);

    if (!element) return;


    const current =
        parseInt(
            element.innerText
        ) || 0;


    if (current === target) {

        return;

    }


    const increment =
        target > current
            ? 1
            : -1;


    let value = current;


    const timer =
        setInterval(() => {

            value += increment;

            element.innerText =
                value;


            if (value === target) {

                clearInterval(timer);

            }

        }, 10);

}