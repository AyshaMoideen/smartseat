// =====================================
// SMARTSEAT LOGIN PAGE
// teacher-login.js
// =====================================

// ------------------------------
// Show / Hide Password
// ------------------------------

const password = document.getElementById("teacherPassword");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    const type =
        password.getAttribute("type") === "password"
            ? "text"
            : "password";

    password.setAttribute("type", type);

    togglePassword.classList.toggle("bi-eye");
    togglePassword.classList.toggle("bi-eye-slash");

});

// ------------------------------
// Login Form
// ------------------------------

const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const teacherEmail = document
        .getElementById("teacherEmail")
        .value
        .trim();

    const teacherPassword = document
        .getElementById("teacherPassword")
        .value
        .trim();

    // ------------------------------
    // Validation
    // ------------------------------

    if (teacherEmail === "") {

        Swal.fire({
            icon: "warning",
            title: "Email Required",
            text: "Please enter your email."
        });

        return;

    }

    if (teacherPassword === "") {

        Swal.fire({
            icon: "warning",
            title: "Password Required",
            text: "Please enter your password."
        });

        return;

    }

    // ------------------------------
    // Disable Button
    // ------------------------------

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.disabled = true;
    loginBtn.innerHTML = "Logging in...";

    try {

        const response = await fetch("http://localhost:5000/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: teacherEmail,
                password: teacherPassword

            })

        });

        const data = await response.json();

        if (data.success) {

            // Save JWT

            localStorage.setItem("token", data.token);

            localStorage.setItem("teacherName", data.teacher.name);

            localStorage.setItem("teacherEmail", data.teacher.email);

            localStorage.setItem("teacherLoggedIn", "true");

            await Swal.fire({

                icon: "success",

                title: "Welcome",

                text: `Welcome ${data.teacher.name}!`,

                timer: 1500,

                showConfirmButton: false

            });

            window.location.href = "dashboard.html";

        }

        else {

            Swal.fire({

                icon: "error",

                title: "Login Failed",

                text: data.message

            });

        }

    }

    catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Server Error",

            text: "Unable to connect to SmartSeat server."

        });

    }

    finally {

        loginBtn.disabled = false;

        loginBtn.innerHTML = "LOGIN";

    }

});

// ------------------------------
// Enter Key Support
// ------------------------------

document.addEventListener("keydown", function (e) {

    if (e.key === "Enter") {

        form.requestSubmit();

    }

});

// ------------------------------
// Welcome Animation
// ------------------------------

window.addEventListener("load", () => {

    document.body.style.opacity = "1";

});

console.log("✅ SmartSeat Login Ready");