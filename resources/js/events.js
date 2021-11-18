import {
    defaultModal,
    modal,
    cityInput,
    cityLinks,
    searchButton,
    unitSwitch,
    searchList,
    inputGroupText
} from './selectors';
import {updateBlocksByCity, convertTemperatureToF, convertTemperatureToC} from './app';
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
    updateBlocksByCity(cityInput.value);
});

cityInput.addEventListener('keyup', event => {
    if (event.keyCode === 13) {
        event.preventDefault();
        cityInput.disabled = true;
        searchButton.click();
    }
});

cityInput.addEventListener('input', debounce(function() {
    if (searchList.classList.contains('d-none')) {
        inputGroupText.style.borderBottomLeftRadius = 0;
        searchList.classList.remove('d-none');
    }
}, 500));

unitSwitch.addEventListener('click', () => {
    if (unitSwitch.checked) {
        convertTemperatureToF();
    } else {
        convertTemperatureToC();
    }
});