const express = require('express');
const router = express.Router();
const https = require('https');

router.get('/:place', function(req, res, next) {
    https.get(`https://api.meteo.lt/v1/places/${req.params['place']}/forecasts/long-term`, response => {
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