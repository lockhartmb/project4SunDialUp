
const app = {};

app.getUserTime = () => {
    app.hours = getHours();
    app.minutes = getMinutes();
    app.seconds = getSeconds();
    return `{}`
}

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
        console.log(sunData);
        app.sunrise = sunData.results.sunrise;
        app.sunset = sunData.results.sunset
        console.log(app.sunrise);
        app.updateHour(app.sunrise);
        app.updateMinute(app.sunrise);
    });
}

app.updateHour = (time) => {
    let datePlaceholder = new Date (`February 20, 2019 ${time}`)
    let currentHour = datePlaceholder.getHours();
    currentHour = currentHour - 5;
    console.log(currentHour);  
}

app.updateMinute = (time) => {
    let datePlaceholder = new Date(`February 20, 2019 ${time}`)
    let currentMinute = datePlaceholder.getMinutes();
    console.log(currentMinute);
}


// doc ready
$(document).ready(function(){
    app.getSunTimes();
    // app.toEST();
}) //ends doc ready


// OTHER STUFF

// getting today time in the day in minutes
    // console.log(newEST * 60 + timeEST[1]);