const express = require('express');
const router = express.Router();
const fs = require('fs');
const https = require("https");

router.get('/:place', function (req, res, next) {
    if (fs.existsSync('./cache/available-cities.json')) {
        sendAvailableCitiesFromCache(req, res);
    } else {
        sendAvailableCitiesFromAPI(req, res);
    }
});

function sendAvailableCitiesFromCache(req, res) {
    let data = fs.readFileSync('./cache/available-cities.json', 'utf8');

    res.send(parseAndFilterCities(req.params['place'], data));
}

function sendAvailableCitiesFromAPI(req, res) {
    https.get('https://api.meteo.lt/v1/places', response => {
        let result = '';

        response.on('data', data => {
            result += data.toString();
        });

        response.on('end', () => {
            fs.writeFileSync('./cache/available-cities.json', result);

            res.send(parseAndFilterCities(req.params['place'], result));
        });
    });
}

function parseAndFilterCities(city, data) {
    let normalizedCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(' ', '-');

    data = JSON.parse(data);
    data = data.filter(x => x.countryCode === 'LT' && (x.name.toLowerCase().startsWith(city.toLowerCase()) || x.code.startsWith(normalizedCity)));
    data = data.slice(0, 10);

    return data;
}

module.exports = router;