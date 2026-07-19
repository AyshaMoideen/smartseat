/* ==========================================
   SMARTSEAT SETTINGS
========================================== */

document.addEventListener("DOMContentLoaded",()=>{

    loadProfile();

    loadTheme();

    initializeButtons();

});

/* ==========================
   Load Profile
========================== */

function loadProfile(){

    document.getElementById("teacherName").value =
    localStorage.getItem("teacherName") || "";

    document.getElementById("teacherEmail").value =
    localStorage.getItem("teacherEmail") || "";

    document.getElementById("teacherDepartment").value =
    localStorage.getItem("teacherDepartment") || "";

    document.getElementById("teacherPhone").value =
    localStorage.getItem("teacherPhone") || "";

    document.getElementById("academicYear").value =
    localStorage.getItem("academicYear") || "2026-2027";

    document.getElementById("collegeName").value =
    localStorage.getItem("collegeName") ||
    "Malik Deenar College of Graduate Studies";

}

/* ==========================
   Save Profile
========================== */

function saveProfile(){

    localStorage.setItem(
        "teacherName",
        document.getElementById("teacherName").value.trim()
    );

    localStorage.setItem(
        "teacherEmail",
        document.getElementById("teacherEmail").value.trim()
    );

    localStorage.setItem(
        "teacherDepartment",
        document.getElementById("teacherDepartment").value.trim()
    );

    localStorage.setItem(
        "teacherPhone",
        document.getElementById("teacherPhone").value.trim()
    );

    localStorage.setItem(
        "academicYear",
        document.getElementById("academicYear").value.trim()
    );

    localStorage.setItem(
        "collegeName",
        document.getElementById("collegeName").value.trim()
    );

    ActivityManager.addActivity(
        "Updated Settings"
    );

    AlertManager.success(
        "Settings Saved Successfully"
    );

}

/* ==========================
   Dark Mode
========================== */

function loadTheme(){

    const dark =
    localStorage.getItem("darkMode");

    if(dark==="true"){

        document.body.classList.add("dark-mode");

        document.getElementById("darkMode").checked = true;

    }

}

function toggleTheme(){

    document.body.classList.toggle("dark-mode");

    const enabled =

    document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "darkMode",
        enabled
    );

}

/* ==========================
   Backup
========================== */

function backupData(){

    const data = {};

    for(let i=0;i<localStorage.length;i++){

        const key =
        localStorage.key(i);

        data[key] =
        localStorage.getItem(key);

    }

    const blob =

    new Blob(

        [

            JSON.stringify(data,null,4)

        ],

        {

            type:"application/json"

        }

    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    "SmartSeat-Backup.json";

    a.click();

    URL.revokeObjectURL(url);

    ActivityManager.addActivity(
        "Backup Downloaded"
    );

    AlertManager.success(
        "Backup Created"
    );

}

/* ==========================
   Restore
========================== */

function restoreData(){

    const input =
    document.createElement("input");

    input.type="file";

    input.accept=".json";

    input.onchange=(event)=>{

        const file =
        event.target.files[0];

        const reader =
        new FileReader();

        reader.onload=(e)=>{

            const data =

            JSON.parse(e.target.result);

            Object.keys(data).forEach(key=>{

                localStorage.setItem(

                    key,

                    data[key]

                );

            });

            ActivityManager.addActivity(
                "Backup Restored"
            );

            AlertManager.success(

                "Backup Restored"

            );

            setTimeout(()=>{

                location.reload();

            },1200);

        };

        reader.readAsText(file);

    };

    input.click();

}

/* ==========================
   Clear Data
========================== */

function clearData(){

    AlertManager.confirm(

        "Clear All Data",

        "This action cannot be undone."

    ).then(result=>{

        if(result.isConfirmed){

            localStorage.clear();

            AlertManager.success(

                "All Data Cleared"

            );

            setTimeout(()=>{

                window.location.href="../index.html";

            },1200);

        }

    });

}

/* ==========================
   Logout
========================== */

function logout(){

    AlertManager.confirm(

        "Logout",

        "Are you sure you want to logout?"

    ).then(result=>{

        if(result.isConfirmed){

            localStorage.removeItem(

                "teacherName"

            );

            window.location.href="../index.html";

        }

    });

}

/* ==========================
   Buttons
========================== */

function initializeButtons(){

    document
    .getElementById("saveSettingsBtn")
    .onclick=saveProfile;

    document
    .getElementById("backupBtn")
    .onclick=backupData;

    document
    .getElementById("restoreBtn")
    .onclick=restoreData;

    document
    .getElementById("clearDataBtn")
    .onclick=clearData;

    document
    .getElementById("logoutBtn")
    .onclick=logout;

    document
    .getElementById("darkMode")
    .onchange=toggleTheme;

    document
    .getElementById("changePasswordBtn")
    .onclick=()=>{

        AlertManager.warning(

            "Coming Soon",

            "Password management will be available in Version 2."

        );

    };

}

console.log("✅ Settings Module Loaded");