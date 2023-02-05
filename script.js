var search = document.querySelector("#search");
var searchBtn = document.querySelector("#searchBtn");
var main = document.querySelector(".main");

var APIKey = "75057e7bd9899dd0671687e4e687b5b6";
var today = dayjs().format("D/MM/YYYY");

function getLocationAPI(city) {
  var geoQueryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    APIKey;
  fetch(geoQueryURL).then(function (response) {
    // If the input is a valid city
    if (response.ok) {
      response.json().then(function (data) {
        // Save the city name to localStorage
        var cityName = data.name;
        localStorage.setItem(city, cityName);

        var lat = data.lat;
        var lon = data.lon;
        getWeatherAPI(lat, lon, cityName);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

//* Use the Weather API to display the today's date, temp, wind and humidity
function getWeatherAPI(lat, lon, cName) {
  var weatherQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    APIKey;
  fetch(weatherQueryURL).then(function (response) {
    response.json().then(function (data) {
      main.firstChild.textContent = cName + " " + today + data.weather.icon;

      main.lastChild.textContent =
        "Temp: " +
        (data.main.temp - 273.15) +
        "C\n" +
        "Wind: " +
        data.wind.speed.imperial +
        " MPH\n" +
        "Humidity: " +
        data.main.humidity +
        " %";

      // Turn the card on

      getForecastAPI(cName);
    });
  });
}

//* Use forecast API to display the 5-Day Forecast
function getForecastAPI(name) {
  var forecastQueryURL =
    "api.openweathermap.org/data/2.5/forecast?q=" + name + "&appid=" + APIKey;
  fetch(forecastQueryURL).then(function (response) {});
}

searchBtn.addEventListener("click", function () {
  var inputCity = search.value();

  if (inputCity) {
    getLocationAPI(inputCity);
  }
});

//get the city name

// create an event listener for the search button
// when the button is clicked, check that they entered a real city
// then:
// use the city name to change the main-fc to have
// city name and date
// temp, wind, humidity
// use the city to change the 5-Day Forecast
// loop through the children, change each top text to date
// and apply the information
