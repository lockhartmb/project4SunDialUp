
const app = {};

app.getUserTime = () => {
    app.hours = getHours();
    app.minutes = getMinutes();
    app.seconds = getSeconds();
    return `{}`
}

// doc ready
$(document).ready(function(){

}) //ends doc ready