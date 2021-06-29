var searchTextEl = document.getElementById("searchText");
var searchBtnEl = document.getElementById("searchBtn");
var cityListEl = document.getElementById("cityList");
var cityNameEl = document.getElementById("cityName");
var currentTempEl = document.getElementById("currentTemp");
var currentSymbolEl = document.getElementById("currentSymbol");
var currentWindEl = document.getElementById("currentWind");
var currentHumidityEl = document.getElementById("currentHumidity");
var currentUVEl = document.getElementById("currentUV");
var showDataEl = document.querySelector(".showData");
var apiKey = "46861786b19faeb5c53a77361744c4d6";
var weatherBase = "https://api.openweathermap.org";
var savedInfo = [];
var day;
var nextDays = [];
var city;

//Get the date from moment.js
function getDays() {
    for (i=0; i < 6; i++) {
        nextDays[i] = moment().add(i, 'days').format("M/DD/YYYY");
    }
}

//Get content from local storage for use
function init() {

    if (localStorage.getItem("savedInfo") === null) {
        return;
    } else {
        savedInfo = JSON.parse(localStorage.getItem("savedInfo"));
        return savedInfo;
    }
}

//Turn saved info into city buttons
function makeButtonsFromSaved() {
    for (var i = 0; i < savedInfo.length; i++) {
        var btnx = document.createElement("button");
        btnx.textContent = savedInfo[i].city;
        btnx.classList.add("saveBtn", "city", "col-12");
        cityListEl.appendChild(btnx);
    }
}

//Capture the city name from search button
function getCity(event) {
    event.preventDefault();
    city = searchText.value.toUpperCase();
    getGeo();
}

//Use the city name from previously generated buttons
function previousSearch(event) {
    event.preventDefault();
    city = event.target.textContent;
    getGeo();
}

//Get the lat/lon from the entered city.  Ensure cities can't be added twice.  Save city/lat/lon to local storage.  Display on page.  Delete search text.
function getGeo() {
    var geoSpec = weatherBase + "/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;
 
    fetch(geoSpec)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            
            var newCityInfo = {
                city,
                lat,
                lon
            };

            var found = savedInfo.findIndex(x => x.city === newCityInfo.city);
            if (found === -1) {
                savedInfo.push(newCityInfo);
                localStorage.setItem("savedInfo", JSON.stringify(savedInfo));
                var btn = document.createElement("button");
                btn.textContent = city;
                btn.classList.add("saveBtn", "city", "col-12");
                cityListEl.appendChild(btn);
            }

            searchText.value = "";
            getCurrentWeather(newCityInfo);
        });
}

//Use lat and lon to get the current weather and forecast using the onecall api.  Display content once created.
function getCurrentWeather(cityInfo) {
    var currentSpec = weatherBase + "/data/2.5/onecall?lat=" + cityInfo.lat + "&lon=" + cityInfo.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    fetch(currentSpec)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var hum = data.current.humidity;
            var uvi = data.current.uvi;
            var wind = data.current.wind_speed;
            var temp = data.current.temp;
            var daysIcon = data.current.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/wn/"+daysIcon+".png";

            //Add current weather to page
                cityNameEl.textContent = cityInfo.city + " (" + nextDays[0] + ") ";
                currentSymbolEl.src = iconURL;
                currentTempEl.textContent = temp;
                currentWindEl.textContent = wind;
                currentHumidityEl.textContent = hum;
                currentUVEl.textContent = uvi;
                
                if (uvi < 3) {
                    currentUVEl.classList.add("low");
                } else if (uvi >= 3 && uvi < 6) {
                    currentUVEl.classList.add("low-medium");
                } else if (uvi >= 6 && uvi < 8) {
                    currentUVEl.classList.add("medium");
                } else if (uvi >= 8 && uvi < 11) {
                    currentUVEl.classList.add("medium-high");
                } else {
                    currentUVEl.classList.add("high");
                }

            for (var i=1; i < 6; i++) {
                var dateiEl = document.getElementById("0"+i+"date");
                var symboliEl = document.getElementById("0"+i+"symbol");
                var tempiEl = document.getElementById("0"+i+"temp");
                var windiEl = document.getElementById("0"+i+"wind");
                var humidityiEl = document.getElementById("0"+i+"humidity");

                dateiEl.textContent = nextDays[i];

                daysIcon = data.daily[i].weather[0].icon;
                iconURL = "http://openweathermap.org/img/wn/"+daysIcon+"@2x.png";
                symboliEl.src = iconURL;

                tempiEl.textContent = data.daily[i].temp.day;

                windiEl.textContent = data.daily[i].wind_speed;

                humidityiEl.textContent = data.daily[i].humidity;

            }

            
        })
    displayContent();
}

function displayContent() {
    showDataEl.setAttribute("style", "display: block");

}


getDays();
init();
makeButtonsFromSaved();
searchBtnEl.addEventListener("click", getCity);
cityListEl.addEventListener("click", previousSearch);
