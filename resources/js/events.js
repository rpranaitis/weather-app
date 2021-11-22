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
    updateBlocksByCity
} from './app';

import debounce from 'lodash.debounce';
import {convertTemperatureToC, convertTemperatureToF} from "./tools/units-converter";

import {
    hideHistory,
    hideResetInput,
    hideSuggestions,
    showCitySuggestions,
    showHistory,
    showResetInput
} from "./tools/show-hide";

import {scrollFunction, scrollToTop} from "./tools/scroll";
import {extractCodeFromSuggestions} from "./tools/suggestions";

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

searchButton.addEventListener('click', () => {
    hideSuggestions();

    let suggestions = document.querySelector('.suggestions.on-top');

    if (suggestions.childElementCount) {
        updateBlocksByCity(extractCodeFromSuggestions(cityInput.value));
    } else {
        updateBlocksByCity(cityInput.value);
    }
});

unitSwitch.addEventListener('click', () => {
    if (unitSwitch.checked) {
        convertTemperatureToF();
    } else {
        convertTemperatureToC();
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

cityInput.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
        event.preventDefault();
        cityInput.disabled = true;
        searchButton.click();
    }
});

resetInput.addEventListener('click', () => {
    cityInput.value = '';
    hideSuggestions();
    hideResetInput();
    cityInput.focus();
});