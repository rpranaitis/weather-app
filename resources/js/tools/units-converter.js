import {temperatures} from "../selectors";

export function convertTemperatureToF() {
    for (let temperature of temperatures) {
        let value = temperature.textContent.replace('°', '');
        let result = value * 1.8 + 32;

        temperature.textContent = result.toFixed() + '°';
    }
}

export function convertTemperatureToC() {
    for (let temperature of temperatures) {
        let value = temperature.textContent.replace('°', '');
        let result = (value - 32) / 1.8;

        temperature.textContent = result.toFixed() + '°';
    }
}