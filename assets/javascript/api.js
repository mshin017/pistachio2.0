function WeatherForecast() {
    this.OWAPIKEY = 'e04dc2a2ae502b3bb7f9ee699ba2a841';
    this.OWURL = 'https://api.openweathermap.org/data/2.5/forecast/daily?';

    this.OWFORECASTPARMS = {
        appid: this.OWAPIKEY,
        cnt: 5,
        units: 'imperial'
    };

    this.makeQueryString = function (params) {
        return this.OWURL + $.param(params);
    };

    this.getForecastByLatLon = function (lat, lon) {
        var qparams = this.OWFORECASTPARMS;
        qparams.lat = lat;
        qparams.lon = lon;
        var qstring = this.makeQueryString(qparams);

        return $.get(qstring);
    };

    this.getForecastByCity = function (city) {
        var qparams = this.OWFORECASTPARMS;
        qparams.q = city;
        var qstring = this.makeQueryString(qparams);

        return $.get(qstring);
    }
}


function CityLocation(city, st) {
    var GOOGLEAPIKEY = 'AIzaSyA7fYWzc8eCBfNRbGVQ5V__CadS5B939_s';
    var GOOGLEURL = 'https://maps.googleapis.com/maps/api/geocode/json?';

    var GOOGLEAPIPARAMS = {
        key: GOOGLEAPIKEY,
        address: ''
    }

    this.qstring = GOOGLEAPIPARAMS;
    this.responseJSON = {};

    this.makeQueryString = function (url, params) {
        return url + $.param(params);
    };

    this.getCityLocation = function (url, params, citylocation) {
        var qstring = this.makeQueryString(url, params);

        return $.get(qstring)
            .done(function (resp) {
                var components = resp.results[0].address_components[0];
                var location = resp.results[0].geometry.location;
                citylocation.city = components.short_name;
                citylocation.address = resp.results[0].formatted_address;
                citylocation.lat = location.lat;
                citylocation.lon = location.lng;
            }).fail(function (resp) {
                console.log('CityLocation lookup failed');
            });
    };

    if (arguments.length === 2) {
        this.qstring.address = city + '+' + st;
    } else if (arguments.length === 1) {
        this.qstring.address = city;
    } else {
        throw 'Invalid number of arguments';
    }

    this.getCityLocation(GOOGLEURL, this.qstring, this.responseJSON);
}



function GetNearestAirport(lat, lon) {
    this.AEROAPIKEY = 'be776e50de631b22ee12cb993e1f06bf';
    this.AEROURL = 'https://airport.api.aero/airport/nearest/';
    this.responseJSON = {};

    this.getNearestAirport = function (lat, lon, nearestairport) {
        var qstring = this.AEROURL + lat + '/' + lon + '?user_key=' + this.AEROAPIKEY;
        return $.get(qstring)
            .done(function (resp) {
                var respString = JSON.parse(JSON.stringify(resp.trim()));
                respString = respString.substr(9);
                respString = respString.substr(0, respString.length - 1);
                var parsedJSON = JSON.parse(respString);

                var airport = parsedJSON.airports[0];
                nearestairport.city     = airport.city;
                nearestairport.code     = airport.code;
                nearestairport.country  = airport.country;
                nearestairport.lat      = airport.lat;
                nearestairport.lng      = airport.lng;
                nearestairport.name     = airport.name;
                nearestairport.timezone = airport.timezone
            })
            .fail(function (resp) {
                console.log('Nearest Airport lookup failed');
            });
    };

    if (arguments.length != 2) {
        throw 'Invalid number of arguments';
    }
    this.getNearestAirport(lat, lon, this.responseJSON);
}


function AirportInfo(code) {
    this.FAAURL = 'https://services.faa.gov/airport/status/';
    this.FAAFORMAT = '?format=application/json';
    this.respJSON = {};

    this.getAirportInfo = function(code, jsonBack) {
        var qstring = this.FAAURL + code + this.FAAFORMAT;
        return $.get(qstring)
            .done(function(resp) {
                jsonBack.IATA   = resp.IATA;
                jsonBack.IACO   = resp.IACO;
                jsonBack.city   = resp.city;
                jsonBack.delay  = resp.delay;
                jsonBack.state  = resp.state;
                jsonBack.name   = resp.name;
                jsonBack.status = resp.status;
                jsonBack.weather = resp.weather;
            })
            .fail(function (resp) {
                console.log("GetAirportInfo failed.")
            });
    };

    this.getAirportInfo(code, this.respJSON);
}

var forecast1 = new WeatherForecast(); 
var resp1 = forecast1.getForecastByCity('New York'); 

 
setTimeout(function() { 
    console.log(resp1.responseJSON); 
},1500 ); 


function adjust_textarea(h) {
    h.style.height = "20px";
    h.style.height = (h.scrollHeight) + "px";
}

