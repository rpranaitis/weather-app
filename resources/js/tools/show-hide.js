import {historySuggestions, inputGroupText, resetInput, spinnerBlock, suggestions, weatherWrapper} from "../selectors";
import {createCitySuggestions} from "./suggestions";
import {fetchAvailableCities} from "./ajax";

export function showSuggestions() {
    hideHistory();
    inputGroupText.style.borderBottomLeftRadius = 0;
    suggestions.classList.remove('d-none');
}

export function hideSuggestions() {
    suggestions.innerHTML = '';
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

export function showResetInput() {
    resetInput.classList.remove('d-none');
    resetInput.classList.add('d-flex');
}

export function hideResetInput() {
    resetInput.classList.add('d-none');
    resetInput.classList.remove('d-flex');
}

export function toggleWeatherWrapper() {
    if (weatherWrapper.classList.contains('d-none')) {
        weatherWrapper.classList.toggle('d-block');
        weatherWrapper.classList.toggle('d-none');
        spinnerBlock.style.backgroundColor = 'rgba(255, 255, 255, .6)';
    }
}

export function toggleSpinnerBlock() {
    spinnerBlock.classList.toggle('d-none');
    spinnerBlock.classList.toggle('d-flex');
}

export function showCitySuggestions(city) {
    fetchAvailableCities(city).then(response => {
        if (response.length) {
            suggestions.innerHTML = '';
            createCitySuggestions(response);
            showSuggestions();
        } else {
            hideSuggestions();
            hideHistory();
        }
    });
}