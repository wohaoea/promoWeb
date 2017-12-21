var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

/*
 *夏日疯狂送
 *7月11到8月12
 */
router.get("/index/:custId?", function(req, res, next) {
	var user = req.session.user;
	var t = new Date("2015-08-13 00:00:00");
	var now = new Date();
	if (new Date().getTime() >= t) {
		res.redirect(config.base.domain);
	}
	req.session.inviteCode=req.params.custId;
	var user = req.session.user;
	var result = {};
	result.domain = config.base.domain;
	result.user = user;
	result.lotterylist = undefined; //中奖列表
	result.chance = null;
	result.endactivetime = t-now;
	wsclient.getSummerLotteryList({}, function(wsresult) {
		result.lotterylist = wsresult.data || null; //中奖列表
		if (result.user) {
			wsclient.getSummerLotteryChances({
				mobile: user.phoneNumber,
				custId: user.custId
			}, function(wsresult) {
				if (wsresult.success) {
					result.chance = wsresult.data; //抽奖次数
					//result.chance = 3; //抽奖次数
					if(result.chance == '-2'){
						result.chance=0;
						req.session.realName = 1;
					}else{
						req.session.realName = 0;
					}
					res.render('m2/p20150812',result);
				}
			});
		} else {
			res.render('m2/p20150812',result);
		}
	});
	
});

/*欢乐送
	getSummerLotteryResult:wsurls.summerLotteryURL+"getSummerLotteryResult",//summerLottery/getSummerLotteryResult暑期欢乐送获取结果
	getSummerLotteryList:wsurls.summerLotteryURL+"getSummerLotteryList",//获取暑期欢乐颂中奖名单
	getSummerLotteryChances:wsurls.summerLotteryURL+"getSummerLotteryChances",//所剩抽奖机会
*/

//暑期欢乐送获取结果
router.get("/summerLottery", function(req, res, next) {
	var user = req.session.user;
	if (!user) {
		res.send(utils.getFailResult("您尚未登录", ""));
	}
	if (!user.phoneNumber) {
		res.send(utils.getSuccessResult(-1,"","phone"));
	}
	if (req.session.realName) {
		res.send(utils.getSuccessResult(-1,"","realname"));
	}
	/*res.send(utils.getSuccessResult('9', ""));
	return*/
	wsclient.getSummerLotteryResult({
		mobile: user.phoneNumber,
		custId: user.custId,
		loginName: user.loginname
	}, function(wsresult) {
		if (wsresult.success) {
			res.send(utils.getSuccessResult(wsresult.data, ""));
		} else {
			res.send(utils.getFailResult(wsresult.msg, ""));
		}
	});
});

//获取抽奖次数
router.get("/getSummerLotteryChances", function(req, res, next) {
	var user = req.session.user;
	if (!user) {
		res.send(utils.getFailResult("您尚未登录", ""));
	}

	wsclient.getSummerLotteryChances({
		mobile: user.phoneNumber,
		custId: user.custId
	}, function(wsresult) {
		res.send(wsresult);
		/*if (wsresult.success) {
			res.send(utils.getSuccessResult(wsresult.data, ""));
		} else {
			res.send(utils.getFailResult(wsresult.msg, ""));
		}*/
	});
});

/*
 * 检查登录状态。
 */
router.get('/pra/noReadMsg', function(req, res, next) {
	var user = req.session.user;
	wsclient.messageNoReadMsgCount({
			"custId": user.custId.toString()
		},
		function(wsresult) {
			if(wsresult.success){
				res.send(utils.getSuccessResult(wsresult.data));
			}else{
				res.send(utils.getFailResult("请求失败", '/'));
			}
		});
});

module.exports = router;