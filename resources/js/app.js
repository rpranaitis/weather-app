import Temperature from "./Temperature";
import Weather from "./Weather";

window.bootstrap = require('bootstrap');

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);

    return this;
}

let weather = new Weather();
console.log(weather.getFutureDateTimes());

function fetchAvailableCities() {
    return fetch(`./weather/places`)
        .then(response => response.json());
}

function fetchWeatherByCity(city) {
    return fetch(`./weather/places/${city}`)
        .then(response => response.json());
}

fetchWeatherByCity('Grinkiskis').then(response => {
    let temperature = new Temperature();
    temperature.updateTemperatureBlock(response);
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