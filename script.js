var searchBtn = $("#searchBtn");
var mainContainer = $("#main");
var forecastContainer = $("#forecast");

var APIKey = "75057e7bd9899dd0671687e4e687b5b6";

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

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
    APIKey +
    "&units=imperial";
  fetch(weatherQueryURL).then(function (response) {
    response.json().then(function (data) {
      // Clear children from main
      removeAllChildNodes(mainContainer);

      // Create a card with the weather today
      var mainCard = document.createElement("div");

      var mainTitle = document.createElement("h2");
      mainTitle.textContent = cName + " " + dayjs(data.dt) + data.weather.icon;

      var mainWeather = document.createElement("p");
      mainWeather.textContent =
        "Temp: " +
        data.main.temp +
        "F\n" +
        "Wind: " +
        data.wind.speed +
        " MPH\n" +
        "Humidity: " +
        data.main.humidity +
        " %";

      mainCard.append(mainTitle, mainWeather);
      mainContainer.appendChild(mainCard);
      //mainCard.addClass("card");

      getForecastAPI(cName);
    });
  });
}

//* Use forecast API to display the 5-Day Forecast
function getForecastAPI(name) {
  var forecastQueryURL =
    "api.openweathermap.org/data/2.5/forecast?q=" +
    name +
    "&appid=" +
    APIKey +
    "&units=imperial";
  fetch(forecastQueryURL).then(function (response) {
    response.json().then(function (data) {
      // Remove existing children
      removeAllChildNodes(forecastContainer);

      // Create cards for the 5 day forecast
      for (var i = 0; i < 5; i++) {
        var card = document.createElement("div");
        //card.addClass("card");
        //card.addClass("text-bg-dark");

        var cardTitle = document.createElement("h2");
        cardTitle.textContent =
          dayjs(data.list[i].dt).format("D/MM/YYYY") +
          data.list[i].weather.icon;

        var cardWeather = document.createElement("p");
        cardWeather.textContent =
          "Temp: " +
          (data.list[i].main.temp - 273.15) +
          "F\n" +
          "Wind: " +
          data.list[i].wind.speed +
          " MPH\n" +
          "Humidity: " +
          data.list[i].main.humidity +
          " %";

        card.append(cardTitle, cardWeather);
        forecastContainer.appendChild(card);
      }
    });
  });
}

searchBtn.on("click", function (event) {
  event.preventDefault();

  var inputCity = $("#search").val();

  if (inputCity) {
    getLocationAPI(inputCity);
  }
  // Set recent searches
});
