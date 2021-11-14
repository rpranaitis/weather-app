import Temperature from "./Temperature";
import OtherWeatherParameters from "./OtherWeatherParameters";

window.bootstrap = require('bootstrap');

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);

    return this;
}

let cityLinks = document.querySelectorAll('.city-links');
let cityInput = document.querySelector('#cityInput');
let searchButton = document.querySelector('#searchButton');

for (let cityLink of cityLinks) {
    cityLink.addEventListener('click', () => {
        updateBlocksByCity(cityLink.textContent);
    });
}

searchButton.addEventListener('click', () => {
    updateBlocksByCity(cityInput.value);
});

function fetchAvailableCities() {
    return fetch(`./weather/places`)
        .then(response => response.json());
}

function fetchWeatherByCity(city) {
    return fetch(`./weather/places/${city}`)
        .then(response => response.json());
}

function updateBlocksByCity(city) {
    city = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

    fetchAvailableCities().then(response => {
        for (let availableCity of response) {
            if (city === availableCity.code) {
                return updateBlocks(city);
            }
        }
    });
}

function updateBlocks(city) {
    fetchWeatherByCity(city).then(response => {
        let filteredTimestamps = getFilteredTimestamps(response);

        let cityElement = document.querySelector('#city span');
        cityElement.innerHTML = `<i class="fas fa-location-arrow"></i> ${response.place.name}`

        let municipalityElement = document.querySelector('#municipality')
        municipalityElement.textContent = response.place.administrativeDivision;

        let temperature = new Temperature();
        temperature.updateTemperatureBlock(filteredTimestamps);

        let otherWeatherParameters = new OtherWeatherParameters();
        otherWeatherParameters.updateAllParameters(filteredTimestamps);
    });
}

function getFilteredTimestamps(data) {
    let futureDateTimes = getFutureDateTimes();

    return data.forecastTimestamps.filter(x => futureDateTimes.includes(x.forecastTimeUtc));
}

function getFutureDateTimes() {
    let dateTimes = [];

    for (let i = 0; i < 12; i++) {
        let addedHours = new Date().addHours(i);
        let futureDate = addedHours.toLocaleDateString('en-CA');
        let futureTime = addedHours.toLocaleTimeString().slice(0, 2) + ':00:00';

        dateTimes.push(`${futureDate} ${futureTime}`)
    }

    return dateTimes;
}