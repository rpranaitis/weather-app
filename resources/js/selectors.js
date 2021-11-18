window.bootstrap = require('bootstrap');

export let cityLinks = document.querySelectorAll('.city-links');
export let cityInput = document.querySelector('#cityInput');
export let searchButton = document.querySelector('#searchButton');
export let inputGroupText = document.querySelector('.input-group-text');

export let suggestions = document.querySelector('.suggestions');
export let historySuggestions = document.querySelector('.history');

export let modal = new bootstrap.Modal(document.querySelector('.modal'), {})
export let defaultModal = document.querySelector('.modal');
export let defaultModalText = document.querySelector('.modal .modal-body .body-text');

export let weatherWrapper = document.querySelector('.weather-wrapper');
export let spinnerBlock = document.querySelector('.spinner-block');

export let cityElement = document.querySelector('#city span');
export let municipalityElement = document.querySelector('#municipality')

export let unitSwitch = document.querySelector('#unitSwitch');
export let temperatures = document.querySelectorAll('.temp-blocks .temperature p');

export let body = document.querySelector('body');