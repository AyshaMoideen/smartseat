/* =====================================
   SMARTSEAT
   Student Management
===================================== */

const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");

let departments = JSON.parse(localStorage.getItem("departments")) || [];

// ===========================
// Render Table
// ===========================

function renderTable(){

    table.innerHTML = "";

    departments.forEach((dept,index)=>{

        table.innerHTML += `

        <tr>

            <td>${dept.department}</td>

            <td>${dept.count}</td>

            <td>${dept.prefix}</td>

            <td>

                <button
                class="edit-btn"
                onclick="editDepartment(${index})">

                Edit

                </button>

                <button
                class="delete-btn"
                onclick="deleteDepartment(${index})">

                Delete

                </button>

            </td>

        </tr>

        `;

    });

    updateStatistics();

    saveData();

}

// ===========================
// Save Local Storage
// ===========================

function saveData(){

    localStorage.setItem(

        "departments",

        JSON.stringify(departments)

    );

}

// ===========================
// Add Department
// ===========================

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const department =
    document.getElementById("department").value.trim();

    const count =
    document.getElementById("count").value;

    const prefix =
    document.getElementById("prefix").value.trim();

    if(department==="" || count==="" || prefix===""){

        alert("Please fill all fields.");

        return;

    }

    departments.push({

        department,
        count,
        prefix

    });

    renderTable();

    form.reset();

});

// ===========================
// Delete
// ===========================

function deleteDepartment(index){

    if(confirm("Delete this department?")){

        departments.splice(index,1);

        renderTable();

    }

}

// ===========================
// Edit
// ===========================

function editDepartment(index){

    const dept = departments[index];

    document.getElementById("department").value =
    dept.department;

    document.getElementById("count").value =
    dept.count;

    document.getElementById("prefix").value =
    dept.prefix;

    departments.splice(index,1);

    renderTable();

}

// ===========================
// Statistics
// ===========================

function updateStatistics(){

    let totalStudents = 0;

    departments.forEach(item=>{

        totalStudents += Number(item.count);

    });

    document.getElementById("departmentCount").innerText =
    departments.length;

    document.getElementById("studentCount").innerText =
    totalStudents;

}

// ===========================
// Search
// ===========================

const search = document.getElementById("searchDepartment");

if(search){

search.addEventListener("keyup",()=>{

const value = search.value.toLowerCase();

const rows = table.querySelectorAll("tr");

rows.forEach(row=>{

row.style.display =
row.innerText.toLowerCase().includes(value)
? ""
: "none";

});

});

}

// ===========================
// Initial Load
// ===========================

renderTable();