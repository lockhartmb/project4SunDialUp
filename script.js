// App namespace
const app = {};

// Doc ready
$(document).ready(function () {
    app.init();
}) //Ends doc ready

app.init = () => {
    app.getUserTime();
    app.getSunTimes();
    app.clickMenu();
}

// Get user time, which is already in 24 hours and divide into hours and minutes. Then convert into a total number of user minutes
app.getUserTime = () => {
    const today = new Date();
    app.hours = today.getHours();
    app.minutes = today.getMinutes();
    app.userMinutes = app.currentTotalMinutes(app.hours, app.minutes);
}

// Takes a number of hours and a number of minutes and converts to one total number of minutes
app.currentTotalMinutes = (hours, minutes) => {
    return (hours * 60) + minutes;
}

// Takes the time provided by the API and extracts the number of hours, then converts to EST by subtracting 5 hours, returns hours
app.convertToEST = (time) => {
    let datePlaceholder = new Date(`February 20, 2019 ${time}`);
    app.hourInEST = datePlaceholder.getHours();
    app.hourInEST = app.hourInEST - 5;
    return app.hourInEST;
}

// Takes the time provided by the API and extracts the number of minutes, returns minutes
app.updateMinute = (time) => {
    datePlaceholder = new Date(`February 20, 2019 ${time}`);
    app.updatedMinute = datePlaceholder.getMinutes();
    return app.updatedMinute;
}

// AJAX request to Sunrise/Sunset API using latitude and longitude of Toronto, Canada
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

// Takes the sunset time from the API call, extracts hours and converts to EST, extracts minutes, then combines them into a total number of minutes
app.sunsetUpdate = () => {
    app.sunsetHour = app.convertToEST(app.sunset);
    app.sunsetMinute = app.updateMinute(app.sunset);
    app.sunsetMinutes = app.currentTotalMinutes(app.sunsetHour, app.sunsetMinute);
}

// Takes the solar noon time from the API call, extracts hours and converts to EST, extracts minutes, then combines them into a total number of minutes
app.noonUpdate = () => {
    app.noonHour = app.convertToEST(app.noon);
    app.noonMinute = app.updateMinute(app.noon);
    app.noonMinutes = app.currentTotalMinutes(app.noonHour, app.noonMinute);
}

// Using the chroma library, creates two arrays to make the top and bottom values of our linear gradient
app.createColorArrays = () => {
    app.topColors = chroma
        .scale(["rgb(0,0,0)", "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);

    app.bottomColors = chroma
        .scale(["rgb(74,71,71)", "rgb(238,196,30)", "rgb(255,255,255)", "rgb(236,183,226)", "rgb(74,71,71)"])
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);
}

// Defines the functionality of the menu button and speed buttons inside the overlay
app.clickMenu = () => {
    $('a.menu').on('click', function(event) {
        event.preventDefault();

        // When the menu button is clicked, fade in the explanation. Click again, and the expanation fades out
        if ($('a.menu').hasClass('clicked')) {
            $('.explanation').fadeOut(500);
            $('a.menu').removeClass('clicked');
            $('.menuButton i').toggleClass('iconDisplay');
        } else {
            $('.explanation').fadeIn(500);
            $('a.menu').addClass('clicked');
            $('.menuButton i').toggleClass('iconDisplay');
        };
    });

    // When the "real time" button is clicked, change the transition interval to 60000 which will change the background color once per minute, and fade out the overlay to begin
    $('a.realTime').on('click', function(event) {
        event.preventDefault();
        app.interval = 60000;
        app.loadUserTimeColors();
        $('.overlay').fadeOut(750);
    })

    // When the "fast" button is clicked, decrease the transition interval to speed up the changing of the background, and fade out the overlay to begin
    $('a.fast').on('click', function(event) {
        event.preventDefault();
        app.interval = 150;
        app.loadUserTimeColors();
        $('.overlay').fadeOut(750);
    })
    
    // When the "real fast" button is clicked, decrease the transition interval to speed up the changing of the background even more, and fade out the overlay to begin
    $('a.realFast').on('click', function (event) {
        event.preventDefault();
        app.interval = 10;
        app.loadUserTimeColors();
        $('.overlay').fadeOut(750);
    })
};

// Creates the paired arrays and loops through them both to display the colors on the screen
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

// The interval defines how quickly the background changes. An interval of 60000ms (1 minute) changes the background color once per minute
app.interval = 60000; 

// Uses chroma to create the arrays of colors that will be displayed. Each array is 1440 items long, one color for every minute of the day, with defined anchors for sunrise, noon, and sunset from the API
app.displayColors = () => {
    app.topColors = chroma
        .scale(["rgb(0,0,0)", "rgb(227,116,58)", "rgb(116, 228, 238)", "rgb(104,62,233)", "rgb(0,0,0)"])
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);

    app.bottomColors = chroma
        .scale(["rgb(50,50,50)", "rgb(238,196,30)", "rgb(255,255,255)", "rgb(236,183,226)", "rgb(74,71,71)"])
        .domain([0, `${app.sunriseMinutes}`, `${app.noonMinutes}`, `${app.sunsetMinutes}`, 1440])
        .colors(1440);
}

// Start at midnight, and display all the colors in the paired array, one per minute
app.runFullDayLoop = () => {
    app.colorPairs.forEach((colorPair, index) => {
        setTimeout(function () {
            $("main").css({ background: `linear-gradient(${colorPair[0]}, ${colorPair[1]})` });
        }, index * app.interval);
    })
}

// Runs a series of functions to display a full 24 hours of colors. The longWait function tells it to wait one full day length and then run the whole day again, forever and ever
app.fullDayColors = () => {
    app.createPairedArrays(app.topColors, app.bottomColors);
    app.displayColors();
    app.runFullDayLoop();
    app.longWait = app.topColors.length * app.interval;
    setTimeout(app.fullDayColors, app.longWait);
}

// Takes the passed array and slices based on the user's time in the day
app.arraySlice = (array) => {
    return array.slice(`${app.userMinutes}`);
}

// Functions to figure out where the user is in the day and start displaying colors at that point in the array
app.loadUserTimeColors = () => {
    
    // Slice the top and bottom color arrays to just include values remaining in the current user's day
    app.choppedTopColors = app.arraySlice(app.topColors);
    app.choppedBottomColors = app.arraySlice(app.bottomColors);

    // Uses the length of the array to find the final value in the array to be iterated through
    app.choppedFinalValue = app.choppedTopColors.length;
    
    // Calculates and updates domain values
    app.choppedSunriseMinutes = app.sunriseMinutes - app.userMinutes;
    app.choppedNoonMinutes = app.noonMinutes - app.userMinutes;
    app.choppedSunsetMinutes = app.sunsetMinutes - app.userMinutes;

    // When user loads page before sunrise...
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
    
    // When user loads page between sunrise and noon...
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

    // When user loads page between noon and sunset...
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

    // When user loads page after sunset...
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

    // Used to time when the full day functions should fire after the current partial day is complete
    app.wait = app.choppedFinalValue * app.interval;
    setTimeout(app.fullDayColors, app.wait);
};