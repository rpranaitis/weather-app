import Temperature from "./Temperature";
import OtherWeatherParameters from "./OtherWeatherParameters";

window.bootstrap = require('bootstrap');

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);

    return this;
}

const defaultCity = 'Kaunas';

let cityLinks = document.querySelectorAll('.city-links');
let cityInput = document.querySelector('#cityInput');
let searchButton = document.querySelector('#searchButton');

let weatherWrapper = document.querySelector('.weather-wrapper');
let spinnerBlock = document.querySelector('.spinner-block');

let cityElement = document.querySelector('#city span');
let municipalityElement = document.querySelector('#municipality')

let modal = new bootstrap.Modal(document.querySelector('.modal'), {})
let defaultModal = document.querySelector('.modal');
let defaultModalText = document.querySelector('.modal .modal-body .body-text');

let historyWrap = document.querySelector('.history-wrap');
let historyTitle = document.querySelector('.history p');
let historyUl = document.querySelector('.history-wrap ul');

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
        cityInput.focus();
    }
});

(function () {
    updateBlocksByCity(defaultCity, false);
})();

function updateBlocksByCity(city, history = true) {
    if (spinnerBlock.classList.contains('d-none')) {
        toggleSpinnerBlock();
    }

    city = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

    fetchAvailableCities().then(response => {
        for (let availableCity of response) {
            if (city === availableCity.code) {
                return updateBlocks(city, history);
            }
        }

        toggleSpinnerBlock();
        throwError('Tokio miesto duomenų bazėje nėra!');
    });
}

function updateBlocks(city, history) {
    fetchWeatherByCity(city).then(response => {
        cityElement.innerHTML = `<i class="fas fa-location-arrow"></i> ${response.place.name}`
        municipalityElement.textContent = response.place.administrativeDivision;

        let filteredTimestamps = getFilteredTimestamps(response);

        let temperature = new Temperature();
        temperature.updateTemperatureBlock(filteredTimestamps);

        let otherWeatherParameters = new OtherWeatherParameters();
        otherWeatherParameters.updateAllParameters(filteredTimestamps);

        updateHistory(response.place.name, history);
    }).finally(() => {
        toggleWeatherWrapper();
        toggleSpinnerBlock();

        cityInput.value = '';
        cityInput.disabled = false;
    });
}

function updateHistory(city, history) {
    if (!history || isExistCityInHistory(city)) {
        return;
    }

    if (historyWrap.classList.contains('d-none') && historyTitle.classList.contains('d-none')) {
        historyWrap.classList.toggle('d-none');
        historyTitle.classList.toggle('d-none');
    }

    let li = document.createElement('li');
    li.classList.add('city-links', 'text-warning');
    li.textContent = city;
    li.addEventListener('click', () => {
        updateBlocksByCity(city);
    });

    if (historyUl.childElementCount === 3) {
        historyUl.removeChild(historyUl.children[0])
    }

    historyUl.appendChild(li);
}

function isExistCityInHistory(city) {
    let elements = document.querySelectorAll('.history-wrap ul li');

    for (let element of elements) {
        if (element.textContent === city) {
            return true;
        }
    }

    return false;
}

function fetchAvailableCities() {
    return fetch('./weather/places')
        .then(response => response.json());
}

function fetchWeatherByCity(city) {
    return fetch(`./weather/places/${city}`)
        .then(response => response.json());
}

function throwError(text) {
    if (defaultModal.style.display === '' || defaultModal.style.display === 'none') {
        defaultModalText.textContent = text;
        modal.toggle();
        cityInput.value = '';
        cityInput.disabled = false;
    }
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