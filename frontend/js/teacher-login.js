// =====================================
// SMARTSEAT LOGIN PAGE
// login.js
// =====================================

// Show / Hide Password

const password = document.getElementById("teacherPassword");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    const type = password.getAttribute("type") === "password"
        ? "text"
        : "password";

    password.setAttribute("type", type);

    if (type === "password") {

        togglePassword.classList.remove("bi-eye-slash");
        togglePassword.classList.add("bi-eye");

    } else {

        togglePassword.classList.remove("bi-eye");
        togglePassword.classList.add("bi-eye-slash");

    }

});


// =====================================
// Login Validation
// =====================================

const form = document.querySelector("form");

form.addEventListener("submit", function(e){

    e.preventDefault();

const teacherID = 
document.getElementById("teacherId")
.value
.trim();

const teacherPassword =
document.getElementById("teacherPassword")
.value
.trim();

    if(teacherID === ""){

        Swal.fire({

icon:"warning",

title:"Teacher ID",

text:"Please enter Teacher ID"

});

        return;

    }

    if(teacherPassword === ""){

        Swal.fire({

icon:"warning",

title:"Password",

text:"Please enter Password"

});

        return;

    }

    // Demo Login

    if(teacherID === "admin" && teacherPassword === "1234"){

       Swal.fire({
    icon:"success",
    title:"Welcome",
    text:"Login Successful"

}).then(()=>{

    localStorage.setItem("teacherLoggedIn","true");

    localStorage.setItem(
        "teacherName",
        "Dr. Kareem Abdul Rahman"
    );
    console.log("Redirecting...");
    window.location.href="dashboard.html";

});
    }

    else{

        Swal.fire({

icon:"error",

title:"Login Failed",

text:"Invalid Teacher ID or Password"

});

    }

});


// =====================================
// Enter Key Support
// =====================================

document.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        form.requestSubmit();

    }

});


// =====================================
// Welcome Animation
// =====================================

window.addEventListener("load",()=>{

    document.body.style.opacity="1";

});


// =====================================
// Future Backend
// =====================================

// Later this login will connect with
// Node.js + MongoDB

console.log("SmartSeat Login Ready");