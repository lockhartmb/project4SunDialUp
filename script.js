
const app = {};

// Get user time, which is already in 24 hours and divide into hours and minutes. Then convert into a total number of user minutes
app.getUserTime = () => {
    const today = new Date();
    app.hours = today.getHours();
    // console.log(app.hours);
    app.minutes = today.getMinutes();
    // console.log(app.minutes);
    app.seconds = today.getSeconds();

    app.userMinutes = app.currentTotalMinutes(app.hours, app.minutes);
    // console.log(app.userMinutes);
}

// Takes number of hours and number of minutes and converts to one total number of minutes
app.currentTotalMinutes = (hours, minutes) => {
    return (hours * 60) + minutes;

}

// Takes the time and extracts the hours, then converts to EST by subtracting 5 hours, returns minutes
app.convertToEST = (time) => {
    let datePlaceholder = new Date(`February 20, 2019 ${time}`);
    app.hourInEST = datePlaceholder.getHours();
    app.hourInEST = app.hourInEST - 5;
    return app.hourInEST;
}

// Takes the time and extracts the number of minutes, returns minutes
app.updateMinute = (time) => {
    datePlaceholder = new Date(`February 20, 2019 ${time}`);
    app.updatedMinute = datePlaceholder.getMinutes();
    // console.log(app.updatedMinute);
    return app.updatedMinute;
}

// AJAX request to Sunrise/Sunset API
app.getSunTimes = () => {
    const longitude = -79.398003;
    const latitude = 43.648190;
    const url = 'https://api.sunrise-sunset.org/json';

    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json',
        data: {
            lat: latitude,
            lng: longitude,
        }
    }).then((sunData) => {
        app.sunrise = sunData.results.sunrise;
        app.sunset = sunData.results.sunset;
        // app.morningTwilight = sunData.results.civil_twilight_begin;
        // app.eveningTwilight = sunData.results.civil_twilight_end;
        // console.log(app.sunrise);
        app.sunriseUpdate();
        app.sunsetUpdate();
        app.displayColors();
    });
}

// Takes the sunrise time from the API call, extracts hours and converts to EST, extracts minutes, then combines them into a total number of minutes
app.sunriseUpdate = () => {
    app.sunriseHour = app.convertToEST(app.sunrise);
    // console.log(app.sunriseHour);
    app.sunriseMinute = app.updateMinute(app.sunrise);
    app.sunriseMinutes = app.currentTotalMinutes(app.sunriseHour, app.sunriseMinute);
    console.log(app.sunriseMinutes);
}

app.sunsetUpdate = () => {
    app.sunsetHour = app.convertToEST(app.sunset);
    app.sunsetMinute = app.updateMinute(app.sunset);
    app.sunsetMinutes = app.currentTotalMinutes(app.sunsetHour, app.sunsetMinute);
    console.log(app.sunsetMinutes);
}





app.init = () => {
    app.getUserTime();
    app.getSunTimes();
    app.currentTotalMinutes(4,7);
}

// doc ready
$(document).ready(function(){
    app.init();
    
}) //ends doc ready


// OTHER STUFF

// getting today time in the day in minutes
    // console.log(newEST * 60 + timeEST[1]);


// COLOR STUFF

app.hexValue = 100000;

colorChange = () => {
    app.hexValue = app.hexValue + 1;
    rgbArray = chroma(app.hexValue);
    rgbObject = rgbArray._rgb;
    app.rgbCSS = chroma(rgbObject).css();

    console.log(app.rgbCSS);
    $("main").css("background-color", app.rgbCSS);
}

app.displayColors = () => {
    const scaleTest = chroma
        .scale(["rgb(0,0,0)", "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
        // .mode("lch")
        .domain([0, `${app.sunriseMinutes}`, 600, 1100, 1440])
        .colors(1440);


    console.log(scaleTest);

    const interval = 10;

    const colorTest = scaleTest.forEach((color, index) => {
        setTimeout(function () {
            color = chroma(color).css();
            $("main").css("background-color", color)
            console.log(color);
        }, index * interval);
    });

    console.log("LOOP FINISHED!");
}







// setInterval(function () {
//         $("main").css("background-color", color)
//     }, 1000);


