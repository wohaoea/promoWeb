var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");
var session = require("../common/session");

//模拟数据DEBUG----
//require("../test/dfh_simul");
//require("../test/session_simul").setlogin(session);

//大富豪
router.get("/index", function (req, res, next) {
	/*if (utils.checkExpired(new Date("2016-01-31 00:00:00"), new Date("2016-03-01 00:00:00")) === false) {
		res.redirect(config.base.domain);
	}*/
    var user = session.get(req).user;
    var result = {};
    result.user = user;
    result.dfh = null;
    result.rerul = "dfh";

    wsclient.journeyInfo({}, function (wsresult) {
        if (utils.checkExpired(new Date(wsresult.data.startTime), new Date(wsresult.data.endTime)) === false) {
            res.redirect(config.base.domain);
        }
        if (result.user) {
            wsclient.dfh_userinfo({
                custId: user.custId.toString()
            }, function (wsresult) {
                result.dfh = wsresult.data;
                res.render("dfh/index", result);
            });
        } else {
            res.render("dfh/index", result);
        }
    });


});

//签到
router.get("/sign", function (req, res, next) {
    var user = session.get(req).user;
    if (!user) {
        return res.send(utils.getFailResult("未登录"));
    }
    wsclient.dfh_sign({
        custId: user.custId.toString()
    }, function (wsresult) {
        res.send(wsresult);
    });

});
//转起来
router.get("/zhuan", function (req, res, next) {
    var user = session.get(req).user;
    if (!user) {
        return res.send(utils.getFailResult("未登录"));
    }
    wsclient.dfh_zhuan({
        custId: user.custId.toString()
    }, function (wsresult) {
        res.send(wsresult);
    });

});

module.exports = router;