// app namespace
const app = {};

// doc ready
$(document).ready(function () {
    app.init();
}) //ends doc ready

app.init = () => {
    app.getUserTime();
    app.getSunTimes();
}

// Get user time, which is already in 24 hours and divide into hours and minutes. Then convert into a total number of user minutes
app.getUserTime = () => {
    const today = new Date();
    app.hours = today.getHours();
    app.minutes = today.getMinutes();
    app.seconds = today.getSeconds();
    app.userMinutes = app.currentTotalMinutes(app.hours, app.minutes);
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
        app.sunriseUpdate();
        app.sunsetUpdate();
        app.noonUpdate();
        app.createColorArrays();
        
        app.displayColors();
    });
}

// Takes the sunrise time from the API call, extracts hours and converts to EST, extracts minutes, then combines them into a total number of minutes
app.sunriseUpdate = () => {
    app.sunriseHour = app.convertToEST(app.sunrise);
    app.sunriseMinute = app.updateMinute(app.sunrise);
    app.sunriseMinutes = app.currentTotalMinutes(app.sunriseHour, app.sunriseMinute);
}

app.sunsetUpdate = () => {
    app.sunsetHour = app.convertToEST(app.sunset);
    app.sunsetMinute = app.updateMinute(app.sunset);
    app.sunsetMinutes = app.currentTotalMinutes(app.sunsetHour, app.sunsetMinute);
}

app.noonUpdate = () => {
    app.noonHour = app.convertToEST(app.noon);
    app.noonMinute = app.updateMinute(app.noon);
    app.noonMinutes = app.currentTotalMinutes(app.noonHour, app.noonMinute);
}

// creates two arrays to make the top and bottom values of our linear gradient
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

// CLICK FUNCTION OF THE MENU BUTTONS
app.clickMenu = () => {
    $('a.menu').on('click', function(event) {
        event.preventDefault();

        if ($('a.menu').hasClass('clicked')) {
            $('.explanation').fadeOut(500);
            $('a.menu').removeClass('clicked');
        } else {
            $('.explanation').fadeIn(500);
            $('a.menu').addClass('clicked');
        };
    });

    $('a.realTime').on('click', function(event) {
        event.preventDefault();
        app.interval = 60000;
        app.loadUserTimeColors();
        $('.overlay').fadeOut(750);
    })

    $('a.fast').on('click', function(event) {
        event.preventDefault();
        app.interval = 150;
        app.loadUserTimeColors();
        $('.overlay').fadeOut(750);
    })
    
    $('a.realFast').on('click', function (event) {
        event.preventDefault();
        app.interval = 10;
        app.loadUserTimeColors();
        $('.overlay').fadeOut(750);
    })
};


app.init = () => {
    app.getUserTime();
    app.getSunTimes();
    app.clickMenu();
}

// creates the paired arrays and loops through them both to display the colors on the screen
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
        }, index * app.interval);
    })
}

app.interval = 10; //this will need to be 60,000 to be real time

app.displayColors = () => {
    app.topColors = chroma
        .scale(["rgb(0,0,0)", "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
        // .mode("lch")
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);

    app.bottomColors = chroma
        .scale(["rgb(50,50,50)", "rgb(238,196,30)", "rgb(255,255,255)", "rgb(236,183,226)", "rgb(74,71,71)"])
        // .mode("lch")
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);
}

app.runFullDayLoop = () => {
    app.colorPairs.forEach((colorPair, index) => {
        setTimeout(function () {
            $("main").css({ background: `linear-gradient(${colorPair[0]}, ${colorPair[1]})` });
        }, index * app.interval);
    })
}

app.fullDayColors = () => {
    app.createPairedArrays(app.topColors, app.bottomColors);
    app.displayColors();
    app.runFullDayLoop();
    app.longWait = app.topColors.length * app.interval;
    setTimeout(app.fullDayColors, app.longWait);
}

const arraySlice = (array) => {
    return array.slice(`${app.userMinutes}`);
}

app.loadUserTimeColors = () => {
    
    //slice the top and bottom color arrays to just include values remaining in the current user's day
    app.choppedTopColors = arraySlice(app.topColors);
    app.choppedBottomColors = arraySlice(app.bottomColors);

    // uses the length of the array to find the final value in the array to be iterated through
    app.choppedFinalValue = app.choppedTopColors.length;
    
    // calculates updates domain values
    app.choppedSunriseMinutes = app.sunriseMinutes - app.userMinutes;
    app.choppedNoonMinutes = app.noonMinutes - app.userMinutes;
    app.choppedSunsetMinutes = app.sunsetMinutes - app.userMinutes;

    if (app.userMinutes <= app.sunriseMinutes) {
        app.choppedTopColors = chroma
            .scale([`${app.choppedTopColors[0]}`, "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
            .domain([0, `${app.choppedSunriseMinutes}`, `${app.choppedNoonMinutes}`, `${app.choppedSunsetMinutes}`, `${app.choppedFinalValue}`])
            .colors(`${app.choppedFinalValue}`);

        app.choppedBottomColors = chroma
            .scale([`${app.choppedBottomColors[0]}`, "rgb(238,196,30)", "rgb(255, 255, 255)", "rgb(236,183,226)", "rgb(74,71,71)"])
            .domain([0, `${app.choppedSunriseMinutes}`, `${app.choppedNoonMinutes}`, `${app.choppedSunsetMinutes}`, `${app.choppedFinalValue}`])
            .colors(`${app.choppedFinalValue}`);

        app.createPairedArrays(app.choppedtopColors, app.choppedBottomColors);

    } else if (app.userMinutes <= app.noonMinutes) {
        app.choppedTopColors = chroma
            .scale([`${app.choppedTopColors[0]}`, "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
            .domain([0, `${app.choppedNoonMinutes}`, `${app.choppedSunsetMinutes}`, `${app.choppedFinalValue}`])
            .colors(`${app.choppedFinalValue}`);

        app.choppedBottomColors = chroma
            .scale([`${app.choppedBottomColors[0]}`, "rgb(255, 255, 255)", "rgb(236,183,226)", "rgb(74,71,71)"])
            .domain([0, `${app.choppedNoonMinutes}`, `${app.choppedSunsetMinutes}`, `${app.choppedFinalValue}`])
            .colors(`${app.choppedFinalValue}`);

        app.createPairedArrays(app.choppedTopColors, app.choppedBottomColors);

    } else if (app.userMinutes <= app.sunsetMinutes) {
        app.choppedTopColors = chroma
            .scale([`${app.choppedTopColors[0]}`, "rgb(104,62,233)", "rgb(0,0,0)"])
            .domain([0, `${app.choppedSunsetMinutes}`, `${app.choppedFinalValue}`])
            .colors(`${app.choppedFinalValue}`);

        app.choppedBottomColors = chroma
            .scale([`${app.choppedBottomColors[0]}`, "rgb(236,183,226)", "rgb(74,71,71)"])
            .domain([0, `${app.choppedSunsetMinutes}`, `${app.choppedFinalValue}`])
            .colors(`${app.choppedFinalValue}`);

        app.createPairedArrays(app.choppedTopColors, app.choppedBottomColors);

    } else if (app.userMinutes > app.sunsetMinutes) {
        app.choppedTopColors = chroma
            .scale([`${app.choppedTopColors[0]}`, "rgb(0,0,0)"])
            .domain([0, `${app.choppedFinalValue}`])
            .colors(`${app.choppedFinalValue}`);

        app.choppedBottomColors = chroma
            .scale([`${app.choppedBottomColors[0]}`, "rgb(74,71,71)"])
            .domain([0, `${app.choppedFinalValue}`])
            .colors(`${app.choppedFinalValue}`);

        app.createPairedArrays(app.choppedTopColors, app.choppedBottomColors);
    }
    // used to time when the full day functions should fire after the current day
    app.wait = app.choppedFinalValue * app.interval;
    setTimeout(app.fullDayColors, app.wait);
};