/* ==========================================
   SMARTSEAT
   ROOM MANAGEMENT
   MongoDB Version
========================================== */

/* ==========================
   Global Variables
========================== */

let rooms = [];
let editingRoomId = null;

const API_URL = "http://localhost:5000/api/rooms";
const token = localStorage.getItem("token");

/* ==========================
   Elements
========================== */

const roomTable = document.getElementById("roomTable");
const addRoomBtn = document.getElementById("addRoomBtn");
const saveRoomBtn = document.getElementById("saveRoomBtn");
const searchRoom = document.getElementById("searchRoom");

const roomModal = new bootstrap.Modal(
    document.getElementById("roomModal")
);

/* ==========================
   Load Rooms
========================== */

async function loadRooms() {

    try {

        const response = await fetch(API_URL, {

            method: "GET",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const data = await response.json();

        if (data.success) {

            rooms = data.rooms;
            renderRooms();

        } else {

            AlertManager.error(
                "Error",
                data.message || "Unable to load rooms."
            );

        }

    } catch (error) {

        console.error(error);

        AlertManager.error(
            "Server Error",
            "Unable to connect to server."
        );

    }

}

/* ==========================
   Render Rooms
========================== */

function renderRooms(data = rooms) {

    roomTable.innerHTML = "";

    if (data.length === 0) {

        roomTable.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    No Rooms Found
                </td>
            </tr>
        `;

        updateStatistics();
        return;

    }

    const floorNames = {
        0: "Ground",
        1: "First",
        2: "Second",
        3: "Third"
    };

    data.forEach(room => {

        roomTable.innerHTML += `

        <tr>

            <td>${room.roomNumber}</td>

            <td>${floorNames[room.floor] || room.floor}</td>

            <td>
                ${room.rowsLeft} + ${room.rowsRight}
                ×
                ${room.studentsPerBench}
            </td>

            <td>${room.maxCapacity}</td>

            <td>

                ${
                    room.isActive

                    ? '<span class="badge bg-success">Active</span>'

                    : '<span class="badge bg-danger">Inactive</span>'
                }

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="editRoom('${room._id}')">

                    <i class="bi bi-pencil-fill"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteRoom('${room._id}')">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

    updateStatistics();

}

/* ==========================
   Statistics
========================== */

function updateStatistics() {

    let totalCapacity = 0;

    rooms.forEach(room => {

        totalCapacity += Number(room.maxCapacity);

    });

    const activeRooms =
        rooms.filter(room => room.isActive).length;

    const inactiveRooms =
        rooms.length - activeRooms;

    document.getElementById("totalRooms").textContent =
        rooms.length;

    document.getElementById("totalCapacity").textContent =
        totalCapacity;

    document.getElementById("activeRooms").textContent =
        activeRooms;

    document.getElementById("inactiveRooms").textContent =
        inactiveRooms;

    document.getElementById("summaryRooms").textContent =
        rooms.length;

    document.getElementById("summaryCapacity").textContent =
        totalCapacity;

    document.getElementById("summaryActive").textContent =
        activeRooms;

    document.getElementById("summaryInactive").textContent =
        inactiveRooms;

}

console.log("✅ Section 1 Loaded");

/* ==========================================
   SECTION 2
   ADD / UPDATE ROOM
========================================== */

/* ==========================
   Capacity Preview
========================== */

const rowsLeftInput = document.getElementById("rowsLeft");
const rowsRightInput = document.getElementById("rowsRight");
const studentsPerBenchInput = document.getElementById("studentsPerBench");

function updateCapacityPreview() {

    const left = Number(rowsLeftInput.value) || 0;
    const right = Number(rowsRightInput.value) || 0;
    const perBench = Number(studentsPerBenchInput.value) || 0;

    const capacity = (left + right) * perBench;

    document.getElementById("capacityPreview").textContent =
        `${capacity} Students`;

}

rowsLeftInput.addEventListener("input", updateCapacityPreview);
rowsRightInput.addEventListener("input", updateCapacityPreview);
studentsPerBenchInput.addEventListener("input", updateCapacityPreview);

/* ==========================
   Open Add Room Modal
========================== */

addRoomBtn.addEventListener("click", () => {

    editingRoomId = null;

    document.querySelector(".modal-title").innerHTML = `
        <i class="bi bi-building-fill-add"></i>
        Add Room
    `;

    document.getElementById("roomNumber").value = "";
    document.getElementById("floor").value = 0;
    document.getElementById("rowsLeft").value = 7;
    document.getElementById("rowsRight").value = 7;
    document.getElementById("studentsPerBench").value = 3;
    document.getElementById("roomStatus").value = "true";

    updateCapacityPreview();

    roomModal.show();

});

/* ==========================
   Save Room
========================== */

saveRoomBtn.addEventListener("click", async () => {

    const roomNumber =
        document.getElementById("roomNumber").value.trim();

    const floor =
        Number(document.getElementById("floor").value);

    const rowsLeft =
        Number(document.getElementById("rowsLeft").value);

    const rowsRight =
        Number(document.getElementById("rowsRight").value);

    const studentsPerBench =
        Number(document.getElementById("studentsPerBench").value);

    const isActive =
        document.getElementById("roomStatus").value === "true";

    if (!roomNumber) {

        AlertManager.warning(
            "Missing Room Number",
            "Please enter a room number."
        );

        return;

    }

    if (rowsLeft <= 0 || rowsRight <= 0 || studentsPerBench <= 0) {

        AlertManager.warning(
            "Invalid Layout",
            "Values must be greater than zero."
        );

        return;

    }

    const roomData = {

        roomNumber,
        floor,
        rowsLeft,
        rowsRight,
        studentsPerBench,
        isActive

    };

    try {

        let response;

        if (editingRoomId) {

            response = await fetch(`${API_URL}/${editingRoomId}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify(roomData)

            });

        } else {

            response = await fetch(API_URL, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify(roomData)

            });

        }

        const data = await response.json();

        if (data.success) {

            AlertManager.success(

                editingRoomId
                    ? "Room Updated Successfully"
                    : "Room Added Successfully"

            );

            roomModal.hide();

            loadRooms();

        } else {

            AlertManager.error(

                "Error",

                data.message || "Operation failed."

            );

        }

    } catch (error) {

        console.error(error);

        AlertManager.error(

            "Server Error",

            "Something went wrong."

        );

    }

});

console.log("✅ Section 2 Loaded");

/* ==========================================
   SECTION 3
   EDIT / DELETE / SEARCH
========================================== */

/* ==========================
   Edit Room
========================== */

function editRoom(id) {

    const room = rooms.find(r => r._id === id);

    if (!room) return;

    editingRoomId = id;

    document.querySelector(".modal-title").innerHTML = `
        <i class="bi bi-pencil-square"></i>
        Edit Room
    `;

    document.getElementById("roomNumber").value = room.roomNumber;
    document.getElementById("floor").value = room.floor;
    document.getElementById("rowsLeft").value = room.rowsLeft;
    document.getElementById("rowsRight").value = room.rowsRight;
    document.getElementById("studentsPerBench").value = room.studentsPerBench;
    document.getElementById("roomStatus").value = room.isActive.toString();

    updateCapacityPreview();

    roomModal.show();

}

/* ==========================
   Delete Room
========================== */

async function deleteRoom(id) {

    if (!confirm("Delete this room?")) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE",

            headers: {

                Authorization: `Bearer ${token}`

            }

        });

        const data = await response.json();

        if (data.success) {

            AlertManager.success(
                "Room Deleted Successfully"
            );

            loadRooms();

        } else {

            AlertManager.error(
                "Error",
                data.message || "Unable to delete room."
            );

        }

    } catch (error) {

        console.error(error);

        AlertManager.error(
            "Server Error",
            "Something went wrong."
        );

    }

}

/* ==========================
   Search
========================== */

searchRoom.addEventListener("input", () => {

    const keyword = searchRoom.value
        .trim()
        .toLowerCase();

    const filtered = rooms.filter(room =>

        room.roomNumber
            .toString()
            .toLowerCase()
            .includes(keyword)

    );

    renderRooms(filtered);

});

/* ==========================
   Initialize
========================== */

document.addEventListener("DOMContentLoaded", () => {

    loadRooms();

    updateCapacityPreview();

});

console.log("✅ Section 3 Loaded");

/* ==========================================
   SECTION 4
   EXPORT / CLEAR ALL
========================================== */

/* ==========================
   Export Rooms to CSV
========================== */

const exportBtn = document.getElementById("exportRoomsBtn");

if (exportBtn) {

    exportBtn.addEventListener("click", () => {

        if (rooms.length === 0) {

            AlertManager.warning(
                "No Rooms",
                "There are no rooms to export."
            );

            return;

        }

        const csv = [

            "Room Number,Floor,Rows Left,Rows Right,Students Per Bench,Capacity,Status",

            ...rooms.map(room =>

                `${room.roomNumber},${room.floor},${room.rowsLeft},${room.rowsRight},${room.studentsPerBench},${room.maxCapacity},${room.isActive ? "Active" : "Inactive"}`

            )

        ].join("\n");

        const blob = new Blob([csv], {
            type: "text/csv"
        });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "rooms.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    });

}

/* ==========================
   Clear All Rooms
========================== */

const clearBtn = document.getElementById("clearRoomsBtn");

if (clearBtn) {

    clearBtn.addEventListener("click", async () => {

        if (!confirm("Delete ALL rooms?")) return;

        try {

            const deletePromises = rooms.map(room =>

                fetch(`${API_URL}/${room._id}`, {

                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                })

            );

            await Promise.all(deletePromises);

            AlertManager.success(
                "All Rooms Deleted Successfully"
            );

            loadRooms();

        }

        catch (error) {

            console.error(error);

            AlertManager.error(
                "Server Error",
                "Unable to delete rooms."
            );

        }

    });

}

/* ==========================
   Refresh Helper
========================== */

function refreshRooms() {

    loadRooms();

}

console.log("✅ Section 4 Loaded");

