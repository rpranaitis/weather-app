const express = require('express');
const https = require('https');
const router = express.Router();
const requestIp = require('request-ip');
const fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/default', function (req, res, next) {
    let ip = extractIp(requestIp.getClientIp(req));

    if (fs.existsSync(`./cache/default-cities/${ip}.json`)) {
        sendDefaultCityFromCache(ip, res);
    } else {
        sendDefaultCityFromAPI(ip, res);
    }

    cacheAvailableCities();
});

function sendDefaultCityFromCache(ip, res) {
    let data = fs.readFileSync(`./cache/default-cities/${ip}.json`, 'utf8');

    res.send(data);
}

function sendDefaultCityFromAPI(ip, res) {
    https.get(`https://ipinfo.io/${ip}`, response => {
        let result = '';

        response.on('data', data => {
            result += data.toString();
        });

        response.on('end', () => {
            fs.writeFileSync(`./cache/default-cities/${ip}.json`, result);
            res.send(JSON.parse(result));
        });
    });
}

function cacheAvailableCities() {
    https.get('https://api.meteo.lt/v1/places', response => {
        let result = '';

        response.on('data', data => {
            result += data.toString();
        });

        response.on('end', () => {
            fs.writeFileSync('./cache/available-cities.json', result);
        });
    });
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
