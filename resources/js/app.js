import "./events"
import Temperature from "./updates/Temperature";
import OtherWeatherParameters from "./updates/OtherWeatherParameters";
import {
    body, cityElement, cityInput, defaultModal, defaultModalText, historyList, historyTitle,
    historyWrap, modal, municipalityElement, spinnerBlock, temperatures, unitSwitch, weatherWrapper
} from "./selectors";

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);

    return this;
}

// Page start
const defaultCity = 'Kaunas';
updateBlocksByCity(defaultCity, false);
//

function fetchAvailableCities(city) {
    return fetch(`./weather/places/${city}`)
        .then(response => response.json());
}

function fetchWeatherByCity(city) {
    return fetch(`./weather/${city}`)
        .then(response => response.json());
}

export function updateBlocksByCity(city, history = true) {
    if (spinnerBlock.classList.contains('d-none')) {
        body.style.backgroundColor = 'rgba(45, 56, 70, .4)';
        document.documentElement.scrollTop = 0;
        toggleSpinnerBlock();
    }

    if (!city) {
        toggleSpinnerBlock();
        body.style.backgroundColor = 'rgba(45, 56, 70, 1)';
        throwError('Neįvestas miestas!');
    }

    city = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();

    fetchAvailableCities(city).then(response => {
        for (let availableCity of response) {
            if (city === availableCity.code) {
                return updateBlocks(city, history);
            }
        }

        toggleSpinnerBlock();
        body.style.backgroundColor = 'rgba(45, 56, 70, 1)';
        throwError('Tokio miesto duomenų bazėje nėra!');
    });
}

export function convertTemperatureToF() {
    for (let temperature of temperatures) {
        let value = temperature.textContent.replace('°', '');
        let result = value * 1.8 + 32;

        temperature.textContent = result.toFixed() + '°';
    }
}

export function convertTemperatureToC() {
    for (let temperature of temperatures) {
        let value = temperature.textContent.replace('°', '');
        let result = (value - 32) / 1.8;

        temperature.textContent = result.toFixed() + '°';
    }
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
        unitSwitch.checked = false;
        body.style.backgroundColor = 'rgba(45, 56, 70, 1)';
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

    if (historyList.childElementCount === 3) {
        historyList.removeChild(historyList.children[0])
    }

    historyList.appendChild(li);
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