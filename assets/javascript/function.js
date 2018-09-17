var config = {
    apiKey: "AIzaSyDzhsEFNzXjQ0YhOkdS3YWIdzrxOG4HHX0",
    authDomain: "pistachio-4a3df.firebaseapp.com",
    databaseURL: "https://pistachio-4a3df.firebaseio.com",
    projectId: "pistachio-4a3df",
    storageBucket: "pistachio-4a3df.appspot.com",
    messagingSenderId: "1062361334522"
};
firebase.initializeApp(config);

var database = firebase.database();

$(".submit").on("click", function (event) {
    event.preventDefault();

    var name = $("#name-input").val().trim();
    var location = $("#location-input").val().trim();
    var departing = $("#departing-input").val();
    var returning = $("#returning-input").val();

    var key = {
        name: name,
        location: location,
        departing: departing,
        returning: returning,
    };

    database.ref().push(key);

    location.href = "agenda.html"

});


database.ref().limitToLast(1).on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    var name = childSnapshot.val().name;
    var location = childSnapshot.val().location;
    var departing = childSnapshot.val().departing;
    var returning = childSnapshot.val().returning;

    $("#name-display").append(name + "'s");
    $("#city-display").append(location);
    $("#departing-display").append(departing.toString("MMM DD YYYY"));
    $("#returning-display").append(returning.toString("MMM DD YYYY"));

    var airports = {
        "New York City": "JFK",
        "Chicago": "ORD",
        "Las Vegas": "LAS",
        "Los Angeles": "LAX",
        "Miami": "MIA",
        "San Francisco": "SFO",
        "Seattle": "SEA",
    }
    var x = airports[location]

    airportInfo = new AirportInfo(x);
    setTimeout(function () {
        var resp = airportInfo.respJSON;
        var delay = resp.name + ' ';
        if (resp.delay === true) {
            if (resp.status.avgDelay.length > 0) {
                delay += 'average delay ' + resp.status.avgDelay
                    + ' reason ' + resp.status.reason;
            } else {
                delay += 'min. delay ' + resp.status.minDelay
                    + ' max. delay ' + resp.status.maxDelay
                    + ' reason ' + resp.status.reason;
            }
        } else {
            delay += 'no delays';
        };
        $("#airport").text(delay);
    }, 1500);

    var forecast = new WeatherForecast();
    var resp = forecast1.getForecastByCity(location);
    var tempArr = [];

    setTimeout(function () {
        console.log(resp.responseJSON);
        for(let i=0; i < 5; ++i) {
            var maxTemp = Math.floor(resp.responseJSON.list[i].temp.max) + ' degrees';
            var icon    = 'https://openweathermap.org/img/w/' + 
                            resp.responseJSON.list[i].weather[0].icon +
                            '.png';
            var weather = resp.responseJSON.list[i].weather[0].main;
            var weatherObj = {};
            var weatherid = '#weather' + i;
            $(weatherid).text(maxTemp);
            var photoid = '#weatherPhoto' + i;
            // var imgSrc = '<img src=\"' + icon + '\" />';
            $(photoid).attr('src', icon);
        };


    }, 1500);

});

