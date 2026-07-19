/* ==========================================
   SMARTSEAT
   Allocation Manager
========================================== */

const AllocationManager = {

    students: [],

    rooms: [],

    exams: [],

    allocation: [],

    /* ==========================
       Load Data
    ========================== */

    load(){

        this.students = StorageManager.getStudents();

        this.rooms = StorageManager.getRooms();

        this.exams = StorageManager.getExams();

        this.allocation = StorageManager.getSeating();

    },

    /* ==========================
       Capacity
    ========================== */

    getTotalCapacity(){

        let total = 0;

        this.rooms.forEach(room=>{

            total += Number(room.capacity);

        });

        return total;

    },

    validateCapacity(){

        return this.students.length <=
               this.getTotalCapacity();

    },

    /* ==========================
       Save Allocation
    ========================== */

    save(){

        StorageManager.saveSeating(
            this.allocation
        );

    },

    /* ==========================
       Clear Allocation
    ========================== */

    clear(){

        this.allocation = [];

        StorageManager.clearSeating();

    }

};

console.log(
"✅ Allocation Manager Loaded"
);