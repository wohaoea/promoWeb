/**
 * Created by Administrator on 2016/9/2.
 */
var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

router.post("/chubaodata", function (req, res, next) {
    var jdata = req.body;
    wsclient.checkdata(jdata ,function (result) {
        res.send(result)
    })
})

module.exports = router;