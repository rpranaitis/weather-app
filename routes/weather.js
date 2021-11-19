const express = require('express');
const https = require("https");
const router = express.Router();

router.use('/places', require('./places/index'));

router.get('/:place', function(req, res, next) {
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
});

module.exports = router;