/* ==========================================
   SMARTSEAT
   ROOM MANAGEMENT
   Part 1
========================================== */

/* ==========================
   Global Variables
========================== */

let rooms = StorageManager.getRooms();

let editIndex = -1;

/* ==========================
   Elements
========================== */

const roomTable =
document.getElementById("roomTable");

const addRoomBtn =
document.getElementById("addRoomBtn");

const saveRoomBtn =
document.getElementById("saveRoomBtn");

const roomModal =
new bootstrap.Modal(
    document.getElementById("roomModal")
);

const searchRoom =
document.getElementById("searchRoom");

/* ==========================
   Statistics
========================== */

function updateStatistics(){

    let totalCapacity = 0;

    rooms.forEach(room=>{

        totalCapacity +=
        Number(room.capacity);

    });

    document.getElementById(
        "totalRooms"
    ).textContent =
    rooms.length;

    document.getElementById(
        "totalCapacity"
    ).textContent =
    totalCapacity;

    document.getElementById(
        "occupiedRooms"
    ).textContent =
    0;

    document.getElementById(
        "availableRooms"
    ).textContent =
    rooms.length;

    document.getElementById(
        "summaryRooms"
    ).textContent =
    rooms.length;

    document.getElementById(
        "summaryCapacity"
    ).textContent =
    totalCapacity;

    document.getElementById(
        "summaryOccupied"
    ).textContent =
    0;

    document.getElementById(
        "summaryAvailable"
    ).textContent =
    rooms.length;

}

/* ==========================
   Render Rooms
========================== */

function renderRooms(data = rooms){

    roomTable.innerHTML = "";

    if(data.length===0){

        roomTable.innerHTML = `

        <tr>

            <td
            colspan="3"
            class="text-center">

                No Rooms Added

            </td>

        </tr>

        `;

        updateStatistics();

        return;

    }

    data.forEach((room,index)=>{

        roomTable.innerHTML += `

        <tr>

            <td>

                ${room.name}

            </td>

            <td>

                ${room.capacity}

            </td>

            <td>

                <button
                class="btn btn-warning btn-sm me-2"
                onclick="editRoom(${index})">

                    <i class="bi bi-pencil-fill"></i>

                </button>

                <button
                class="btn btn-danger btn-sm"
                onclick="deleteRoom(${index})">

                    <i class="bi bi-trash-fill"></i>

                </button>

            </td>

        </tr>

        `;

    });

    updateStatistics();

}

/* ==========================
   Refresh
========================== */

function refreshRooms(){

    rooms =
    StorageManager.getRooms();

    renderRooms();

}

console.log(
"✅ Rooms Part 1 Loaded"
);

/* ==========================================
   PART 2
   Add & Edit Room
========================================== */

/* ==========================
   Open Add Room Modal
========================== */

addRoomBtn.addEventListener("click",()=>{

    editIndex = -1;

    document.getElementById("roomName").value = "";

    document.getElementById("roomCapacity").value = "";

    document.querySelector(".modal-title").innerHTML = `

        <i class="bi bi-building-fill-add"></i>

        Add Room

    `;

    roomModal.show();

});

/* ==========================
   Save Room
========================== */

saveRoomBtn.addEventListener("click",()=>{

    const roomName =
    document.getElementById("roomName")
    .value
    .trim()
    .toUpperCase();

    const capacity =
    document.getElementById("roomCapacity")
    .value
    .trim();

    /* Validation */

    if(!roomName || !capacity){

        AlertManager.warning(

            "Missing Details",

            "Please fill all fields."

        );

        return;

    }

    if(Number(capacity) <= 0){

        AlertManager.warning(

            "Invalid Capacity",

            "Capacity must be greater than zero."

        );

        return;

    }

    /* Duplicate Room Check */

    const duplicate = rooms.find((room,index)=>{

        return (

            room.name === roomName &&

            index !== editIndex

        );

    });

    if(duplicate){

        AlertManager.error(

            "Duplicate Room",

            "Room already exists."

        );

        return;

    }

    const room = {

        name: roomName,

        capacity: Number(capacity)

    };

    /* Add */

    if(editIndex === -1){

        StorageManager.addRoom(room);

        ActivityManager.addActivity(

            `Added Room : ${roomName}`

        );

        AlertManager.success(

            "Room Added Successfully"

        );

    }

    /* Edit */

    else{

        rooms[editIndex] = room;

        StorageManager.saveRooms(rooms);

        ActivityManager.addActivity(

            `Updated Room : ${roomName}`

        );

        AlertManager.success(

            "Room Updated Successfully"

        );

    }

    roomModal.hide();

    refreshRooms();

});

/* ==========================
   Edit Room
========================== */

function editRoom(index){

    editIndex = index;

    const room = rooms[index];

    document.getElementById("roomName").value =
    room.name;

    document.getElementById("roomCapacity").value =
    room.capacity;

    document.querySelector(".modal-title").innerHTML = `

        <i class="bi bi-pencil-square"></i>

        Edit Room

    `;

    roomModal.show();

}

console.log(
"✅ Rooms Part 2 Loaded"
);

/* ==========================================
   Initialize Page
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    refreshRooms();

});

function deleteRoom(index){

    if(!confirm("Delete this room?")) return;

    rooms.splice(index,1);

    StorageManager.saveRooms(rooms);

    refreshRooms();

}

searchRoom.addEventListener("input",()=>{

    const keyword = searchRoom.value
    .toLowerCase();

    const filtered = rooms.filter(room=>

        room.name.toLowerCase().includes(keyword)

    );

    renderRooms(filtered);

});

const exportBtn =
document.getElementById("exportRoomsBtn");

if(exportBtn){

    exportBtn.onclick = ()=>{

        const csv = [

            "Room,Capacity",

            ...rooms.map(r=>`${r.name},${r.capacity}`)

        ].join("\n");

        const blob = new Blob([csv],{

            type:"text/csv"

        });

        const link =
        document.createElement("a");

        link.href =
        URL.createObjectURL(blob);

        link.download =
        "rooms.csv";

        link.click();

    };

}

const clearBtn =
document.getElementById("clearRoomsBtn");

if(clearBtn){

    clearBtn.onclick = ()=>{

        if(confirm("Delete all rooms?")){

            StorageManager.saveRooms([]);

            refreshRooms();

        }

    };

}