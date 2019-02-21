
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

app.updateHour = () => {
    let datePlaceholder = new Date (`February 20, 2019 ${app.sunrise}`)
    app.currentHour = datePlaceholder.getHours();
    app.currentHour = app.currentHour - 5;
    console.log(app.currentHour);
}

app.updateMinute = (time) => {
    let datePlaceholder = new Date(`February 20, 2019 ${time}`)
    app.currentMinute = datePlaceholder.getMinutes();
    console.log(app.currentMinute);
}




app.sunriseMinutes = app.currentTotalMinutes(app.currentHour, app.currentMinute);

app.init = () => {
    app.getUserTime();
    app.getSunTimes();
    app.updateHour();
    app.updateMinute();
    app.currentTotalMinutes(4,7);
}
// doc ready
$(document).ready(function(){
    app.init();
    
}) //ends doc ready


// OTHER STUFF

// getting today time in the day in minutes
    // console.log(newEST * 60 + timeEST[1]);