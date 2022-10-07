const ELEMENTS = {
    searchCityForm: document.querySelector('.forecast__form'),
    inputCity: document.querySelector('.city-input'),
    forecastCity: document.querySelector('.city-name'),
    forecastDegrees: document.querySelector('.degrees'),
    forecastIcon: document.querySelector('.cloud'),
    iconFavorite: document.querySelector('.like'),

    detailsTemperature: document.querySelector(
        ".details-items li:nth-child(1) span"
    ),
    detailsFeelsLike: document.querySelector(
        ".details-items li:nth-child(2) span"
    ),
    detailsWeather: document.querySelector(".details-items li:nth-child(3) span"),
    detailsSunrise: document.querySelector(".details-items li:nth-child(4) span"),
    detailsSunset: document.querySelector(".details-items li:nth-child(5) span"),
    detailsCity: document.querySelector(".forecast-details p"),

    tabs: document.querySelectorAll(".tabs-items"),
    forecastScreen: document.querySelectorAll(".forecast"),
}

import * as storage from './storage.js';

console.log(ELEMENTS.iconFavorite);

ELEMENTS.searchCityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    citySearch();
})

function citySearch(cityName) {
    if (!cityName) { cityName = ELEMENTS.inputCity.value; }
    if (cityList.includes(cityName)) {
        document.querySelector('.like svg').classList.add('heart');
        console.log(ELEMENTS.iconFavorite);
    }
    else {
        document.querySelector('.like svg').classList.remove('heart');
    }

    storage.saveCurrentCity(cityName);

    const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const apiKey = '76e9b73341b39cfb3057b2e545328bd4';
    const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else { alert("Ошибка HTTP: " + response.status); }

            response.json();
        })
        .then(forecast => {
            const FORECAST = {
                degrees: Math.round(forecast.main.temp),
                degreesFeelsLike: Math.round(forecast.main.feels_like),
                icon: forecast.weather[0].icon,
                forecastCity: forecast.name,

                currentTimeZone: forecast.timezone,
                sunrise: forecast.sys.sunrise,
                sunset: forecast.sys.sunset,

                detailsWeather: forecast.weather[0].main,
            };

            const sunriseTime = cityTime(FORECAST.sunrise, FORECAST.currentTimeZone);
            const sunsetTime = cityTime(FORECAST.sunset, FORECAST.currentTimeZone);

            setNowHTML(FORECAST.degrees, FORECAST.icon, FORECAST.forecastCity);
            setDetailHTML(
                sunriseTime,
                sunsetTime,
                FORECAST.degrees,
                FORECAST.degreesFeelsLike,
                FORECAST.detailsWeather,
                FORECAST.forecastCity
            );
        })
        .catch(err => alert(err));

    ELEMENTS.inputCity.value = "";
}

let cityList = [];
cityList = storage.getFavouriteCities();

function deleteFavoriteCity(cityName) {
    if (cityList.includes(cityName)) {
        let newList = cityList.filter((city) => city !== cityName);
        cityList = newList;
        storage.deleteCity(cityName);
    }
    storage.saveFavouriteCities(cityList);
    render();
}

function addFavoriteCity() {
    if (cityList.includes(ELEMENTS.forecastCity.textContent)) {
        document.querySelector('.like svg').classList.add('heart');
        console.log(ELEMENTS.iconFavorite);
        let newList = cityList.filter(city => city !== ELEMENTS.forecastCity.textContent);
        newList.push(ELEMENTS.forecastCity.textContent);
        cityList = newList;
        storage.saveFavouriteCities(cityList);
    } else {
        cityList.push(ELEMENTS.forecastCity.textContent);
        document.querySelector('.like svg').classList.add('heart');
        console.log(ELEMENTS.iconFavorite);
        storage.saveFavouriteCities(cityList);
    }
    storage.saveCurrentCity(cityName);
    render();
}

function render() {
    let delCity = document.querySelectorAll('.locations-items li');
    delCity.forEach((item) => item.remove());
    citySearch(storage.getCurrentCity());
    for (let item of cityList) {
        addFavoriteHTML(item);
    }
}

render();

function addFavoriteHTML(cityName) {
    const ul = document.querySelector('.locations-items');
    let li = document.createElement('li');
    ul.prepend(li);
    li.addEventListener('click', (event) => {
        event.preventDefault();
        citySearch(cityName);
    })

    let p = document.createElement('p');
    li.prepend(p);
    p.textContent = cityName;

    let button = document.createElement('button');
    button.classList.add('button-exit');
    li.append(button);
    button.addEventListener('click', () => { deleteFavoriteCity(cityName) });
}

ELEMENTS.iconFavorite.addEventListener('click', addFavoriteCity);

//sunset & sunrise time
function cityTime(dayTime, currentTimeZone) {
    let localDate = dayTime * 1000 + new Date(dayTime * 1000).getTimezoneOffset() * 60000 + currentTimeZone * 1000;
    const date = new Date(localDate).toLocaleTimeString();
    let localTime = date.replace(/:\d\d$/, "");
    return localTime;
}

//add forecast in Now
function setNowHTML(degrees, icon, forecastCity) {
    ELEMENTS.forecastDegrees.textContent = degrees;
    ELEMENTS.forecastCity.textContent = forecastCity;
    /* ELEMENTS.inputCity.removeAttribute('placeholder');
    ELEMENTS.inputCity.setAttribute('placeholder', `${forecast.name}`)
    ELEMENTS.inputCity.value = ''; */
    ELEMENTS.forecastIcon.removeAttribute('src');
    ELEMENTS.forecastIcon.removeAttribute('width');
    ELEMENTS.forecastIcon.removeAttribute('height');
    ELEMENTS.forecastIcon.setAttribute('src', `http://openweathermap.org/img/wn/${icon}@2x.png`);
}

function setDetailHTML(sunriseTime, sunsetTime, degrees, degreesFeelsLike, detailsWeather, forecastCity) {
    ELEMENTS.detailsSunrise.textContent = sunriseTime;
    ELEMENTS.detailsSunset.textContent = sunsetTime;
    ELEMENTS.detailsTemperature.textContent = degrees;
    ELEMENTS.detailsFeelsLike.textContent = degreesFeelsLike;
    ELEMENTS.detailsWeather.textContent = detailsWeather;
    ELEMENTS.detailsCity.textContent = forecastCity;
}

//switch tabs
ELEMENTS.tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        ELEMENTS.tabs.forEach((item) => item.classList.remove("active"));
        ELEMENTS.forecastScreen.forEach((item) => item.classList.remove("forecast-start"));
        tab.classList.add("active");
        ELEMENTS.forecastScreen[index].classList.add("forecast-start");
    });
});