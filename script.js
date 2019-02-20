
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
        console.log(app.sunrise);
        app.toEST();
    });
}

app.toEST = () => {
    const timeEST = app.sunrise.split(':');
    console.log(timeEST);
    const newEST = Number(timeEST[0]) - 5;
    console.log(newEST * 60 + timeEST[1]);
}


// doc ready
$(document).ready(function(){
    app.getSunTimes();
    // app.toEST();
}) //ends doc ready