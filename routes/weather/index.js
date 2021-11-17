const express = require('express');
const router = express.Router();
const https = require('https');
const fs = require('fs');

router.get('/', function(req, res, next) {
    if (fs.existsSync('./cache/available-cities.json')) {
        sendAvailableCitiesFromCache(res);
    } else {
        sendAvailableCitiesFromAPI(res)
    }
});

function sendAvailableCitiesFromAPI(res) {
    https.get('https://api.meteo.lt/v1/places', response => {
        let result = '';

        response.on('data', data => {
            result += data.toString();
        });

        response.on('end', () => {
            fs.writeFileSync('./cache/available-cities.json', result);
            res.send(parseAndFilterCities(result));
        });
    });
}

function sendAvailableCitiesFromCache(res) {
    let data = fs.readFileSync('./cache/available-cities.json', 'utf8');

    res.send(parseAndFilterCities(data));
}

function parseAndFilterCities(data) {
    data = JSON.parse(data);
    data = data.filter(x => x.countryCode === 'LT');

    return data;
}

module.exports = router;