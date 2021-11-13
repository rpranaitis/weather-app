import Temperature from "./Temperature";

window.bootstrap = require('bootstrap');

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