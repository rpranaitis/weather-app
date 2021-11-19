import {
    defaultModal,
    modal,
    cityInput,
    cityLinks,
    searchButton,
    unitSwitch,
    historySuggestions,
    suggestions
} from './selectors';

import {
    updateBlocksByCity,
    convertTemperatureToF,
    convertTemperatureToC,
    hideSuggestions,
    showHistory,
    hideHistory,
    showCitySuggestions, extractCodeFromSuggestions
} from './app';

import debounce from 'lodash.debounce';

window.addEventListener('click', event => {
    if (!suggestions.classList.contains('d-none') || !historySuggestions.classList.contains('d-none')) {
        if (event.target.id !== 'cityInput') {
            hideHistory();
            hideSuggestions();
        }
    }
});

window.addEventListener('keyup', event => {
    if (event.keyCode === 13 && defaultModal.style.display === 'block') {
        event.preventDefault();
        modal.toggle();
    }
});

for (let cityLink of cityLinks) {
    cityLink.addEventListener('click', () => {
        updateBlocksByCity(cityLink.getAttribute('data-code'));
    });
}

searchButton.addEventListener('click', () => {
    let suggestions = document.querySelector('.suggestions.on-top');

    if (suggestions.childElementCount) {
        console.log('test');
        updateBlocksByCity(extractCodeFromSuggestions(cityInput.value));
    } else {
        updateBlocksByCity(cityInput.value);
    }
});

cityInput.addEventListener('focus', () => {
    if (cityInput.value) {
        showCitySuggestions(cityInput.value);
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

        if (historySuggestions.childElementCount) {
            showHistory();
        }
    }
}, 150));