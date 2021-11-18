const express = require('express');
const https = require("https");
const router = express.Router();

router.use('/places', require('./places/index'));

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