export function fetchDefaultCity(lat, long) {
    return fetch(`./default/${lat}/${long}`)
        .then(response => response.json());
}

export function fetchWeatherByCity(city) {
    return fetch(`./weather/${city}`)
        .then(response => response.json());
}

export function fetchAvailableCities(city) {
    return fetch(`./weather/places/${city}`)
        .then(response => response.json());
}