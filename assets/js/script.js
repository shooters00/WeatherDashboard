var searchTextEl = document.getElementById("searchText");
var searchBtnEl = document.getElementById("searchBtn");
var cityListEl = document.getElementById("cityList");
var apiKey = "46861786b19faeb5c53a77361744c4d6";
var weatherBase = "https://api.openweathermap.org";
var savedInfo = [];
var day;
var nextDays = [];

//var weatherCurrent = weatherBase + "/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
//var weatherForecast = weatherBase + "/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

//Get the date from moment.js
function getDays() {
    for (i=0; i < 6; i++) {
        nextDays[i] = moment().add(i, 'days').format("M/DD/YYYY");
    }
}

//Get content from local storage and display on screen
function init() {
    if (localStorage.getItem("savedInfo") === null) {
        return;
    } else {
        savedInfo = JSON.parse(localStorage.getItem("savedInfo"));
        //for (var i=0; i < savedInfo.length; i++) {
         //   var returnTask = savedInfo[i].task;
         //   var returnTime = "#"+savedInfo[i].hour;
         //   $(returnTime).children(".description").val(returnTask);
        //}
        return savedInfo;
    }
}

//Turn saved info into city buttons
function makeButtonsFromSaved() {
    for (var i = 0; i < savedInfo.length; i++) {
        var btnx = document.createElement("button");
        btnx.textContent = savedInfo[i].city;
        btnx.classList.add("saveBtn", "col-12");
        cityListEl.appendChild(btnx);
    }
}

//Take in a city name and get the lat/lon

function getGeo(event) {
    event.preventDefault();
    var city = searchText.value.toUpperCase();

    var geoSpec = weatherBase + "/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
 
    fetch(geoSpec)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var lat = data[0].lat;
            var lon = data[0].lon;
            
            var newCityInfo = {
                city,
                lat,
                lon
            };
            console.log(newCityInfo)
            savedInfo.push(newCityInfo);
            localStorage.setItem("savedInfo", JSON.stringify(savedInfo));
            var btn = document.createElement("button");
            btn.textContent = city;
            btn.classList.add("saveBtn", "col-12");
            cityListEl.appendChild(btn);
            searchText.value = "";
            getCurrentWeather(newCityInfo);
        });
}

function getCurrentWeather(cityInfo) {
    var currentSpec = weatherBase + "/data/2.5/onecall?lat=" + cityInfo.lat + "&lon=" + cityInfo.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    fetch(currentSpec)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            cityInfo.city;
            var hum = data.current.humidity;
            var uvi = data.current.uvi;
            var wind = data.current.wind_speed;
            var tmp = data.current.temp;
            var daysIcon = data.current.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/"+daysIcon+"@2x.png";
            console.log (cityInfo.city + " " + day + " " + hum + " " + uvi + " " + wind + " " + tmp + " " + iconURL);

        })
}


//Save city on the page and put in local storage once Searched
function saveCity() {

    //Code from last HW to check for duplicate
    //var found = savedInfo.findIndex(x => x.hour === timeLine);
    //if (found !== -1) {
    //    savedInfo.splice(found, 1);
    //}


    var mySavedInfo = {

    }
 
    savedInfo.push(mySavedInfo);

    localStorage.setItem("savedInfo", JSON.stringify(savedInfo));
}

//Not sure this is needed.  Get position of user.
//function getPosition () {

//}

/*
//Take in city and get weather
function getCurrentWeather() {
    fetch(weatherCurrent, {
        //units="imperial"
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
      });
}
*/

/*
//Take in city and get forecast
function getForecastWeather() {
    fetch(weatherForecast, {
        //units = "imperial"
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
      });
}
*/

//Present weather on page
function postWeather() {

}

init();
makeButtonsFromSaved();
searchBtnEl.addEventListener("click", getGeo);

//Wait for the save button to be clicked
//$(".saveBtn").on("click", saveMyStuff);
