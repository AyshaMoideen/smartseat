document.addEventListener("DOMContentLoaded", () => {

    updateDashboard();

    setInterval(updateDashboard,1000);

});

function updateDashboard(){

    const students = StorageManager.getStudents().length;

    const rooms = StorageManager.getRooms().length;

    const exams = StorageManager.getExams().length;

    const seating = StorageManager.getSeating().length;

    animateCounter("studentCount", students);

    animateCounter("roomCount", rooms);

    animateCounter("examCount", exams);

    animateCounter("seatCount", seating);

    document.getElementById("lastUpdated").textContent =
        new Date().toLocaleTimeString();

}

function animateCounter(id,target){

    const element=document.getElementById(id);

    const current=parseInt(element.innerText)||0;

    if(current===target) return;

    const increment = target>current ? 1 : -1;

    let value=current;

    const timer=setInterval(()=>{

        value+=increment;

        element.innerText=value;

        if(value===target){

            clearInterval(timer);

        }

    },20);

}