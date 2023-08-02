



lightmode.addEventListener("click", function () {
    let ele = document.getElementById("darklightmode-highlight");
    if (ele.classList.contains("darkmodehl")) {
        ele.classList.remove("darkmodehl");
        let lightmodebutton = document.getElementById("lightmode");
        lightmodebutton.classList.remove("uncheck");
        let darkmodebutton = document.getElementById("darkmode");
        darkmodebutton.classList.add("uncheck");
    }
});

darkmode.addEventListener("click", function () {
    let ele = document.getElementById("darklightmode-highlight");
    if (!ele.classList.contains("darkmodehl")) {
        ele.classList.add("darkmodehl");
        let lightmodebutton = document.getElementById("lightmode");
        lightmodebutton.classList.add("uncheck");
        let darkmodebutton = document.getElementById("darkmode");
        darkmodebutton.classList.remove("uncheck");
    }
});

setInterval(function () {
    let date = new Date();

    $("#currenttime").html(date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + " " + date.toLocaleTimeString('en-US', { hour12: false }));
}, 1000);