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
var listTask = [];

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

//Get database data from firebase
function getDatabaseData() {
    const useruid = auth.currentUser;
    //get data todolist from firebase realtime
    if (useruid == null) {
        setTimeout(function () {
            getDatabaseData();
            console.log("waiting for useruid, loading data again");
        }, 1000);
        return;
    }
    //get how long it take firebase
    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist");
    get(todoRef).then((snapshot) => {
        console.log("Done get data from firebase");
        doneLoading();
        if (snapshot.exists()) {
            listTask = snapshot.val();
            loadDataTask(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
        
        //cancel dragula
        //loaded
        
    });

}


function loadDataTask(data, preload = false) {
    $(".task-item").remove();
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
        let additionalClass = "";
        if (preload == true) additionalClass = "task-item-preload";
        addTask(task, additionalClass);
    }
    //done add task
}

//Add task to html
function addTask(task, additionalClass = "") {
    console.log("adding " + task);
    const status = task.status;
    //status: todo, doing, done
    const title = task.title;
    const desc = task.desc;
    const category = task.category;
    const keyid = task.keyid;
    const duedate = task.duedate;
    const priority = task.priority;

    //convert milisecond to date
    let date = new Date(duedate);
    const duedateString = date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    date = date.getTime();

    const todoList = document.getElementById(status);
    const taskItem = document.createElement("div");
    taskItem.innerHTML = `
        <div class="task-item ${additionalClass}" data-keyid="${keyid}">
            <div class="task-item-header">
                <i class="fas fa-circle" style="margin-right:10px;"></i>
                <span>${category}</span>
                <i class="fas fa-ellipsis-h task-item-header-icon"></i>
                <i class="fas fa-trash-alt task-item-trash"></i>
            </div>
            <p class="task-item-title">${title}</p>
            <p class="task-item-desc">${desc}</p>
            <div class="due-date">
                <i class="fas fa-calendar-alt"></i>
                <span>Due date</span>
                <h2 data_date="${date}">${duedateString}</h2>
            </div>
            <div class="priority">
                <i class="fas fa-flag"></i>
                <span>Priority</span>
                <h2>Loading...</h2>
            </div>
            <div class="time-left">
                <i class="fas fa-clock"></i>
                <span>Time left</span>
                <h2>Loading...</h2>
            </div>
        </div>`;
    todoList.appendChild(taskItem);
}

//When done load all the task
function doneLoading() {
    console.log("done loading");
    document.getElementById("preloader").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
        const taskItem = document.getElementsByClassName("task-item");
        for (let i = 0; i < taskItem.length; i++) {
            //delay each task
            setTimeout(function () {
                taskItem[i].classList.remove("task-item-preload");
            }, 50 * i);
        }
    }, 400);
        
}



//add new task
$(".fa-plus.board-header-icon").click(function () {
    const status = $(this).attr("data-status");
    //toggle
    if ($(".add-task").hasClass("add-task-active")) {
        $(".add-task").removeClass("add-task-active");
        return;
    }
    $(".add-task").addClass("add-task-active");
    currentStatusAdd = status;
    $("#title").val("");
    $("#description").val("");
    $("#category").val("");
});


//cancel add task
$("#btn_cancel").click(function () {
    $(".add-task").removeClass("add-task-active");
});


//confirm add task
$("#btn_add").click(function () {
    console.log("adding task to " + currentStatusAdd);
    const title = $("#title").val();
    const desc = $("#description").val();
    const category = $("#category").val();
    const duedate = $("#due_date").val();
    const priority = $("#priority").val();

    //Convert date to milisecond
    const date = new Date(duedate);
    const duedateMilisecond = date.getTime();
    if (title == "" || desc == "" || category == "" || duedate == "") {
        alert("Please fill all the field");
        return;
    }


    //console.log(duedateMilisecond);
    const task = new TaskTodo(
        currentStatusAdd,
        title,
        desc,
        category,
        null,
        duedateMilisecond,
        priority
    );
    $(".add-task").removeClass("add-task-active");
    //add data to firebase
    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist");
    const newTodoRef = push(todoRef);
    set(newTodoRef, {
        title: title,
        desc: desc,
        category: category,
        status: currentStatusAdd,
        duedate: duedateMilisecond,
        priority: priority
    });

    //get key in firebase
    const keyid = newTodoRef.key;
    task.keyid = keyid;

    //add data to html
    addTask(task);

    //animate
    $(".task-item-preload").removeClass("task-item-preload");
});



//drag task with dragcula
dragula([document.getElementById("todo"), document.getElementById("doing"), document.getElementById("done")]
    , {
        moves: function (el, container, handle) {
            return handle.classList.contains("task-item");
        },
        accepts: function (el, target, source, sibling) {
            if (sibling == undefined) {
                return true;
            }
            //can't move on top of task header
            if (sibling.classList.contains("board-header")) {
                return false;
            }
            return true;
        },
        revertOnSpill: true,

    }
).on("drop", function (el) {
    const status = el.parentElement.id;
    const title = el.getElementsByClassName("task-item-title")[0].innerHTML;
    const desc = el.getElementsByClassName("task-item-desc")[0].innerHTML;
    const category = el.getElementsByClassName("task-item-header")[0].getElementsByTagName("span")[0].innerHTML;
    const keyid = el.getAttribute("data-keyid");
    const dueDate = el.getElementsByClassName("due-date")[0].getElementsByTagName("h2")[0].innerHTML;
    const priority = el.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].innerHTML;

    //convert date to milisecond
    const date = new Date(dueDate);
    const dueDateMilisecond = date.getTime();


    const task = new TaskTodo(
        status,
        title,
        desc,
        category,
        keyid,
        dueDateMilisecond,
        priority
    );
    //update data to firebase
    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist");
    get(todoRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let i in data) {
                const todo = data[i];
                if (todo.title == title) {
                    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist/" + i);
                    set(todoRef, {
                        title: title,
                        desc: desc,
                        category: category,
                        status: status,
                        duedate: dueDateMilisecond,
                        priority: priority
                    });
                }
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
        //cancel dragula
        //loaded


    });
});

//Edit task event, remove task
document.addEventListener("click", function (e) {

    const taskItem = e.target.closest(".task-item");
    if (taskItem == null) return;

    //if not trash
    if (e.target.classList.contains("task-item-trash")) {
        const taskItem = e.target.closest(".task-item");
        if (taskItem == null) return;
        //animate
        taskItem.classList.add("task-item-remove");

        setTimeout(() => {
            const keyid = taskItem.getAttribute("data-keyid");
            const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist/" + keyid);
            set(todoRef, null);
            taskItem.remove();
        }, 500);
        return;
    }

    if ($(".edit-task").hasClass("edit-task-active")) {
        $(".edit-task").removeClass("edit-task-active");
        return;
    }
    $(".edit-task").addClass("edit-task-active");

    //fill current data
    const title = taskItem.getElementsByClassName("task-item-title")[0].innerHTML;
    const desc = taskItem.getElementsByClassName("task-item-desc")[0].innerHTML;
    const category = taskItem.getElementsByClassName("task-item-header")[0].getElementsByTagName("span")[0].innerHTML;
    const keyid = taskItem.getAttribute("data-keyid");
    let dueDate = parseInt(taskItem.getElementsByClassName("due-date")[0].getElementsByTagName("h2")[0].getAttribute("data_date"));
    let date = new Date(dueDate);
    $("#title_edit").val(title);
    $("#description_edit").val(desc);
    $("#category_edit").val(category);
    $("#due_date_edit").val(date.toISOString().split('T')[0]);

    
    
    currentStatusAdd = taskItem.parentElement.id;

});

//cancel edit task
$("#btn_cancel_edit").click(function () {
    $(".edit-task").removeClass("edit-task-active");
});

//close add task and edit task when click outside
$(".edit-task-blur").click(function () {
    $(".edit-task").removeClass("edit-task-active");
});
$(".add-task-blur").click(function () {
    $(".add-task").removeClass("add-task-active");
});


//close add task and edit task
$(".btn_close").click(function () {
    $(".edit-task").removeClass("edit-task-active");
    $(".add-task").removeClass("add-task-active");
});



//confirm edit task
$("#btn_edit").click(function () {
    const title = $("#title_edit").val();
    const desc = $("#description_edit").val();
    const category = $("#category_edit").val();
    const taskItem = document.getElementsByClassName("task-item")[0];
    const keyid = taskItem.getAttribute("data-keyid");
    const duedate = $("#due_date_edit").val();

    const date = new Date(duedate); 
    const duedateMilisecond = date.getTime();
    if (title == "" || desc == "" || category == "" || duedate == "") {
        alert("Please fill all the field");
        return;
    }
    const priority = $("#priority_edit").val();
    const task = new TaskTodo(
        currentStatusAdd,
        title,
        desc,
        category,
        keyid,
        duedateMilisecond,
        priority
    );
    $(".edit-task").removeClass("edit-task-active");
    //update data to firebase
    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist/" + keyid);
    set(todoRef, {
        title: title,
        desc: desc,
        category: category,
        status: currentStatusAdd,
        duedate: duedateMilisecond,
        priority: priority
    });
    //update data to html
    taskItem.getElementsByClassName("task-item-title")[0].innerHTML = title;
    taskItem.getElementsByClassName("task-item-desc")[0].innerHTML = desc;
    taskItem.getElementsByClassName("task-item-header")[0].getElementsByTagName("span")[0].innerHTML = category;
    taskItem.getElementsByClassName("due-date")[0].getElementsByTagName("h2")[0].innerHTML = duedate;
    taskItem.getElementsByClassName("due-date")[0].getElementsByTagName("h2")[0].setAttribute("data_date", duedateMilisecond);
    
});


//block mouse down text event
document.addEventListener("mousedown", function (e) {
    const taskItem = e.target.closest(".task-item");
    if (taskItem != null) {
        e.preventDefault();
    }
});



//Update time left and priority
setInterval(function () {
    let taskItem = document.getElementsByClassName("task-item");
    for (let i = 0; i < taskItem.length; i++) {
        const task = taskItem[i];
        if (task.parentElement.parentElement.id == "done") {
            task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].innerHTML = "Done";
            task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].style.color = "#00ff00";
            task.getElementsByClassName("task-item-header")[0].getElementsByTagName("i")[0].style.color = "#00ff00";
            task.getElementsByClassName("time-left")[0].getElementsByTagName("h2")[0].innerHTML = "Done";
            continue;
        }
        const dueDate = task.getElementsByClassName("due-date")[0].getElementsByTagName("h2")[0].getAttribute("data_date");
        const date = new Date(parseInt(dueDate));
        const now = new Date();
        const timeLeft = date - now;
        let timeLeftString = "";
        if (timeLeft < 0) {
            timeLeftString = "Overdue by " + Math.round(Math.abs(timeLeft / 1000 / 60 / 60 / 24)) + " days";
            //Update priority
            task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].innerHTML = "Overdue";
            task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].style.color = "#ff0000";
            task.getElementsByClassName("task-item-header")[0].getElementsByTagName("i")[0].style.color = "#ff0000";
        } else {
            const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24);
            const hours = Math.floor(timeLeft / 1000 / 60 / 60) % 24;
            const minutes = Math.floor(timeLeft / 1000 / 60) % 60;
            const seconds = Math.floor(timeLeft / 1000) % 60;
            timeLeftString = days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds";
            //Update priority and color
            if (days < 1) {
                task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].innerHTML = "High";
                task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].style.color = "#ff0000";
                task.getElementsByClassName("task-item-header")[0].getElementsByTagName("i")[0].style.color = "#ff0000";

            }
            else if (days < 3) {
                task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].innerHTML = "Medium";
                task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].style.color = "#ff9900";
                task.getElementsByClassName("task-item-header")[0].getElementsByTagName("i")[0].style.color = "#ff9900";

            }
            else {
                task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].innerHTML = "Low";
                task.getElementsByClassName("priority")[0].getElementsByTagName("h2")[0].style.color = "#00ff00";
                task.getElementsByClassName("task-item-header")[0].getElementsByTagName("i")[0].style.color = "#00ff00";
            }
            
        }
        
        task.getElementsByClassName("time-left")[0].getElementsByTagName("h2")[0].innerHTML = timeLeftString;


        
    }

}, 50);


//search
$("#searchbar").keyup(function () {
    if (listTask.length == 0) {
        return;
    }
    let data = listTask;
    let newdata = [];
    const search = $("#searchbar").val().toLowerCase();
    for (let i in data) {
        const todo = data[i];
        const title = todo.title.toLowerCase();
        if (title.includes(search)) {
            newdata.push(todo);
        }
    }
    loadDataTask(newdata);
});