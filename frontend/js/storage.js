/* ==========================================
   SMARTSEAT
   Storage Manager v2
========================================== */

const StorageManager = {

    /* ==========================
       Generic Methods
    ========================== */

    get(key){

        return JSON.parse(
            localStorage.getItem(key)
        ) || [];

    },

    save(key,data){

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

    },

    /* ==========================
       Students
    ========================== */

    getStudents(){

        return this.get("students");

    },

    saveStudents(data){

        this.save("students",data);

    },

    addStudent(student){

        const students =
        this.getStudents();

        students.push(student);

        this.saveStudents(students);

    },

    deleteStudent(index){

        const students =
        this.getStudents();

        students.splice(index,1);

        this.saveStudents(students);

    },

    /* ==========================
       Rooms
    ========================== */

    getRooms(){

        return this.get("rooms");

    },

    saveRooms(data){

        this.save("rooms",data);

    },

    addRoom(room){

        const rooms =
        this.getRooms();

        rooms.push(room);

        this.saveRooms(rooms);

    },

    deleteRoom(index){

        const rooms =
        this.getRooms();

        rooms.splice(index,1);

        this.saveRooms(rooms);

    },

    /* ==========================
       Departments
    ========================== */

    getDepartments(){

        return this.get("departments");

    },

    saveDepartments(data){

        this.save("departments",data);

    },

    addDepartment(department){

        const departments =
        this.getDepartments();

        departments.push(department);

        this.saveDepartments(departments);

    },

    /* ==========================
       Exams
    ========================== */

    getExams(){

        return this.get("exams");

    },

    saveExams(data){

        this.save("exams",data);

    },

    addExam(exam){

        const exams =
        this.getExams();

        exams.push(exam);

        this.saveExams(exams);

    },
    deleteExam(index){

        const exams = this.getExams();

        exams.splice(index,1);

        this.saveExams(exams);

    },
    /* ==========================
       Seating
    ========================== */

    getSeating(){

        return this.get("seating");

    },

    saveSeating(data){

        this.save("seating",data);

    },

    clearSeating(){

        localStorage.removeItem("seating");

    }

};

console.log("✅ Storage Manager Loaded");