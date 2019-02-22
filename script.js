
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
        app.noon = sunData.results.solar_noon;
        // app.morningTwilight = sunData.results.civil_twilight_begin;
        // app.eveningTwilight = sunData.results.civil_twilight_end;
        // console.log(app.sunrise);
        app.sunriseUpdate();
        app.sunsetUpdate();
        app.noonUpdate();
        app.displayColors();
        app.createColorArrays();
        // loadUserTimeColors();
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

app.noonUpdate = () => {
    app.noonHour = app.convertToEST(app.noon);
    app.noonMinute = app.updateMinute(app.noon);
    app.noonMinutes = app.currentTotalMinutes(app.noonHour, app.noonMinute);
    console.log(app.noonMinutes);
}

app.createColorArrays = () => {
    app.topColors = chroma
        .scale(["rgb(0,0,0)", "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
        // .mode("lch")
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);

    app.bottomColors = chroma
        .scale(["rgb(74,71,71)", "rgb(238,196,30)", "rgb(255,255,255)", "rgb(236,183,226)", "rgb(74,71,71)"])
        // .mode("lch")
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);
}

app.createPairedArrays = (array1, array2) => {
    app.colorPairs = [];
    array1.map((color, i) => {
        let newPair = []
        newPair.push(color, array2[i])
        app.colorPairs.push(newPair)
    })
    app.colorPairs.forEach((colorPair, index) => {
        setTimeout(function () {
            $("main").css({ background: `linear-gradient(${colorPair[0]}, ${colorPair[1]})` });
            console.log(`${colorPair[0]}`)
        }, index * app.interval);
    })
}

app.displayColors = () => {
    app.topColors = chroma
        .scale(["rgb(0,0,0)", "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
        // .mode("lch")
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);

    app.bottomColors = chroma
        .scale(["rgb(74,71,71)", "rgb(238,196,30)", "rgb(255,255,255)", "rgb(236,183,226)", "rgb(74,71,71)"])
        // .mode("lch")
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);

    // const colorPairs = [];
    // topColors.map((color, i) => {
    //     // console.log(color, i)
    //     let newPair = []
    //     newPair.push(color, bottomColors[i])
    //     // console.log(newPair)
    //     colorPairs.push(newPair)
    // });

    // colorPairs.forEach(colorPair => {
    // console.log(`linear-gradient: to top, ${colorPair[0]}, ${colorPair[1]}`)
    // $("main").css("background-image", `linear-gradient: to top, ${colorPair[0]}, ${colorPair[1]}`);
    // console.log(colorPairs);
    // });

    app.interval = 10; //this will need to be 60,000 to be real time

    // const colorTest = colorPairs.forEach((colorPair, index) => {
    //     setTimeout(function () {
    //         color = chroma(color).css();
    //         $("main").css({
    //             // background: `-webkit-linear-gradient(to top, ${colorPair[0]}, ${colorPair[1]})`
    //         });
    //         // console.log(color);
    //     }, index * interval);
    // });

    // const colorTest = colorPairs.forEach((colorPair, index) => {
    //     setTimeout(function () {
    //         colorPair = chroma(colorPair).css();
    //         $("main").css("background-color", colorPair[0]);
    //         console.log(colorPair);
    //     }, index * interval);
    // });


    // WE MAY NOT NEED THIS ANYMORE SINCE IT STILL WORKS WITHOUT IT
    // const arrayFormat = (array) => {
    //     array.forEach((color) => {
    //         color = chroma(color).css();
    //     });
    // }

    // it still works without this? do we still need it?
    // arrayFormat(topColors);
    // arrayFormat(bottomColors);

    app.createPairedArrays(app.topColors, app.bottomColors);
    
}



app.init = () => {
    app.getUserTime();
    app.getSunTimes();
}

// doc ready
$(document).ready(function(){
    app.init();
    
}) //ends doc ready


// OTHER STUFF

// getting today time in the day in minutes
    // console.log(newEST * 60 + timeEST[1]);


// COLOR STUFF

const arraySlice = (array) => {
    return array.slice(`${app.userMinutes}`);
}







// loadUserTimeColors = () => {
    

//     //slice the top and bottom color arrays to just include values remaining in the current user's day
//     app.choppedTopColors = arraySlice(app.topColors);
//     app.choppedBottomColors = arraySlice(app.bottomColors);

//     // uses the length of the array to find the final value in the array to be iterated through
//     app.choppedFinalValue = app.choppedTopColors.length;
    
//     // calculates updates domain values
//     app.choppedSunriseMinutes = app.sunriseMinutes - app.userMinutes;
//     app.choppedNoonMinutes = app.noonMinutes - app.userMinutes;
//     app.choppedSunsetMinutes = app.sunsetMinutes - app.userMinutes;

    

//     if (app.userMinutes <= app.sunriseMinutes) {
//         console.log("BEFORE SUNRISE");

//         app.choppedTopColors = chroma
//             .scale([`${app.choppedTopColors[0]}`, "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
//             .domain([0, `${app.choppedSunriseMinutes}`, `${app.choppedNoonMinutes}`, `${app.choppedSunsetMinutes}`, `${app.choppedFinalValue}`])
//             .colors(`${app.choppedFinalValue}`);

//         app.choppedBottomColors = chroma
//             .scale([`${app.choppedTopColors[0]}`, "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
//             .domain([0, `${app.choppedSunriseMinutes}`, `${app.choppedNoonMinutes}`, `${app.choppedSunsetMinutes}`, `${app.choppedFinalValue}`])
//             .colors(`${app.choppedFinalValue}`);

//         app.createPairedArrays(app.topColors, app.bottomColors);

//     } else if (app.userMinutes <= app.noonMinutes) {
//         console.log("BEFORE NOON");
//     } else if (app.userMinutes <= app.sunsetMinutes) {
//         console.log("BEFORE SUNSET");
//     } else if (app.userMinutes > app.sunsetMinutes) {
//         console.log("IT'S EVENING, YO!");

//         app.choppedTopColors = chroma
//             .scale([`${app.choppedTopColors[0]}`, "rgb(0,0,0)"])
//             .domain([0, `${app.choppedFinalValue}`])
//             .colors(`${app.choppedFinalValue}`);

//         app.createPairedArrays(app.choppedTopColors, app.choppedBottomColors);
//     }
// }


