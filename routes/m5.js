var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

//摇一摇
router.get("/index", function(req, res, next) {
	req.session.regSource = "1108";
	res.render("m5/index");
});


router.get("/hhr", function(req, res, next) {
	var user = req.session.user || null;
	var result = {};

	/*取福袋session*/
	result.fudai = req.session.fudai;
	result.guoqing = req.session.guoqing;
	result.user = user;
	result.domain = config.base.domain;
	res.render("m5/hhr", result);
});

//保存超级合伙人
router.get("/pra/savePartner", function(req, res, next) {

	/*wsclient.savePartner({
			custId: "15003816
		}, function(result) {
			res.send(result.data);
		});*/

	var user = req.session.user || null;
	if (user) {
		wsclient.savePartner({
			custId: user.custId.toString()
		}, function(result) {
			res.send(result);
		});
	}else{
		res.send(utils.getFailResult("您还未登录，请先登录", "", "", "error"));
	}

});

//推荐好友
router.get("/refriend", function(req, res, next) {
	var t = new Date("2016-01-01 00:00:00");
	if (new Date().getTime() >= t) {
		res.redirect(config.base.domain);
	}
	var user = req.session.user||null;
	var result={};
	
	/*取福袋session*/
	result.fudai = req.session.fudai;
	result.guoqing = req.session.guoqing;
	result.user=user;
	result.domain = config.base.domain;
	result.nohdomain=config.base.domain.replace("http://","");
	res.render("m5/refriend",result);
});

//充值上限说明
router.get("/rechargelimit", function(req, res, next) {
	res.render("m5/rechargelimit");
});

module.exports = router;