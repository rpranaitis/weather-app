import Temperature from "./Temperature";
import OtherWeatherParameters from "./OtherWeatherParameters";

window.bootstrap = require('bootstrap');

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);

    return this;
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

function fetchAvailableCities() {
    return fetch(`./weather/places`)
        .then(response => response.json());
}

function fetchWeatherByCity(city) {
    return fetch(`./weather/places/${city}`)
        .then(response => response.json());
}

fetchWeatherByCity('Grinkiskis').then(response => {
    let filteredTimestamps = getFilteredTimestamps(response);

    let temperature = new Temperature();
    temperature.updateTemperatureBlock(filteredTimestamps);

    let otherWeatherParameters = new OtherWeatherParameters();
    otherWeatherParameters.updateAllParameters(filteredTimestamps);
});


let cityLinks = document.querySelectorAll('.city-links');
let cityInput = document.querySelector('#cityInput');
let searchButton = document.querySelector('#searchButton');

for (let cityLink of cityLinks) {
    cityLink.addEventListener('click', () => {
       console.log(cityLink.textContent);
    });
}

searchButton.addEventListener('click', () => {
    console.log(cityInput.value);
});