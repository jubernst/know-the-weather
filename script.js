var searchBtn = $("#searchBtn");
var mainContainer = $("#main");
var forecastContainer = $("#forecast");

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function getLocationAPI(city) {
  var geoQueryURL =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    "92878b970452543a25169bae181e9b03";
  // Attempted to fix CORS error with no luck
  fetch(geoQueryURL, {
    method: "GET",
    body: JSON.stringify(data),
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (response) {
    console.log(response);
    // If the input is a valid city
    if (response.ok) {
      response.json().then(function (data) {
        // Save the city name to localStorage
        var cityName = data.name;
        localStorage.setItem(cityName, cityName);

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
    "92878b970452543a25169bae181e9b03" +
    "&units=imperial";
  fetch(weatherQueryURL).then(function (response) {
    // Catch errors
    if (response.ok) {
      response.json().then(function (data) {
        // Clear children from main
        removeAllChildNodes(mainContainer);

        // Create a card with the weather today
        var mainCard = document.createElement("div");

        var mainTitle = document.createElement("h2");
        mainTitle.textContent =
          cName + " " + dayjs(data.dt).format("D/MM/YYYY") + data.weather.icon;

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

        getForecastAPI(cName);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

//* Use forecast API to display the 5-Day Forecast
function getForecastAPI(name) {
  var forecastQueryURL =
    "api.openweathermap.org/data/2.5/forecast?q=" +
    name +
    "&appid=" +
    "92878b970452543a25169bae181e9b03" +
    "&units=imperial";
  fetch(forecastQueryURL).then(function (response) {
    response.json().then(function (data) {
      // Remove existing children
      removeAllChildNodes(forecastContainer);

      // Create cards for the 5 day forecast
      for (var i = 0; i < 5; i++) {
        var card = document.createElement("div");

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

// Show the recent searches using localStorage
function setRecentSearches() {
  var cityList = $(".city-list");
  removeAllChildNodes(cityList);

  for (var i = 0; i < localStorage.length; i++) {
    var recentSearch = document.createElement("li");
    recentSearch.textContent = localStorage.key(i);
    cityList.append(recentSearch);
  }
}

searchBtn.on("click", function (event) {
  event.preventDefault();

  var inputCity = $("#search").val();

  if (inputCity) {
    getLocationAPI(inputCity);

    setRecentSearches;
  }
});
