import {
    defaultModal,
    modal,
    cityInput,
    cityLinks,
    searchButton,
    unitSwitch,
    suggestions
} from './selectors';

import {
    updateBlocksByCity,
    convertTemperatureToF,
    convertTemperatureToC,
    fetchAvailableCities,
    createCitySuggestions, showSuggestions, hideSuggestions
} from './app';

import debounce from 'lodash.debounce';

window.addEventListener('keyup', event => {
    if (event.keyCode === 13 && defaultModal.style.display === 'block') {
        event.preventDefault();
        modal.toggle();
        cityInput.focus();
    }
});

defaultModal.addEventListener('hidden.bs.modal', () => {
    cityInput.focus();
});

for (let cityLink of cityLinks) {
    cityLink.addEventListener('click', () => {
        updateBlocksByCity(cityLink.textContent);
    });
}

searchButton.addEventListener('click', () => {
    hideSuggestions();
    updateBlocksByCity(cityInput.value);
});

cityInput.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
        event.preventDefault();
        cityInput.disabled = true;
        searchButton.click();
    }
});

unitSwitch.addEventListener('click', () => {
    if (unitSwitch.checked) {
        convertTemperatureToF();
    } else {
        convertTemperatureToC();
    }
});

cityInput.addEventListener('input', debounce(function() {
    if (cityInput.value) {
        fetchAvailableCities(cityInput.value).then(response => {
            if (response.length) {
                suggestions.innerHTML = '';
                createCitySuggestions(response);
                showSuggestions();
            } else {
                hideSuggestions();
            }
        });
    } else {
        hideSuggestions();
    }
}, 500));