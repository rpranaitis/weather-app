import {
    defaultModal,
    modal,
    cityInput,
    cityLinks,
    searchButton,
    unitSwitch,
    historySuggestions,
    suggestions, resetInput, scrollToTopButton
} from './selectors';

import {
    updateBlocksByCity,
    convertTemperatureToF,
    convertTemperatureToC,
    hideSuggestions,
    showHistory,
    hideHistory,
    showCitySuggestions,
    extractCodeFromSuggestions,
    showResetInput,
    hideResetInput,
    scrollToCity,
    scrollFunction,
    scrollToTop
} from './app';

import debounce from 'lodash.debounce';

window.onscroll = () => scrollFunction();

document.addEventListener('click', event => {
    if (event.target.id !== 'cityInput' && !resetInput.contains(event.target)) {
        if (!suggestions.classList.contains('d-none') || !historySuggestions.classList.contains('d-none')) {
            hideHistory();
            hideSuggestions();
        }

        hideResetInput();
    }
});

document.addEventListener('keyup', event => {
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

scrollToTopButton.addEventListener('click', () => scrollToTop());

resetInput.addEventListener('click', () => {
    cityInput.value = '';
    hideSuggestions();
    hideResetInput();
    cityInput.focus();
});

searchButton.addEventListener('click', () => {
    hideSuggestions();

    let suggestions = document.querySelector('.suggestions.on-top');

    if (suggestions.childElementCount) {
        updateBlocksByCity(extractCodeFromSuggestions(cityInput.value));
    } else {
        updateBlocksByCity(cityInput.value);
    }
});

cityInput.addEventListener('focus', () => {
    if (cityInput.value) {
        showCitySuggestions(cityInput.value);
        showResetInput();
    }

    if (historySuggestions.childElementCount && !cityInput.value) {
        hideSuggestions();
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

cityInput.addEventListener('input', debounce(() => {
    if (cityInput.value) {
        showCitySuggestions(cityInput.value);
        showResetInput();
    } else {
        hideSuggestions();
        hideResetInput();

        if (historySuggestions.childElementCount) {
            showHistory();
        }
    }
}, 250));