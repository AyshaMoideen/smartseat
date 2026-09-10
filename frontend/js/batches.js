/* ==========================================
   SMARTSEAT
   BATCH MASTER
   PART 1
========================================== */


/* ==========================================
   GLOBAL VARIABLES
========================================== */

let batches = [];

let editingBatchId = null;

const API_URL = "http://localhost:5000/api/batches";

const token = localStorage.getItem("token");


/* ==========================================
   ELEMENTS
========================================== */

const batchTable =
    document.getElementById("batchTable");

const addBatchBtn =
    document.getElementById("addBatchBtn");

const saveBatchBtn =
    document.getElementById("saveBatchBtn");

const searchBatch =
    document.getElementById("searchBatch");

const batchModalElement =
    document.getElementById("batchModal");


/* ==========================================
   BOOTSTRAP MODAL
========================================== */

const batchModal =
    new bootstrap.Modal(batchModalElement);


/* ==========================================
   OPEN ADD BATCH MODAL
========================================== */

addBatchBtn.addEventListener("click", () => {

    // Reset editing mode

    editingBatchId = null;


    // Clear form

    document.getElementById("batchName").value = "";

    document.getElementById("batchPrefix").value = "";

    document.getElementById("startYear").value = "";

    document.getElementById("endYear").value = "";

    document.getElementById("batchStatus").value = "true";


    // Reset preview

    document.getElementById("registerPreview")
        .textContent = "MD24BCAR001";


    // Change modal title

    document.querySelector(".modal-title").innerHTML = `

        <i class="bi bi-collection-fill"></i>

        Add Batch

    `;


    // Change button text

    saveBatchBtn.innerHTML = `

        <i class="bi bi-check-circle-fill"></i>

        Save Batch

    `;


    // Open modal

    batchModal.show();

});


/* ==========================================
   REGISTER NUMBER PREVIEW
========================================== */
const prefixInput =
    document.getElementById("batchPrefix");

prefixInput.addEventListener("input", () => {

    let prefix =
        prefixInput.value
            .trim()
            .toUpperCase();


    if (!prefix) {

        document.getElementById("registerPreview")
            .textContent = "MD24BCAR001";

        return;

    }


    document.getElementById("registerPreview")
        .textContent =
        `${prefix}BCAR001`;

});


/* ==========================================
   INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "✅ Batch Master Part 1 Loaded"
    );

});

/* ==========================================
   PART 2
   LOAD BATCHES
========================================== */


/* ==========================================
   LOAD BATCHES FROM BACKEND
========================================== */

async function loadBatches() {

    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });


        const data = await response.json();


        if (data.success) {

            batches = data.batches || [];

            renderBatches();

        }

        else {

            AlertManager.error(

                "Error",

                data.message || "Unable to load batches."

            );

        }

    }

    catch (error) {

        console.error(

            "Load batches error:",

            error

        );


        AlertManager.error(

            "Server Error",

            "Unable to connect to the server."

        );

    }

}


/* ==========================================
   RENDER BATCHES
========================================== */

function renderBatches(data = batches) {

    batchTable.innerHTML = "";


    /* ======================================
       NO BATCHES
    ====================================== */

    if (data.length === 0) {

        batchTable.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center">

                    <i class="bi bi-inbox"></i>

                    No Batches Found

                </td>

            </tr>

        `;

        updateStatistics();

        return;

    }


    /* ======================================
       DISPLAY BATCHES
    ====================================== */

    data.forEach(batch => {

        batchTable.innerHTML += `

            <tr>

                <!-- Batch -->

                <td>

                    <strong>

                        ${batch.batchName}

                    </strong>

                </td>


                <!-- Prefix -->

                <td>

                    <span class="badge bg-primary">

                        ${batch.prefix}

                    </span>

                </td>


                <!-- Academic Period -->

                <td>

                    ${batch.startYear}

                    -

                    ${batch.endYear}

                </td>


                <!-- Status -->

                <td>

                    ${
                        batch.isActive

                        ?

                        '<span class="badge bg-success">Active</span>'

                        :

                        '<span class="badge bg-danger">Inactive</span>'
                    }

                </td>


                <!-- Actions -->

                <td>

    <!-- Edit -->

    <button
        class="btn btn-warning btn-sm me-2"
        onclick="editBatch('${batch._id}')"
        title="Edit Batch">

        <i class="bi bi-pencil-fill"></i>

    </button>


    <!-- Activate / Deactivate -->

    <button
        class="btn ${batch.isActive ? "btn-secondary" : "btn-success"} btn-sm me-2"
        onclick="toggleBatchStatus('${batch._id}')"
        title="${batch.isActive ? "Deactivate Batch" : "Activate Batch"}">

        <i class="bi ${
            batch.isActive
                ? "bi-toggle-on"
                : "bi-toggle-off"
        }"></i>

    </button>


    <!-- Delete -->

    <button
        class="btn btn-danger btn-sm"
        onclick="deleteBatch('${batch._id}')"
        title="Delete Batch">

        <i class="bi bi-trash-fill"></i>

    </button>

</td>

            </tr>

        `;

    });


    updateStatistics();

}


/* ==========================================
   UPDATE STATISTICS
========================================== */

function updateStatistics() {

    const total =
        batches.length;


    const active =
        batches.filter(
            batch => batch.isActive
        ).length;


    const inactive =
        total - active;


    /* ======================================
       MAIN STATISTICS
    ====================================== */

    document.getElementById(
        "totalBatches"
    ).textContent = total;


    document.getElementById(
        "activeBatches"
    ).textContent = active;


    document.getElementById(
        "inactiveBatches"
    ).textContent = inactive;


    /* ======================================
       CURRENT BATCH
    ====================================== */

    let currentBatch = "—";


    if (batches.length > 0) {

        const activeBatches =
            batches.filter(
                batch => batch.isActive
            );


        if (activeBatches.length > 0) {

            const latest =
                activeBatches.reduce(
                    (latest, batch) =>
                        batch.startYear >
                        latest.startYear
                            ? batch
                            : latest
                );

            currentBatch =
                latest.batchName;

        }

    }


    document.getElementById(
        "currentBatch"
    ).textContent =
        currentBatch;


    /* ======================================
       SUMMARY
    ====================================== */

    document.getElementById(
        "summaryBatches"
    ).textContent =
        total;


    document.getElementById(
        "summaryActive"
    ).textContent =
        active;


    document.getElementById(
        "summaryInactive"
    ).textContent =
        inactive;


    document.getElementById(
        "summaryCurrent"
    ).textContent =
        currentBatch;

}


/* ==========================================
   INITIAL LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadBatches();

    }
);


console.log(
    "✅ Batch Master Part 2 Loaded"
);

/* ==========================================
   SECTION 5
   SAVE / CREATE BATCH
========================================== */

saveBatchBtn.addEventListener("click", async () => {


    /* ======================================
       GET FORM VALUES
    ====================================== */

    const batchName =
        document.getElementById("batchName").value.trim();

    const prefix =
        document.getElementById("batchPrefix").value.trim().toUpperCase();

    const startYear =
        Number(document.getElementById("startYear").value);

    const endYear =
        Number(document.getElementById("endYear").value);

    const isActive =
        document.getElementById("batchStatus").value === "true";


    /* ======================================
       VALIDATION
    ====================================== */

    if (
        !batchName ||
        !prefix ||
        !startYear ||
        !endYear
    ) {

        AlertManager.error(
            "Missing Details",
            "Please fill in all required fields."
        );

        return;
    }

/* ======================================
   YEAR VALIDATION
====================================== */

if (startYear < 2000 || startYear > 2100) {

    AlertManager.error(
        "Invalid Start Year",
        "Please enter a valid start year."
    );

    return;
}


if (endYear < 2000 || endYear > 2100) {

    AlertManager.error(
        "Invalid End Year",
        "Please enter a valid end year."
    );

    return;
}


if (endYear <= startYear) {

    AlertManager.error(
        "Invalid Years",
        "End year must be greater than start year."
    );

    return;
}

/* ======================================
   DUPLICATE VALIDATION
====================================== */

const duplicate = batches.find(batch => {

    // Ignore the batch currently being edited
    if (editingBatchId && batch._id === editingBatchId) {
        return false;
    }

    return (
        batch.batchName.toLowerCase() === batchName.toLowerCase() ||
        batch.prefix.toLowerCase() === prefix.toLowerCase()
    );

});

if (duplicate) {

    AlertManager.error(
        "Batch Already Exists",
        `The batch "${batchName}" already exists.`
    );

    return;
}


/* ==========================================
   SECTION 6 PART 2
   UPDATE EXISTING BATCH
========================================== */

if (editingBatchId) {

    try {

        const response = await fetch(
            `${API_URL}/${editingBatchId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({

                    batchName,
                    prefix,
                    startYear,
                    endYear,
                    isActive

                })
            }
        );


        const data = await response.json();


        if (response.ok && data.success) {

            AlertManager.success(
                "Batch Updated",
                "Batch updated successfully."
            );


            /* ================================
               RESET EDIT MODE
            ================================= */

            editingBatchId = null;


            /* ================================
               RESET FORM
            ================================= */

            document.getElementById("batchName").value = "";

            document.getElementById("batchPrefix").value = "";

            document.getElementById("startYear").value = "";

            document.getElementById("endYear").value = "";

            document.getElementById("batchStatus").value = "true";


            document.getElementById("registerPreview")
                .textContent = "MD24BCAR001";


            /* ================================
               RESTORE MODAL
            ================================= */

            document.querySelector(".modal-title").innerHTML = `

                <i class="bi bi-plus-circle-fill"></i>

                Add Batch

            `;


            saveBatchBtn.innerHTML = `

                <i class="bi bi-check-circle-fill"></i>

                Save Batch

            `;


            batchModal.hide();


            /* ================================
               RELOAD
            ================================= */

            await loadBatches();

            return;

        }


        AlertManager.error(
            "Unable to Update Batch",
            data.message || "Something went wrong."
        );

        return;

    }

    catch (error) {

        console.error(
            "Update batch error:",
            error
        );

        AlertManager.error(
            "Server Error",
            "Unable to connect to the server."
        );

        return;

    }

}
    /* ======================================
       BUTTON LOADING
    ====================================== */

    saveBatchBtn.disabled = true;

    saveBatchBtn.innerHTML = `

        <span
            class="spinner-border spinner-border-sm me-2">
        </span>

        Saving...

    `;


    /* ======================================
       SEND TO BACKEND
    ====================================== */

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                "Authorization": `Bearer ${token}`

            },

            body: JSON.stringify({

                batchName,

                prefix,

                startYear,

                endYear,

                isActive

            })

        });


        const data = await response.json();


        /* ==================================
           SUCCESS
        ================================== */

        if (response.ok && data.success) {

    AlertManager.success(
        "Batch Added",
        "Batch created successfully."
    );


    /* ================================
       RESET FORM
    ================================= */

    document.getElementById("batchName").value = "";

    document.getElementById("batchPrefix").value = "";

    document.getElementById("startYear").value = "";

    document.getElementById("endYear").value = "";

    document.getElementById("batchStatus").value = "true";


    document.getElementById("registerPreview")
        .textContent = "MD24BCAR001";


    /* ================================
       CLOSE MODAL
    ================================= */

    batchModal.hide();


    /* ================================
       RELOAD BATCHES
    ================================= */

    await loadBatches();


    return;
}


        /* ==================================
           BACKEND ERROR
        ================================== */

        AlertManager.error(

            "Unable to Add Batch",

            data.message ||
            "Something went wrong."

        );

    }

    catch (error) {

        console.error(
            "Create batch error:",
            error
        );


        AlertManager.error(

            "Server Error",

            "Unable to connect to the server."

        );

    }

    finally {

        /* ================================
           RESTORE BUTTON
        ================================= */

        saveBatchBtn.disabled = false;

        saveBatchBtn.innerHTML = `

            <i class="bi bi-check-circle-fill"></i>

            Save Batch

        `;

    }

});


console.log(
    "✅ Batch Master Section 5 Loaded"
);
/* ==========================================
   SECTION 6
   EDIT BATCH
   PART 1
========================================== */


/* ==========================================
   EDIT BATCH
========================================== */

function editBatch(batchId) {

    /* ======================================
       FIND BATCH
    ====================================== */

    const batch =
        batches.find(
            batch => batch._id === batchId
        );


    if (!batch) {

        AlertManager.error(
            "Batch Not Found",
            "Unable to find the selected batch."
        );

        return;
    }


    /* ======================================
       STORE EDITING ID
    ====================================== */

    editingBatchId = batchId;


    /* ======================================
       LOAD DATA INTO FORM
    ====================================== */

    document.getElementById("batchName").value =
        batch.batchName;


    document.getElementById("batchPrefix").value =
        batch.prefix;


    document.getElementById("startYear").value =
        batch.startYear;


    document.getElementById("endYear").value =
        batch.endYear;


    document.getElementById("batchStatus").value =
        String(batch.isActive);


    /* ======================================
       UPDATE REGISTER PREVIEW
    ====================================== */

    document.getElementById("registerPreview")
        .textContent =
        `${batch.prefix}BCAR001`;


    /* ======================================
       CHANGE MODAL TITLE
    ====================================== */

    document.querySelector(".modal-title").innerHTML = `

        <i class="bi bi-pencil-square"></i>

        Edit Batch

    `;


    /* ======================================
       CHANGE SAVE BUTTON
    ====================================== */

    saveBatchBtn.innerHTML = `

        <i class="bi bi-pencil-fill"></i>

        Update Batch

    `;


    /* ======================================
       OPEN MODAL
    ====================================== */

    batchModal.show();

}


console.log(
    "✅ Batch Master Section 6 Part 1 Loaded"
);

/* ==========================================
   SECTION 6 PART 3
   ACTIVATE / DEACTIVATE BATCH
========================================== */

async function toggleBatchStatus(batchId) {

    const batch =
        batches.find(
            batch => String(batch._id) === String(batchId)
        );


    if (!batch) {

        AlertManager.error(
            "Batch Not Found",
            "Unable to find the selected batch."
        );

        return;
    }


    const newStatus = !batch.isActive;


    const result = await Swal.fire({

        title: newStatus
            ? "Activate Batch?"
            : "Deactivate Batch?",

        text: newStatus
            ? `${batch.batchName} will become active.`
            : `${batch.batchName} will become inactive.`,

        icon: "question",

        showCancelButton: true,

        confirmButtonText: newStatus
            ? "Yes, Activate"
            : "Yes, Deactivate",

        cancelButtonText: "Cancel"

    });


    if (!result.isConfirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${batchId}`,
            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    batchName: batch.batchName,

                    prefix: batch.prefix,

                    startYear: batch.startYear,

                    endYear: batch.endYear,

                    isActive: newStatus

                })

            }
        );


        const data = await response.json();


        if (response.ok && data.success) {

            AlertManager.success(

                newStatus
                    ? "Batch Activated"
                    : "Batch Deactivated",

                `${batch.batchName} updated successfully.`

            );


            await loadBatches();

            return;
        }


        AlertManager.error(

            "Unable to Update",

            data.message ||
            "Unable to change batch status."

        );

    }

    catch (error) {

        console.error(
            "Toggle batch status error:",
            error
        );


        AlertManager.error(

            "Server Error",

            "Unable to connect to the server."

        );

    }

}
/* ==========================================
   SECTION 6 PART 4
   DELETE BATCH
========================================== */

async function deleteBatch(batchId) {

    const batch =
        batches.find(
            batch => String(batch._id) === String(batchId)
        );


    if (!batch) {

        AlertManager.error(
            "Batch Not Found",
            "Unable to find the selected batch."
        );

        return;
    }


    /* ======================================
       CONFIRMATION
    ====================================== */

    const result = await Swal.fire({

        title: "Delete Batch?",

        html: `
            <p>
                Are you sure you want to delete
                <strong>${batch.batchName}</strong>?
            </p>

            <p class="text-danger mb-0">
                This action cannot be undone.
            </p>
        `,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Yes, Delete",

        cancelButtonText: "Cancel",

        confirmButtonColor: "#dc3545"

    });


    /* ======================================
       CANCEL
    ====================================== */

    if (!result.isConfirmed) {

        return;

    }


    /* ======================================
       DELETE REQUEST
    ====================================== */

    try {

        const response = await fetch(
            `${API_URL}/${batchId}`,
            {

                method: "DELETE",

                headers: {

                    "Authorization":
                        `Bearer ${token}`

                }

            }
        );


        const data = await response.json();


        /* ==================================
           SUCCESS
        ================================== */

        if (response.ok && data.success) {

            AlertManager.success(

                "Batch Deleted",

                `${batch.batchName} deleted successfully.`

            );


            await loadBatches();

            return;
        }


        /* ==================================
           BACKEND ERROR
        ================================== */

        AlertManager.error(

            "Unable to Delete",

            data.message ||
            "Unable to delete the batch."

        );

    }

    catch (error) {

        console.error(
            "Delete batch error:",
            error
        );


        AlertManager.error(

            "Server Error",

            "Unable to connect to the server."

        );

    }

}