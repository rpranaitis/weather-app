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
import {fetchAvailableCities, fetchDefaultCity, fetchWeatherByCity} from "./tools/ajax";

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);

    return this;
}

// Page start

navigator.geolocation.getCurrentPosition(function(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    fetchDefaultCity(lat, long).then(response => {
        let locationCity = extractLocationPlace(response);
        fetchAvailableCities(locationCity).then(res => {
            if (response.address.country_code === 'lt' && locationCity && res.length) {
                updateBlocksByCity(locationCity, false, false);
            } else {
                updateBlocksByCity('Vilnius', false, false);
            }
        });
    });
});

function extractLocationPlace(data) {
    if (data.address.village) {
        return data.address.village;
    }

    if (data.address.town) {
        return data.address.town;
    }

    if (data.address.city) {
        return data.address.city;
    }

    return null;
}

//

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