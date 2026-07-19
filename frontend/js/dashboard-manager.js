/* ==========================================
   SMARTSEAT
   Dashboard Manager
========================================== */

const DashboardManager = {

    getStudentCount() {

        return StorageManager.getStudents().length;

    },

    getRoomCount() {

        return StorageManager.getRooms().length;

    },

    getDepartmentCount() {

        return StorageManager.getDepartments().length;

    },

    getExamCount() {

        return StorageManager.getExams().length;

    },

    getSeatingCount() {

        return StorageManager.getSeating().length;

    },

    getTotalCapacity() {

        const rooms = StorageManager.getRooms();

        let total = 0;

        rooms.forEach(room => {

            total += Number(room.capacity || 0);

        });

        return total;

    },

    getTodayExamCount() {

        const today =
        new Date().toISOString().split("T")[0];

        return StorageManager
            .getExams()
            .filter(exam => exam.date === today)
            .length;

    },

    getUpcomingExamCount() {

        const today =
        new Date().toISOString().split("T")[0];

        return StorageManager
            .getExams()
            .filter(exam => exam.date > today)
            .length;

    },

    getRecentExams(limit = 5) {

        return StorageManager
            .getExams()
            .slice(-limit)
            .reverse();

    },

    getSummary() {

        return {

            students: this.getStudentCount(),

            rooms: this.getRoomCount(),

            departments: this.getDepartmentCount(),

            exams: this.getExamCount(),

            seating: this.getSeatingCount(),

            capacity: this.getTotalCapacity(),

            todayExams: this.getTodayExamCount(),

            upcomingExams: this.getUpcomingExamCount()

        };

    },

    render() {

        const summary =
        this.getSummary();

        const cards = {

            studentCount:
            summary.students,

            roomCount:
            summary.rooms,

            departmentCount:
            summary.departments,

            examCount:
            summary.exams,

            seatingCount:
            summary.seating,

            capacity:
            summary.capacity,

            todayExamCount:
            summary.todayExams,

            upcomingExamCount:
            summary.upcomingExams

        };

        Object.keys(cards).forEach(id => {

            const element =
            document.getElementById(id);

            if(element){

                element.textContent =
                cards[id];

            }

        });

    }

};

console.log("✅ Dashboard Manager Loaded");