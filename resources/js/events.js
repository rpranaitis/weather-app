import {
    defaultModal,
    modal,
    cityInput,
    cityLinks,
    searchButton,
    unitSwitch,
    historySuggestions, suggestions
} from './selectors';

import {
    updateBlocksByCity,
    convertTemperatureToF,
    convertTemperatureToC,
    showSuggestions,
    hideSuggestions,
    showHistory,
    hideHistory,
    showCitySuggestions
} from './app';

import debounce from 'lodash.debounce';

window.addEventListener('click', event => {
    if (!suggestions.classList.contains('d-none') || !historySuggestions.classList.contains('d-none')) {
        event.preventDefault();
        hideHistory();
        hideSuggestions();
    }
});

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
    hideHistory();
    updateBlocksByCity(cityInput.value);
});

cityInput.addEventListener('click', () => {
    if (cityInput.value) {
        hideHistory();
        showSuggestions(cityInput.value);
    }

    if (historySuggestions.childElementCount && !cityInput.value) {
        hideSuggestions()
        showHistory();
    }
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
        showCitySuggestions(cityInput.value);
    } else {
        hideSuggestions();
        showHistory();
    }
}, 500));