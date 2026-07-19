/* =========================================
   SMARTSEAT
   Change Password
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializePasswordValidation();

    initializeTogglePassword();

});

/* ==========================
   Elements
========================== */

const currentPassword =
document.getElementById("currentPassword");

const newPassword =
document.getElementById("newPassword");

const confirmPassword =
document.getElementById("confirmPassword");

const changeBtn =
document.getElementById("changeBtn");

const strengthFill =
document.getElementById("strengthFill");

const strengthText =
document.getElementById("strengthText");

/* Rules */

const ruleLength =
document.getElementById("ruleLength");

const ruleUpper =
document.getElementById("ruleUpper");

const ruleLower =
document.getElementById("ruleLower");

const ruleNumber =
document.getElementById("ruleNumber");

const ruleSpecial =
document.getElementById("ruleSpecial");

/* ==========================
   Password Validation
========================== */

function initializePasswordValidation(){

    newPassword.addEventListener("input",validatePassword);

    confirmPassword.addEventListener("input",validatePassword);

}

function validatePassword(){

    const password = newPassword.value;

    let score = 0;

    /* Length */

    if(password.length >= 8){

        ruleLength.classList.add("valid");

        score++;

    }else{

        ruleLength.classList.remove("valid");

    }

    /* Upper */

    if(/[A-Z]/.test(password)){

        ruleUpper.classList.add("valid");

        score++;

    }else{

        ruleUpper.classList.remove("valid");

    }

    /* Lower */

    if(/[a-z]/.test(password)){

        ruleLower.classList.add("valid");

        score++;

    }else{

        ruleLower.classList.remove("valid");

    }

    /* Number */

    if(/[0-9]/.test(password)){

        ruleNumber.classList.add("valid");

        score++;

    }else{

        ruleNumber.classList.remove("valid");

    }

    /* Special */

    if(/[!@#$%^&*(),.?":{}|<>]/.test(password)){

        ruleSpecial.classList.add("valid");

        score++;

    }else{

        ruleSpecial.classList.remove("valid");

    }

    updateStrength(score);

    checkConfirmPassword();

}

/* ==========================
   Strength Meter
========================== */

function updateStrength(score){

    let width = score * 20;

    strengthFill.style.width = width + "%";

    if(score <= 2){

        strengthFill.style.background = "#ef4444";

        strengthText.innerText = "Weak Password";

    }

    else if(score <=4){

        strengthFill.style.background = "#f59e0b";

        strengthText.innerText = "Medium Password";

    }

    else{

        strengthFill.style.background = "#10B981";

        strengthText.innerText = "Strong Password";

    }

}

/* ==========================
   Confirm Password
========================== */

function checkConfirmPassword(){

    if(

        newPassword.value === confirmPassword.value &&

        newPassword.value.length>0

    ){

        confirmPassword.style.borderColor="#10B981";

        enableButton();

    }

    else{

        confirmPassword.style.borderColor="#ef4444";

        changeBtn.disabled=true;

    }

}

function enableButton(){

    const password = newPassword.value;

    const valid =

        password.length>=8 &&

        /[A-Z]/.test(password) &&

        /[a-z]/.test(password) &&

        /[0-9]/.test(password) &&

        /[!@#$%^&*(),.?":{}|<>]/.test(password);

    changeBtn.disabled=!valid;

}

/* ==========================
   Show Password
========================== */

function initializeTogglePassword(){

    const buttons=document.querySelectorAll(".toggle-password");

    buttons.forEach(button=>{

        button.addEventListener("click",()=>{

            const input=button.previousElementSibling;

            const icon=button.querySelector("i");

            if(input.type==="password"){

                input.type="text";

                icon.className="bi bi-eye-slash";

            }

            else{

                input.type="password";

                icon.className="bi bi-eye";

            }

        });

    });

}

/* ==========================
   Save Password
========================== */

document.getElementById("passwordForm")

.addEventListener("submit",function(e){

    e.preventDefault();

    if(changeBtn.disabled){

        return;

    }

    localStorage.setItem(

        "teacherPassword",

        newPassword.value

    );

    showToast(

        "Password Updated Successfully"

    );

    this.reset();

    strengthFill.style.width="0%";

    strengthText.innerText="Password Strength";

    changeBtn.disabled=true;

});

/* ==========================
   Toast
========================== */

function showToast(message){

    const toast=document.createElement("div");

    toast.className="smart-toast";

    toast.innerHTML=`<i class="bi bi-check-circle-fill"></i> ${message}`;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.classList.add("show");

    },100);

    setTimeout(()=>{

        toast.classList.remove("show");

    },2800);

    setTimeout(()=>{

        toast.remove();

    },3300);

}

console.log("SmartSeat Change Password Ready");