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

let weatherWrapper = document.querySelector('.weather-wrapper');
let spinnerBlock = document.querySelector('.spinner-block');

let cityElement = document.querySelector('#city span');
let municipalityElement = document.querySelector('#municipality')

let modal = new bootstrap.Modal(document.querySelector('.modal'), {})
let defaultModal = document.querySelector('.modal');

for (let cityLink of cityLinks) {
    cityLink.addEventListener('click', () => {
        updateBlocksByCity(cityLink.textContent);
    });
}

searchButton.addEventListener('click', () => {
    updateBlocksByCity(cityInput.value);
});

cityInput.addEventListener('keyup', event => {
   if (event.keyCode === 13) {
       event.preventDefault();
       cityInput.disabled = true;
       searchButton.click();
   }
});

window.addEventListener('keyup', event => {
    if (event.keyCode === 13 && defaultModal.style.display === 'block') {
        event.preventDefault();
        modal.toggle();
    }
});

function fetchAvailableCities() {
    return fetch(`./weather/places`)
        .then(response => response.json());
}

function fetchWeatherByCity(city) {
    return fetch(`./weather/places/${city}`)
        .then(response => response.json());
}

(function () {
    updateBlocksByCity('Vilnius');
})();

function updateBlocksByCity(city) {
    if (spinnerBlock.classList.contains('d-none')) {
        toggleSpinnerBlock();
    }

    city = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

    fetchAvailableCities().then(response => {
        for (let availableCity of response) {
            if (city === availableCity.code) {
                return updateBlocks(city);
            }
        }

        toggleSpinnerBlock();
        modal.toggle();
        cityInput.value = '';
        cityInput.disabled = false;
    });
}

function toggleWeatherWrapper() {
    if (weatherWrapper.classList.contains('d-none')) {
        weatherWrapper.classList.toggle('d-block');
        weatherWrapper.classList.toggle('d-none');
        spinnerBlock.style.backgroundColor = 'rgba(255, 255, 255, .6)';
    }
}

function toggleSpinnerBlock() {
    spinnerBlock.classList.toggle('d-none');
    spinnerBlock.classList.toggle('d-flex');
}

function updateBlocks(city) {
    fetchWeatherByCity(city).then(response => {
        cityElement.innerHTML = `<i class="fas fa-location-arrow"></i> ${response.place.name}`
        municipalityElement.textContent = response.place.administrativeDivision;

        let filteredTimestamps = getFilteredTimestamps(response);

        let temperature = new Temperature();
        temperature.updateTemperatureBlock(filteredTimestamps);

        let otherWeatherParameters = new OtherWeatherParameters();
        otherWeatherParameters.updateAllParameters(filteredTimestamps);
    }).finally(() => {
        toggleWeatherWrapper();
        toggleSpinnerBlock();

        cityInput.value = '';
        cityInput.disabled = false;
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