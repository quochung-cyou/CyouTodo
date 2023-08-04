import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue, push, get } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkn2RuEulJzBKvhF52vHOC1IDZU67VhlA",
    authDomain: "todocyou.firebaseapp.com",
    databaseURL: "https://todocyou-default-rtdb.firebaseio.com",
    projectId: "todocyou",
    storageBucket: "todocyou.appspot.com",
    messagingSenderId: "339006238370",
    appId: "1:339006238370:web:fc0282cc4279c0ec2171fb",
    measurementId: "G-7YT7CK3J4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app);
var currentStatusAdd = "todo";

//auto redirect to login page if not logged in
auth.onAuthStateChanged(function (user) {
    if (!user) {
        //if in login page, do nothing
        if (window.location.pathname != "/login.html") {
            window.location.href = "login.html";
        }
    }
}
);

//preloader
window.onload = function () {
    getDatabaseData();
    renderChart();

};

//logout
const btnLogout = document.getElementById("btn_signout");
btnLogout.addEventListener("click", function () {
    auth.signOut().then(() => {
        // Sign-out successful.
        window.location.href = "login.html";

    }
    ).catch((error) => {
        console.log(error);
        // An error happened.
    }
    );
});


function TaskTodo(status, title, desc, category, keyid, duedate, priority) {
    this.status = status;
    this.title = title;
    this.desc = desc;
    this.category = category;
    this.keyid = keyid;
    this.duedate = duedate;
    this.priority = priority;
}

function getDatabaseData() {
    const useruid = auth.currentUser;
    //get data todolist from firebase realtime
    if (useruid == null) {
        setTimeout(function () {
            getDatabaseData();
        }, 100);
        return;
    }

    let totaltask = 0, totaltaskdone = 0;

    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist");
    get(todoRef).then((snapshot) => {
        if (snapshot.exists()) {
            doneLoading();
            const data = snapshot.val();
            for (let i in data) {
                const todo = data[i];
                //get key in firebase
                const keyid = i;
                if (todo.status != "todo" && todo.status != "doing" && todo.status != "done") {
                    todo.status = "todo";
                }
                const task = new TaskTodo(
                    todo.status,
                    todo.title,
                    todo.desc,
                    todo.category,
                    i,
                    todo.duedate,
                    todo.priority
                );
                totaltask++;
                if (task.status == "done") totaltaskdone++;
                addTask(task);
            }
            //done add task

            //set progress

            console.log(totaltask + " " + totaltaskdone);

            document.getElementById("lasttask-number").innerHTML = totaltask + " totals, ";
            document.getElementById("dashboard-task-done-number").innerHTML = totaltaskdone;
            document.getElementById("dashboard-task-undone-number").innerHTML = totaltask - totaltaskdone;
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

}


/* 
<th>Name</th>
<th>Admin</th>
<th>Member</th>
<th>Progress</th>
<th>Time</th> */

function addTask(task) {
    //add task to html
    let tabledata = document.getElementsByClassName("dashboard-progress")[0].getElementsByTagName("tbody")[0];
    let tr = document.createElement("tr");
    let tdName = document.createElement("td");
    let tdAdmin = document.createElement("td");
    let tdMember = document.createElement("td");
    let tdProgress = document.createElement("td");
    let tdTime = document.createElement("td");
    let tdTimeLeft = document.createElement("td");

    tdName.innerHTML = task.title;
    tdAdmin.innerHTML = "Admin";
    tdMember.innerHTML = "Member";


    tdProgress.innerHTML = task.status;
    if (task.status == "todo") {
        tdProgress.innerHTML = `<div class="tdProgress tdProgressTodo"><i class="fas fa-circle"></i><span>Todo</span></div>`;
    } else if (task.status == "doing") {
        tdProgress.innerHTML = `<div class="tdProgress tdProgressDoing"><i class="fas fa-clock"></i><span>Doing</span></div>`;
    } else if (task.status == "done") {
        tdProgress.innerHTML = `<div class="tdProgress tdProgressDone"><i class="fas fa-check-circle"></i><span>Done</span></div>`;
    }



    let date = new Date(parseInt(task.duedate));
    //only get date and month in short
    tdTime.innerHTML = "<div>" + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + "</div>";
    tdTime.classList.add("dashboard-timedue");

    //get time left
    let timeleft = date.getTime() - Date.now();
    let daysleft = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    let hoursleft = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutesleft = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    let secondsleft = Math.floor((timeleft % (1000 * 60)) / 1000);


    //if overdue
    if (timeleft < 0) {
        tdTimeLeft.innerHTML = "<div>Overdue</div>";
        tdTimeLeft.classList.add("overdue");
        tdTimeLeft.classList.add("dashboard-timeleft");
    } else {
        tdTimeLeft.innerHTML = "<div>" + daysleft + "d " + hoursleft + "h " + minutesleft + "m " + secondsleft + "s</div>";
        tdTimeLeft.classList.add("dashboard-timeleft");
    }



    tr.appendChild(tdName);
    tr.appendChild(tdAdmin);
    tr.appendChild(tdMember);
    tr.appendChild(tdProgress);
    tr.appendChild(tdTime);
    tr.appendChild(tdTimeLeft);
    tabledata.appendChild(tr);
}





function doneLoading() {
    document.getElementById("preloader").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
    }, 400);

}


function renderChart() {
    var options = {
        series: [{
            name: 'Tốc độ gửi',
            data: [31, 40, 28, 51, 42, 109, 100]
        }, {
            name: 'Tốc độ phản hồi',
            data: [11, 32, 45, 32, 34, 52, 41]
        }],
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
    };
    var chart = new ApexCharts(document.querySelector("#chart1"), options);
    chart.render();

    options = {
        series: [{
            data: [44, 55, 41, 64, 22, 43, 21]
        }, {
            data: [53, 32, 33, 52, 13, 44, 32]
        }],
        chart: {
            type: 'bar',
            height: 430
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'top',
                },
            }
        },
        dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff']
            }
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
        },
        tooltip: {
            shared: true,
            intersect: false
        },
        xaxis: {
            categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
        },
    };

    chart = new ApexCharts(document.querySelector("#chart2"), options);
    chart.render();



}


