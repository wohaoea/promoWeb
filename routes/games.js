var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

router.get("/zongzi", function(req, res, next) {
	var t=new Date("2015-7-01");
	if(new Date().getTime()>=t){
		res.redirect('/reg');
	}
	//res.redirect('/reg');
	//return;
	/*if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
		var resobj = {
			loginName: "",
			signature: "",
			timespan: "",
			noncestr: ""
		}
		wsclient.WeiXinjsapi_ticket(function(result) {
			var crypto = require('crypto');
			var timespan = new Date().getTime();
			var noncestr = Math.random().toString(36).substr(2);
			var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://www.i-niuwa.com" + req.url
			var shasum = crypto.createHash('sha1');
			shasum.update(content);
			resobj.signature = shasum.digest('hex');
			resobj.timespan = timespan;
			resobj.noncestr = noncestr;
			res.render('games/zongzi', resobj);
		});
	} else {
		res.redirect('/reg');
	}*/
	
	var resobj = {
		loginName: "",
		signature: "",
		timespan: "",
		noncestr: ""
	}
	wsclient.WeiXinjsapi_ticket(function(result) {
		var crypto = require('crypto');
		var timespan = new Date().getTime();
		var noncestr = Math.random().toString(36).substr(2);
		var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com/games"+req.url
		var shasum = crypto.createHash('sha1');
		shasum.update(content);
		resobj.signature = shasum.digest('hex');
		resobj.timespan = timespan;
		resobj.noncestr = noncestr;
		res.render('games/zongzi', resobj);
	});



});

//保存相关数据
router.post("/zzsubmit", function(req, res, next) {
	if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
		if (!/^1\d{10}$/.test(req.body.mobile) || ~~req.body.source <= 0) {
			res.send(utils.getFailResult("参数错误", ""));
			return;
		}
		var params = {
			mobile: req.body.mobile,
			score: req.body.source
		};

		wsclient.savePeelZongZiResult(params, function(result) {
			if (result.success) {
				res.send(utils.getSuccessResult(result.data, "", result.msg));

			} else {
				res.send(utils.getFailResult(result.msg, ""));
			}

		});
	} else {
		res.send(utils.getFailResult("只能在微信中玩此游戏哦"));
	}
});

//端午节
router.get("/duanwu/:custId?", function(req, res, next) {

	var t=new Date("2015-7-01");
	if(new Date().getTime()>=t){
		res.redirect(config.base.domain);
	}

	req.session.inviteCode=req.params.custId;
	var user = req.session.user;
	var result = {};
	result.domain = config.base.domain;
	result.user = user;
	result.lotterylist = undefined; //中奖列表
	result.chance = null;

	wsclient.getDWLotteryResultList({}, function(wsresult) {

		result.lotterylist = wsresult.data || null; //中奖列表
		if (result.user) {
			wsclient.getDWLotteryChances({
				mobile: user.phoneNumber,
				custId: user.custId
			}, function(wsresult) {
				if (wsresult.success) {
					result.chance = wsresult.data; //抽奖次数
					res.render("games/duanwu", result);
				}
			});
		} else {
			res.render("games/duanwu", result);
		}
	});
});

//抽奖
router.get("/dwLottery", function(req, res, next) {
	var user = req.session.user;
	if (!user) {
		res.send(utils.getFailResult("您尚未登录", ""));
	}
	if (!user.phoneNumber) {
		res.send(utils.getSuccessResult(-1, ""));
	}
	wsclient.getDWLotteryResult({
		mobile: user.phoneNumber,
		custId: user.custId
	}, function(wsresult) {
		if (wsresult.success) {
			res.send(utils.getSuccessResult(wsresult.data, ""));
		} else {
			res.send(utils.getFailResult(wsresult.msg, ""));
		}
	});
});

//获取抽奖次数
router.get("/getDWLotteryChances", function(req, res, next) {
	var user = req.session.user;
	if (!user) {
		res.send(utils.getFailResult("您尚未登录", ""));
	}

	wsclient.getDWLotteryChances({
		mobile: user.phoneNumber,
		custId: user.custId
	}, function(wsresult) {
		if (wsresult.success) {
			res.send(utils.getSuccessResult(wsresult.data, ""));
		} else {
			res.send(utils.getFailResult(wsresult.msg, ""));
		}
	});
});


module.exports = router;