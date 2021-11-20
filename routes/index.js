const express = require('express');
const https = require('https');
const router = express.Router();
const requestIp = require('request-ip');
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/default', function(req, res, next) {
  let ip = extractIp(requestIp.getClientIp(req));

  https.get(`https://ipinfo.io/${ip}`, response => {
    let result = '';

    response.on('data', data => {
      result += data.toString();
    });

    response.on('end', () => {
      res.send(JSON.parse(result));
    });
  });

  cacheAvailableCities();
});

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

  return ip;
}

module.exports = router;
