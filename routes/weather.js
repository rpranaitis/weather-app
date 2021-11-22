const express = require('express');
const https = require("https");
const requestIp = require("request-ip");
const fs = require("fs");
const router = express.Router();

router.use('/places', require('./places/index'));

router.get('/:place', function (req, res, next) {
    let place = req.params['place'];
    let normalizedPlace = place.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(' ', '-');

    https.get(`https://api.meteo.lt/v1/places/${normalizedPlace}/forecasts/long-term`, response => {
        let result = '';

        response.on('data', data => {
            result += data.toString();
        });

        response.on('end', () => {
            res.send(JSON.parse(result));
        });
    });

    cacheDefaultCity(req);
});

function cacheDefaultCity(req) {
    let ip = extractIp(requestIp.getClientIp(req));

    let result = {
        address: {
            city: req.params['place'],
            country_code: 'lt'
        }
    };

    fs.writeFileSync(`./cache/default-cities/${ip}.json`, JSON.stringify(result));
}

function extractIp(ip) {
    if (ip.substr(0, 7) === '::ffff:') {
        return ip.substr(7);
    }

    if (ip === '::1') {
        return 'localhost';
    }

    return ip;
}

module.exports = router;