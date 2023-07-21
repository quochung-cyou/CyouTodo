const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
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

const btnSignin = document.getElementById("btn_signin");
const btnSignup = document.getElementById("btn_signup");


//prevent auto refresh when using form
$("form").submit(function(e) {
    e.preventDefault();
});

//sign in function
btnSignin.addEventListener("click", function() {
    //Sign in with email and password on click button
    const email = document.getElementById("emailSignin").value;
    const password = document.getElementById("passwordSignin").value;
    
    //check if password weak
    if (password.length < 6) {
        $(".errorMsg").html("Password must be at least 6 characters");
        $(".errorMsg").attr("style", "display: block;");
        return;
    }

    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
    }
    ).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        $(".errorMsg").attr("style", "display: block;");
        if (errorMessage == "Firebase: Error (auth/email-already-in-use).") {
            $(".errorMsg").html("Email already in use");
        } 
        else if (errorMessage == "Firebase: Error (auth/invalid-email).") {
            $(".errorMsg").html("Invalid email");
        }
        else if (errorMessage == "Firebase: Error (auth/weak-password).") {
            $(".errorMsg").html("Password must be at least 6 characters");
        }
        else {
            $(".errorMsg").html("Invalid email or password");
        }

        // ..
    }
    );
   
}); 


//sign up function
btnSignup.addEventListener("click", function() {
    //Sign up with email and password on click button
    const email = document.getElementById("emailSignup").value;
    const password = document.getElementById("passwordSignup").value;
    const name = document.getElementById("nameSignup").value;

    //check if password weak
    if (password.length < 6) {
        $(".errorMsg").html("Password must be at least 6 characters");
        $(".errorMsg").attr("style", "display: block;");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        // ...
    }
    ).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        $(".errorMsg").attr("style", "display: block;");
        if (errorMessage == "Firebase: Error (auth/email-already-in-use).") {
            $(".errorMsg").html("Email already in use");
        } 
        else if (errorMessage == "Firebase: Error (auth/invalid-email).") {
            $(".errorMsg").html("Invalid email");
        }
        else if (errorMessage == "Firebase: Error (auth/weak-password).") {
            $(".errorMsg").html("Password must be at least 6 characters");
        } else {
            $(".errorMsg").html("Invalid email or password");
        }


        // ..
    }
    );
}); 


//redirect to main page
auth.onAuthStateChanged(function(user) {
    console.log(user + " moving to index");
    if (user) {
        window.location.href = "index.html";
    } 
}
);

//preloader
window.onload = function() {
    setTimeout(function() {
        document.getElementById("preloader").style.opacity = 0;
        setTimeout(function() {
            document.getElementById("preloader").style.display = "none";
        }, 600);
    }, 800);

};