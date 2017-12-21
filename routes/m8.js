var express = require('express');
var router = express.Router();
var config = require('../config');
router.get('/jiaxi', function(req, res) {
    res.render('m8/jiaxi', {
        domain: config.base.domain
    });
});

router.get('/jiaxipc', function(req, res) {
    res.render('m8/jiaxipc', {
        user: req.session.user || null,
        domain: config.base.domain,
        promodomain: config.base.promodomain,
        _custId: req.session.user ? req.session.user.custId : "",
        originalUrl: encodeURIComponent(config.base.promodomain + (req.originalUrl).substring(1)),
        config: config
    });
});

router.get('/jiaxi-join', function(req, res) {
    res.render('m8/jiaxi-join', {
        promodomain: config.base.promodomain
    });
});

module.exports = router;