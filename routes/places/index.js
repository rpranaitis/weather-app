const express = require('express');
const router = express.Router();
const https = require('https');
const fs = require('fs');

router.get('/:place', function(req, res, next) {
    if (fs.existsSync('./cache/available-cities.json')) {
        sendAvailableCitiesFromCache(req.params['place'], res);
    } else {
        sendAvailableCitiesFromAPI(req.params['place'], res)
    }
});

function sendAvailableCitiesFromAPI(city, res) {
    https.get('https://api.meteo.lt/v1/places', response => {
        let result = '';

        response.on('data', data => {
            result += data.toString();
        });

        response.on('end', () => {
            fs.writeFileSync('./cache/available-cities.json', result);
            res.send(parseAndFilterCities(city, result));
        });
    });
}

function sendAvailableCitiesFromCache(city, res) {
    let data = fs.readFileSync('./cache/available-cities.json', 'utf8');

    res.send(parseAndFilterCities(city, data));
}

function parseAndFilterCities(city, data) {
    data = JSON.parse(data);
    data = data.filter(x => x.countryCode === 'LT' && (x.name.toLowerCase().startsWith(city.toLowerCase())));
    data = data.slice(0, 10);

    return data;
}

module.exports = router;