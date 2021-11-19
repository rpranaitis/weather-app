const express = require('express');
const https = require('https');
const router = express.Router();
const requestIp = require('request-ip');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/default', function(req, res, next) {
  https.get(`https://ipinfo.io/${requestIp.getClientIp(req)}`, response => {
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
