/* ==========================================
   SMARTSEAT - Room Management
========================================== */

const roomForm = document.getElementById("roomForm");
const roomTable = document.getElementById("roomTable");
const searchRoom = document.getElementById("searchRoom");

let rooms = JSON.parse(localStorage.getItem("rooms")) || [];

// ===========================
// Render Table
// ===========================

function renderRooms() {

    roomTable.innerHTML = "";

    rooms.forEach((room, index) => {

        roomTable.innerHTML += `

        <tr>

            <td>${room.building}</td>

            <td>${room.floor}</td>

            <td>${room.room}</td>

            <td>${room.benches}</td>

            <td>${room.seats}</td>

            <td>${room.capacity}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editRoom(${index})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteRoom(${index})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

    updateStats();

    saveRooms();

}

// ===========================
// Save Local Storage
// ===========================

function saveRooms() {

    localStorage.setItem(

        "rooms",

        JSON.stringify(rooms)

    );

}

// ===========================
// Add Room
// ===========================

roomForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const building = document.getElementById("building").value.trim();

    const floor = document.getElementById("floor").value;

    const room = document.getElementById("room").value.trim();

    const benches = Number(document.getElementById("benches").value);

    const seats = Number(document.getElementById("seat").value);

    if (
        building === "" ||
        floor === "" ||
        room === "" ||
        benches === 0 ||
        seats === 0
    ) {

        alert("Please fill all fields.");

        return;

    }

    const capacity = benches * seats;

    rooms.push({

        building,

        floor,

        room,

        benches,

        seats,

        capacity

    });

    renderRooms();

    roomForm.reset();

    document.getElementById("seat").value = 3;

});

// ===========================
// Delete
// ===========================

function deleteRoom(index) {

    if (confirm("Delete this room?")) {

        rooms.splice(index, 1);

        renderRooms();

    }

}

// ===========================
// Edit
// ===========================

function editRoom(index) {

    const room = rooms[index];

    document.getElementById("building").value = room.building;

    document.getElementById("floor").value = room.floor;

    document.getElementById("room").value = room.room;

    document.getElementById("benches").value = room.benches;

    document.getElementById("seat").value = room.seats;

    rooms.splice(index, 1);

    renderRooms();

}

// ===========================
// Search
// ===========================

searchRoom.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const rows = roomTable.querySelectorAll("tr");

    rows.forEach((row) => {

        row.style.display = row.innerText.toLowerCase().includes(value)

            ? ""

            : "none";

    });

});

// ===========================
// Statistics
// ===========================

function updateStats() {

    let totalCapacity = 0;

    rooms.forEach((room) => {

        totalCapacity += room.capacity;

    });

    document.getElementById("roomCount").innerText = rooms.length;

    document.getElementById("capacityCount").innerText = totalCapacity;

}

// ===========================
// Initial Load
// ===========================

renderRooms();