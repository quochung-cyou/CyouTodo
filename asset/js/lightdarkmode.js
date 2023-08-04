



lightmode.addEventListener("click", function () {
    let ele = document.getElementById("darklightmode-highlight");
    if (ele.classList.contains("darkmodehl")) {
        //active light mode
        ele.classList.remove("darkmodehl");
        let lightmodebutton = document.getElementById("lightmode");
        lightmodebutton.classList.remove("uncheck");
        let darkmodebutton = document.getElementById("darkmode");
        darkmodebutton.classList.add("uncheck");


        startAnimation();
        setTimeout(function () {

            //for all element
            let all = document.getElementsByTagName("*");
            for (let i = 0; i < all.length; i++) {
                all[i].classList.remove("darkmode");
            }
            //remove for html and body
            let html = document.getElementsByTagName("html")[0];
            html.classList.remove("darkmode");
            let body = document.getElementsByTagName("body")[0];
            body.classList.remove("darkmode");
        }, 500);
        


    }

});

darkmode.addEventListener("click", function () {
    let ele = document.getElementById("darklightmode-highlight");
    if (!ele.classList.contains("darkmodehl")) {
        //for all element
        ele.classList.add("darkmodehl");
        let lightmodebutton = document.getElementById("lightmode");
        lightmodebutton.classList.add("uncheck");
        let darkmodebutton = document.getElementById("darkmode");
        darkmodebutton.classList.remove("uncheck");


        startAnimation();
        setTimeout(function () {
            //add for html and body
            let html = document.getElementsByTagName("html")[0];
            html.classList.add("darkmode");
            let body = document.getElementsByTagName("body")[0];
            body.classList.add("darkmode");
            let all = document.getElementsByTagName("*");
            for (let i = 0; i < all.length; i++) {
                all[i].classList.add("darkmode");
            }
        }, 500);
        


    }
});


function startAnimation(callback) {
    //add class
    $(".animation-circle").addClass("start");
    setTimeout(function () {
        $(".animation-circle").removeClass("start");
        $(".animation-circle").addClass("active");
        setTimeout(function () {
            $(".animation-circle").removeClass("active");
            //callback();
        }, 1000);
    }, 1);


}

setInterval(function () {
    let date = new Date();

    $("#currenttime").html(date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + " " + date.toLocaleTimeString('en-US', { hour12: false }));
}, 1000);