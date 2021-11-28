import "./events"
import Temperature from "./updates/Temperature";
import OtherWeatherParameters from "./updates/OtherWeatherParameters";

import {
    body,
    cityElement,
    cityInput,
    defaultModal,
    defaultModalText,
    modal,
    municipalityElement,
    spinnerBlock,
    unitSwitch,
} from "./selectors";

import {
    toggleSpinnerBlock,
    toggleWeatherWrapper
} from "./tools/show-hide";

import {scrollToCity} from "./tools/scroll";
import {updateHistory} from "./tools/history";
import {fetchWeatherByCity} from "./tools/ajax";

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);

    return this;
}

// Page start

updateBlocksByCity('Vilnius', false, false);

export function updateBlocksByCity(city, history = true, scroll = true) {
    if (spinnerBlock.classList.contains('d-none')) {
        body.style.backgroundColor = 'rgba(45, 56, 70, .4)';
        toggleSpinnerBlock();
    }

    if (!city) {
        toggleSpinnerBlock();
        body.style.backgroundColor = 'rgba(45, 56, 70, 1)';

        return throwError('Neįvestas miestas!');
    }

    fetchWeatherByCity(city).then(response => {
        updateBlocks(response);
        updateHistory(response.place.name, response.place.administrativeDivision, response.place.code, history);
    }).catch(() => {
        scroll = false;
        throwError('Tokio miesto duomenų bazėje nėra!');
    }).finally(() => {
        toggleWeatherWrapper();
        toggleSpinnerBlock();

        if (scroll) {
            scrollToCity();
        }

        cityInput.disabled = false;
        unitSwitch.checked = false;
        body.style.backgroundColor = 'rgba(45, 56, 70, 1)';
    });
}

function updateBlocks(data) {
    cityElement.innerHTML = `<i class="fab fa-periscope"></i> ${data.place.name}`
    municipalityElement.textContent = data.place.administrativeDivision;

    let filteredTimestamps = getFilteredTimestamps(data);

    let temperature = new Temperature();
    temperature.updateTemperatureBlock(filteredTimestamps);

    let otherWeatherParameters = new OtherWeatherParameters();
    otherWeatherParameters.updateAllParameters(filteredTimestamps);
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

function throwError(text) {
    if (defaultModal.style.display === '' || defaultModal.style.display === 'none') {
        defaultModalText.textContent = text;
        modal.toggle();
        cityInput.disabled = false;
    }
}