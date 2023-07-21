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
    setTimeout(function () {
        document.getElementById("preloader").style.opacity = 0;
        setTimeout(function () {
            document.getElementById("preloader").style.display = "none";
        }, 600);
    }, 200);

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