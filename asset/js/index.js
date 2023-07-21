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

function TaskTodo(status, title, desc, category, keyid) {
    this.status = status;
    this.title = title;
    this.desc = desc;
    this.category = category;
    this.keyid = keyid;
}

//Get database data
function getDatabaseData() {
    const useruid = auth.currentUser;
    //get data todolist from firebase realtime
    if (useruid == null) {
        setTimeout(function () {
            getDatabaseData();
        }, 1000);
        return;
    }

    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist");
    get(todoRef).then((snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (let i in data) {
                const todo = data[i];
                //get key in firebase
                const keyid = i;
                console.log(keyid + " " + todo.title + " " + todo.status);
                if (todo.status != "todo" && todo.status != "doing" && todo.status != "done") {
                    todo.status = "todo";
                }
                const task = new TaskTodo(
                    todo.status,
                    todo.title,
                    todo.desc,
                    todo.category,
                    i
                );
                addTask(task);
            }

            //done add task
            setTimeout(function () {
                document.getElementById("preloader").style.opacity = 0;
                setTimeout(function () {
                    document.getElementById("preloader").style.display = "none";
                }, 500);
            }, 800);
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

}

function addTask(task) {
    const status = task.status;
    //status: todo, doing, done
    const title = task.title;
    const desc = task.desc;
    const category = task.category;
    const keyid = task.keyid;
    const todoList = document.getElementById(status);
    const taskItem = document.createElement("div");
    taskItem.innerHTML = `
        <div class="task-item" data-keyid="${keyid}">
        <div class="task-item-header">
            <i class="fas fa-circle" style="margin-right:10px;"></i>
            <span>${category}</span>
            <i class="fas fa-ellipsis-h task-item-header-icon"></i>
        </div>
        <p class="task-item-title">${title}</p>
        <p class="task-item-desc">${desc}</p>
        </div>`;
    todoList.appendChild(taskItem);
}

function addDatabaseData() {
    //add data todolist to firebase realtime
    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist");
    const newTodoRef = push(todoRef);
    set(newTodoRef, {
        title: "Do homework",
        status: "incomplete"
    });
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
    const title = $("#title").val();
    const desc = $("#description").val();
    const category = $("#category").val();
    const task = new TaskTodo(
        currentStatusAdd,
        title,
        desc,
        category,
    );
    $(".add-task").removeClass("add-task-active");
    //add data to firebase
    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist");
    const newTodoRef = push(todoRef);
    set(newTodoRef, {
        title: title,
        desc: desc,
        category: category,
        status: currentStatusAdd
    });
    //get key in firebase
    const keyid = newTodoRef.key;
    task.keyid = keyid;
    //add data to html
    addTask(task);
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
    //animate

    const status = el.parentElement.id;
    const title = el.getElementsByClassName("task-item-title")[0].innerHTML;
    const desc = el.getElementsByClassName("task-item-desc")[0].innerHTML;
    const category = el.getElementsByClassName("task-item-header")[0].getElementsByTagName("span")[0].innerHTML;
    const task = new TaskTodo(
        status,
        title,
        desc,
        category,
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
                        status: status
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

//Edit task event
document.addEventListener("click", function (e) {

    const taskItem = e.target.closest(".task-item");
    if (taskItem != null) {
        if ($(".edit-task").hasClass("edit-task-active")) {
            $(".edit-task").removeClass("edit-task-active");
            return;
        }
        $(".edit-task").addClass("edit-task-active");

        //fill current data
        const title = taskItem.getElementsByClassName("task-item-title")[0].innerHTML;
        const desc = taskItem.getElementsByClassName("task-item-desc")[0].innerHTML;
        const category = taskItem.getElementsByClassName("task-item-header")[0].getElementsByTagName("span")[0].innerHTML;
        $("#title_edit").val(title);
        $("#description_edit").val(desc);
        $("#category_edit").val(category);
        currentStatusAdd = taskItem.parentElement.id;
    }
});

//cancel edit task
$("#btn_cancel_edit").click(function () {
    $(".edit-task").removeClass("edit-task-active");
});
$(".edit-task-blur").click(function () {
    $(".edit-task").removeClass("edit-task-active");
});


//confirm edit task
$("#btn_edit").click(function () {
    const title = $("#title_edit").val();
    const desc = $("#description_edit").val();
    const category = $("#category_edit").val();
    const taskItem = document.getElementsByClassName("task-item")[0];
    const keyid = taskItem.getAttribute("data-keyid");
    const task = new TaskTodo(
        currentStatusAdd,
        title,
        desc,
        category,
        keyid
    );
    $(".edit-task").removeClass("edit-task-active");
    //update data to firebase
    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist/" + keyid);
    set(todoRef, {
        title: title,
        desc: desc,
        category: category,
        status: currentStatusAdd
    });
    //update data to html
    taskItem.getElementsByClassName("task-item-title")[0].innerHTML = title;
    taskItem.getElementsByClassName("task-item-desc")[0].innerHTML = desc;
    taskItem.getElementsByClassName("task-item-header")[0].getElementsByTagName("span")[0].innerHTML = category;
});


//block mouse down text event
document.addEventListener("mousedown", function (e) {
    const taskItem = e.target.closest(".task-item");
    if (taskItem != null) {
        e.preventDefault();
    }
});