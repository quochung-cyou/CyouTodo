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
var listTodo = [];

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
    const todoRef = ref(db, "users/" + auth.currentUser.uid + "/todolist");
    get(todoRef).then((snapshot) => {
        if (snapshot.exists()) {
            doneLoading();
            loadData(snapshot.val());
            listTodo = snapshot.val();
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });

}

function loadData(data) {
    for (let i in data) {
        const todo = data[i];
        let date = new Date(parseInt(todo.duedate));
        // append to calendar
        console.log(todo.title + " " + date.getFullYear() + " " + date.getMonth() + " " + date.getDate());
        $('#calendar').calendar('appendText', todo.title, date.getFullYear(), date.getMonth(), date.getDate());
    }
}

$('#calendar').on('jqyc.changeYear', function (event) {
    $('#calendar').calendar('clearTextFromAll');
    loadData(listTodo);

});

function doneLoading() {

    $('#calendar').calendar();
    document.getElementById("preloader").style.opacity = 0;
    setTimeout(function () {
        document.getElementById("preloader").style.display = "none";
    }, 400);
}