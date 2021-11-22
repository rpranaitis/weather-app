import {cityInput, suggestions} from "../selectors";
import {hideHistory, hideResetInput, hideSuggestions} from "./show-hide";
import {updateBlocksByCity} from "../app";

export function createCitySuggestions(cities) {
    for (let city of cities) {
        let suggestionBox = document.createElement('div');
        suggestionBox.classList.add('suggestion-box', 'd-flex');
        suggestionBox.setAttribute('data-code', city.code);
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
            hideResetInput();
            updateBlocksByCity(city.code);
            cityInput.value = city.name;
        });
    }
}

export function extractCodeFromSuggestions(city) {
    let suggestionCities = document.querySelectorAll('.suggestions.on-top .suggestion-box p.city');

    for (let [index, suggestionCity] of suggestionCities.entries()) {
        if (suggestionCity.textContent.toLowerCase() === city.toLowerCase()) {
            let suggestionBox = document.querySelector(`.suggestions.on-top .suggestion-box:nth-child(${index + 1})`);

            return suggestionBox.getAttribute('data-code');
        }
    }

    return city;
}