const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/:place', function (req, res, next) {
    if (fs.existsSync('./cache/available-cities.json')) {
        let data = fs.readFileSync('./cache/available-cities.json', 'utf8');

        res.send(parseAndFilterCities(req.params['place'], data));
    } else {
        res.send({error: 404});
    }
});

function parseAndFilterCities(city, data) {
    let normalizedCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(' ', '-');

    data = JSON.parse(data);
    data = data.filter(x => x.countryCode === 'LT' && (x.name.toLowerCase().startsWith(city.toLowerCase()) || x.code.startsWith(normalizedCity)));
    data = data.slice(0, 10);

    return data;
}

module.exports = router;