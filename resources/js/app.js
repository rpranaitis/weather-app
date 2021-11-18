import "./events"
import Temperature from "./updates/Temperature";
import OtherWeatherParameters from "./updates/OtherWeatherParameters";

import {
    body, cityElement, cityInput, defaultModal, defaultModalText, modal, municipalityElement, suggestions, spinnerBlock,
    temperatures, unitSwitch, weatherWrapper, inputGroupText, historySuggestions
} from "./selectors";

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);

    return this;
}

// Page start
const defaultCity = 'Kaunas';
updateBlocksByCity(defaultCity, false);

//

function fetchWeatherByCity(city) {
    return fetch(`./weather/${city}`)
        .then(response => response.json());
}

function fetchAvailableCities(city) {
    return fetch(`./weather/places/${city}`)
        .then(response => response.json());
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

export function showCitySuggestions(city) {
    fetchAvailableCities(city).then(response => {
        if (response.length) {
            suggestions.innerHTML = '';
            createCitySuggestions(response);
            hideHistory();
            showSuggestions();
        } else {
            hideSuggestions();
            hideHistory();
        }
    });
}

export function createCitySuggestions(cities) {
    for (let city of cities) {
        let suggestionBox = document.createElement('div');
        suggestionBox.classList.add('suggestion-box', 'd-flex');
        suggestions.appendChild(suggestionBox);

        let body = document.createElement('div');
        body.classList.add('body')
        suggestionBox.appendChild(body);

        let cityParagraph = document.createElement('p');
        cityParagraph.classList.add('city');
        cityParagraph.textContent = city.name;
        body.appendChild(cityParagraph);

        let municipalityParagraph = document.createElement('p');
        municipalityParagraph.classList.add('municipality');
        municipalityParagraph.textContent = city.administrativeDivision;
        body.appendChild(municipalityParagraph);

        suggestionBox.addEventListener('click', () => {
            hideSuggestions();
            hideHistory();
            updateBlocksByCity(city.code);
        });
    }
}

function updateHistory(city, municipality, code, history) {
    if (!history) {
        return;
    }

    if (historySuggestions.childElementCount === 10) {
        historySuggestions.removeChild(historySuggestions.children[9])
    }

    let suggestionBox = document.createElement('div');
    suggestionBox.classList.add('suggestion-box', 'd-flex');
    historySuggestions.prepend(suggestionBox);

    let icon = document.createElement('div');
    icon.classList.add('icon', 'd-flex', 'align-items-center')
    icon.innerHTML = '<i class="fas fa-history"></i>';
    suggestionBox.appendChild(icon);

    let body = document.createElement('div');
    body.classList.add('body')
    suggestionBox.appendChild(body);

    let cityParagraph = document.createElement('p');
    cityParagraph.classList.add('city');
    cityParagraph.textContent = city;
    body.appendChild(cityParagraph);

    let municipalityParagraph = document.createElement('p');
    municipalityParagraph.classList.add('municipality');
    municipalityParagraph.textContent = municipality;
    body.appendChild(municipalityParagraph);

    suggestionBox.addEventListener('click', () => {
        hideSuggestions();
        hideHistory();
        updateBlocksByCity(code);
    });
}

export function showSuggestions() {
    inputGroupText.style.borderBottomLeftRadius = 0;
    suggestions.classList.remove('d-none');
}

export function hideSuggestions() {
    inputGroupText.style.borderBottomLeftRadius = '24px';
    suggestions.classList.add('d-none');
}

export function showHistory() {
    inputGroupText.style.borderBottomLeftRadius = 0;
    historySuggestions.classList.remove('d-none');
}

export function hideHistory() {
    inputGroupText.style.borderBottomLeftRadius = '24px';
    historySuggestions.classList.add('d-none');
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

    fetchWeatherByCity(city).then(response => {
        updateBlocks(response);
        updateHistory(response.place.name, response.place.administrativeDivision, response.place.code, history);
    }).catch(() => {
        throwError('Tokio miesto duomenų bazėje nėra!');
    }).finally(() => {
        toggleWeatherWrapper();
        toggleSpinnerBlock();

        cityInput.disabled = false;
        unitSwitch.checked = false;
        body.style.backgroundColor = 'rgba(45, 56, 70, 1)';
    });
}

function updateBlocks(data) {
    cityElement.innerHTML = `<i class="fas fa-location-arrow"></i> ${data.place.name}`
    municipalityElement.textContent = data.place.administrativeDivision;

    let filteredTimestamps = getFilteredTimestamps(data);

    let temperature = new Temperature();
    temperature.updateTemperatureBlock(filteredTimestamps);

    let otherWeatherParameters = new OtherWeatherParameters();
    otherWeatherParameters.updateAllParameters(filteredTimestamps);
}

function throwError(text) {
    if (defaultModal.style.display === '' || defaultModal.style.display === 'none') {
        defaultModalText.textContent = text;
        modal.toggle();
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