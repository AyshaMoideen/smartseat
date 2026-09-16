/* ==========================================
   SMARTSEAT
   FIND MY SEAT
   PUBLIC STUDENT SEARCH
========================================== */

const SEATING_API = "/api/seating";

const searchBtn =
    document.getElementById("searchBtn");

const registerInput =
    document.getElementById("registerNumber");

const resultSection =
    document.getElementById("resultSection");


/* ==========================================
   FIND SEAT
========================================== */

async function findSeat() {

    const regNo =
        registerInput.value
            .trim()
            .toUpperCase();


    /* --------------------------------------
       EMPTY INPUT
    -------------------------------------- */

    if (!regNo) {

        alert(
            "Please enter your register number."
        );

        registerInput.focus();

        return;
    }


    /* --------------------------------------
       LOADING STATE
    -------------------------------------- */

    searchBtn.disabled = true;

    const originalText =
        searchBtn.innerHTML;

    searchBtn.innerHTML =
        "Searching...";


    try {

        /* ----------------------------------
           SEARCH MONGODB
        ---------------------------------- */

        const response =
            await fetch(
                `${SEATING_API}/public/${encodeURIComponent(regNo)}`
            );


        const data =
            await response.json();


        /* ----------------------------------
           STUDENT NOT FOUND
        ---------------------------------- */

        if (!response.ok || !data.success) {

            resultSection.style.display =
                "none";

            alert(
                data.message ||
                "Seat not found. Please check your register number."
            );

            return;
        }


        /* ----------------------------------
           DATA FROM BACKEND
        ---------------------------------- */

        const student =
            data.student || {};

        const examination =
            data.examination || {};

        const seat =
            data.seat || {};


        /* ----------------------------------
           DISPLAY STUDENT DETAILS
        ---------------------------------- */

        document.getElementById(
            "studentName"
        ).textContent =
            student.name || "-";


        document.getElementById(
            "studentReg"
        ).textContent =
            student.registerNumber || regNo;


        document.getElementById(
            "studentDept"
        ).textContent =
            student.department || "-";


        /* ----------------------------------
           DISPLAY EXAM DETAILS
        ---------------------------------- */

        document.getElementById(
            "studentExam"
        ).textContent =
            examination.examName || "-";


        document.getElementById(
            "studentRoom"
        ).textContent =
            seat.room || "-";


        document.getElementById(
            "studentBench"
        ).textContent =
            seat.bench ?? "-";


        document.getElementById(
            "studentSeat"
        ).textContent =
            seat.seat || "-";


        /* ----------------------------------
           DATE
        ---------------------------------- */

        let examDate = "-";

        if (examination.examDate) {

            examDate =
                new Date(
                    examination.examDate
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    }
                );
        }


        document.getElementById(
            "studentDate"
        ).textContent =
            examDate;


        /* ----------------------------------
           TIME
        ---------------------------------- */

        let examTime = "-";

        if (
            examination.startTime &&
            examination.endTime
        ) {

            examTime =
                `${examination.startTime} - ${examination.endTime}`;

        }

        else if (
            examination.startTime
        ) {

            examTime =
                examination.startTime;

        }


        document.getElementById(
            "studentTime"
        ).textContent =
            examTime;


        /* ----------------------------------
           SHOW RESULT
        ---------------------------------- */

        resultSection.style.display =
            "block";


        resultSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


        console.log(
            "✅ Seat found:",
            data
        );

    }

    catch (error) {

        console.error(
            "❌ Find seat error:",
            error
        );

        resultSection.style.display =
            "none";

        alert(
            "Unable to connect to SmartSeat. Please try again."
        );

    }

    finally {

        searchBtn.disabled = false;

        searchBtn.innerHTML =
            originalText;
    }
}


/* ==========================================
   SEARCH BUTTON
========================================== */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        findSeat
    );

}


/* ==========================================
   ENTER KEY SEARCH
========================================== */

if (registerInput) {

    registerInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                findSeat();

            }

        }
    );

}


/* ==========================================
   PRINT
========================================== */

const printBtn =
    document.getElementById("printBtn");

if (printBtn) {

    printBtn.addEventListener(
        "click",
        () => {

            window.print();

        }
    );

}


/* ==========================================
   RESET
========================================== */

const resetBtn =
    document.getElementById("resetBtn");

if (resetBtn) {

    resetBtn.addEventListener(
        "click",
        () => {

            registerInput.value = "";

            resultSection.style.display =
                "none";

            registerInput.focus();

        }
    );

}