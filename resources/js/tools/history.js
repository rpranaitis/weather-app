import {cityInput, historySuggestions} from "../selectors";
import {hideHistory, hideResetInput, hideSuggestions} from "./show-hide";
import {updateBlocksByCity} from "../app";

export function updateHistory(city, municipality, code, history) {
    if (!history) {
        return;
    }

    rearrangeHistorySuggestions(code);

    let suggestionBox = document.createElement('div');
    suggestionBox.classList.add('suggestion-box', 'd-flex');
    suggestionBox.setAttribute('data-code', code);
    historySuggestions.prepend(suggestionBox);

    let icon = document.createElement('div');
    icon.classList.add('icon', 'd-flex', 'align-items-center')
    icon.innerHTML = '<i class="fas fa-history"></i>';
    suggestionBox.appendChild(icon);

    let body = document.createElement('div');
    body.classList.add('body')
    suggestionBox.appendChild(body);

    let cityParagraph = document.createElement('p');
    cityParagraph.classList.add('city');
    cityParagraph.textContent = city;
    body.appendChild(cityParagraph);

    let municipalityParagraph = document.createElement('p');
    municipalityParagraph.classList.add('municipality');
    municipalityParagraph.textContent = municipality;
    body.appendChild(municipalityParagraph);

    suggestionBox.addEventListener('click', () => {
        hideSuggestions();
        hideHistory();
        hideResetInput();
        updateBlocksByCity(code);
        cityInput.value = city;
    });
}

function rearrangeHistorySuggestions(code) {
    let historySuggestionBoxes = document.querySelectorAll('.history .suggestion-box');

    if (historySuggestions.childElementCount === 10) {
        historySuggestions.removeChild(historySuggestions.children[9])
    }

    for (let suggestionBox of historySuggestionBoxes) {
        if (suggestionBox.getAttribute('data-code') === code) {
            historySuggestions.removeChild(suggestionBox);
        }
    }
}