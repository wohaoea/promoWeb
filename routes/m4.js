var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");



//爱拼才会赢 获取抽奖次数
router.get("/getApLotteryChances", function(req, res, next) {
	var user = req.session.user;
	if (!user) {
		res.send(utils.getFailResult("-1", "", "notlogin"));
	}
	wsclient.getApLotteryChances({
		mobile: user.phoneNumber,
		custId: user.custId
	}, function(wsresult) {
		res.send(wsresult);
	});
});

//爱拼才会赢 获取抽奖结果
router.get("/getApLotteryResult", function(req, res, next) {
	var user = req.session.user || null;
	if (!user) {
		res.send(utils.getFailResult("-1", "", "notlogin"));
	}
	if (!user.phoneNumber) {
		res.send(utils.getSuccessResult(-1, "", "phone"));
	}
	if (req.session.realName) {
		res.send(utils.getSuccessResult(-1, "", "realname"));
	}
	//var rand= Math.floor(Math.random()*6);
	var result = {};
	//console.log(result);
	//return res.send(utils.getSuccessResult(result, ""));
	wsclient.getApLotteryResult({
		mobile: user.phoneNumber,
		custId: user.custId,
		loginName: user.loginname
	}, function(wsresult) {
		if (wsresult.success) {
			if (wsresult.data == '0') {
				res.send(utils.getSuccessResult(-1, "", 'zero'));
				return
			}
			result = utils.matchBg(parseInt(wsresult.data) - 1);
			res.send(utils.getSuccessResult(result, ""));
		} else {
			res.send(utils.getFailResult(wsresult.msg, ""));
		}
	});
});

//爱拼才会赢 获取兑奖结果
router.get("/getApExchargeResult", function(req, res, next) {
	var user = req.session.user;
	var range = req.query.range;
	if (!user) {
		res.send(utils.getFailResult("-1", "", "notlogin"));
	}

	wsclient.getApExchargeResult({
		mobile: user.phoneNumber,
		custId: user.custId,
		range: range
	}, function(wsresult) {
		res.send(wsresult);
	});
});
//爱拼才会赢 获取还没有使用的字map
router.get("/getApLotteryResultsByNotUse", function(req, res, next) {
	var user = req.session.user || null;
	var prizeList = [{
		prizeRange: 1,
		count: 0
	}, {
		prizeRange: 2,
		count: 0
	}, {
		prizeRange: 3,
		count: 0
	}, {
		prizeRange: 4,
		count: 0
	}, {
		prizeRange: 5,
		count: 0
	}, {
		prizeRange: 6,
		count: 0
	}, {
		prizeRange: 7,
		count: 0
	}]
	var result = {
		user: user
	};
	if (!user) {
		return res.render("m4/temp_exchange", result);

	}
	/*测试数据*/
	/*	var wsdata = [{prizeRange:1,count:1},{prizeRange:2,count:2}]
	 if(wsdata.length !=0){
	 for(var i=0;i<wsdata.length;i++){
	 for(var j=0;j<prizeList.length;j++){
	 if(wsdata[i].prizeRange==prizeList[j].prizeRange){
	 prizeList[j].count = wsdata[i].count
	 }
	 }
	 }
	 }
	 result.prizeList = prizeList;
	 res.render("/m4/temp_exchange",result);*/
	/*测试数据结束*/
	wsclient.getApLotteryResultsByNotUse({
		mobile: user.phoneNumber,
		custId: user.custId
	}, function(wsresult) {
		if (wsresult.success) {
			var wsdata = wsresult.data;
			if (wsdata.length != 0) {
				for (var i = 0; i < wsdata.length; i++) {
					for (var j = 0; j < prizeList.length; j++) {
						if (wsdata[i].prizeRange == prizeList[j].prizeRange) {
							prizeList[j].count = wsdata[i].count
						}
					}
				}
			}
			result.prizeList = prizeList;
			res.render("m4/temp_exchange", result);
		}
	});
});
/*
 * 获取消息数
 */
router.get('/pra/noReadMsg', function(req, res, next) {
	var user = req.session.user;
	wsclient.messageNoReadMsgCount({
			"custId": user.custId.toString()
		},
		function(wsresult) {
			if (wsresult.success) {
				res.send(utils.getSuccessResult(wsresult.data));
			} else {
				res.send(utils.getFailResult("请求失败", '/'));
			}
		});
});

/*
 * 宽途合作注册页
 */
router.route('/ktreg/:custId?')
	.get(function(req, res, next) {
		res.render('m4/ktreg');
		//regRend(req, res, req.params.custId)
	})
	.post(function(req, res, next) {

		var queryString = (req.headers.referer.split("?")[1]) || '';
		var pswd = req.body.pswd,
			mobile = req.body.mobile,
			smsCode = req.body.verifyCode;

		var regOs = utils.delectOS(req);
		var regDevice = utils.platSource(req);
		var uinfo = {
			loginPassword: pswd,
			pswdagn: pswd,
			recommendCode: '', //邀请码
			mobile: mobile, //手机号码
			regType: "5",
			smsCode: smsCode,
			activitySrc: "宽途洗车券",
			regOs: regOs,
			regDevice: regDevice,
			loginIp: utils.getClientIp(req),
			regSource: "1091",
			queryString: queryString,
			belongPlatform:'P2P'
		};
		if (req.session.curtime) {

			if (req.body.icode.toLowerCase() != (req.session.captcha.code).toLowerCase()) {
				res.send(utils.getFailResult("图片验证码不正确"));
			}

			if (req.session.mobileCode) {
				if (!smsCode || req.session.mobileCode.code != smsCode) {
					return res.send(utils.getFailResult(messages.vcodeNotCorrect, "", "", "vcode"));
				}
				/*if (mobile != req.session.mobileCode.pnumber) {
				 return res.send(utils.getFailResult("手机号前后不一致", "", "", "phonetips"));
				 }*/

				if (utils.isNull(uinfo.loginIp)) {
					logger.info('Invalid login ip : ', uinfo);
					return res.send(utils.getFailResult('异常请求，请联系客服。'));
				}
				wsclient.createCustomer(uinfo, function(wsresult) {
					if (wsresult.success) {
						//创建并保存session

						utils.createSession({
							loginname: wsresult.data.userData.loginName,
							custId: wsresult.data.userData.id,
							mobile: mobile
						}, req, res);

						req.session.mobileCode = null;
						req.session.captcha = null;
						req.session.uservalidphonetime = new Date().getTime();
						req.session.xcCoupon = wsresult.data.xcCoupon;
						logger.info('ktreg' + mobile + ':' + req.session.xcCoupon + '-----------------' + wsresult.data.xcCoupon);
						res.send(utils.getSuccessResult(null, ''));
					} else {
						res.send(utils.getFailResult(wsresult.msg, "", "", "validcodetips"));
					}
				});
			} else {
				return res.send(utils.getFailResult("验证码已失效", "", "", "validcodetips"));
			}
		} else {
			return res.send(utils.getFailResult("请点击获取验证码", "", "", "validcodetips"));
		}
	});



/*
 * 宽途活动细则
 */
router.get('/ktrule', function(req, res, next) {
	res.render("m4/ktrule");
});
/*
 * 宽途注册回调页
 */
router.get('/ktregback', function(req, res, next) {

	if (!req.session.user) {
		res.redirect("/m4/ktreg");
		return;
	}
	var ejsval = {};
	ejsval.xcCoupon = req.session.xcCoupon;
	ejsval.h5domain = config.base.h5domain;
	logger.info('ktregback:'+req.session.xcCoupon+'-----------------'+ejsval.xcCoupon);
	//console.log(req.session.xcCoupon);
	res.render("m4/ktreg_back",ejsval);
});

/*
 * 阳光保险
 */
router.get('/yangguang', function(req, res, next) {
	res.redirect("/notfound");
	return;
	var user = req.session.user || null;


	var result = {};

	/*取福袋session*/
	result.fudai = req.session.fudai;

	result.user = user;	
	result.domain = config.base.domain;
	res.render("m4/yangguang", result);
});
/*
 * 一日CEO
 */
router.get('/onedayceo', function(req, res, next) {
	res.render("m4/onedayceo");
});


/*
 * 双节狂欢
 */
router.get('/sjkh', function(req, res, next) {
	var user = req.session.user;
	/*/!*模拟数据*!/
	user = {};
	user.custId = '15002746';*/

	var date = new Date().getTime();
	var startDate = new Date('2015-09-24 00:00:00').getTime();
	var endDate = new Date('2015-10-26 23:59:59').getTime();
	if (date < startDate || date > endDate) {
		res.redirect(config.base.domain);
	}


	var result = {};
	result.user = user;
	result.version = config.base.version;
	result.domain = config.base.domain;
	result.d = {};
	req.session.sjkhUrl = 'm4/sjkh';
	if (user) {

		wsclient.getSJPrizeChances({
			custId: user.custId,
			type: "1"
		}, function(wsresult) {
			result.d.drawModel = wsresult.data;
			wsclient.getSJPrizeChances({
				custId: user.custId,
				type: "2"
			}, function(wsresult) {
				if (wsresult.success) {
					result.d.yaoshi = [{
						"counts": 0,
						"type": "PROD_A" //铜钥匙
					}, {
						"counts": 0,
						"type": "PROD_B" //银钥匙
					}, {
						"counts": 0,
						"type": "PROD_C" //金钥匙
					}];
					for (var i = 0; i < wsresult.data.length; i++) {
						if (wsresult.data[i].type == "PROD_A" && wsresult.data[i].counts > 0) {
							result.d.yaoshi[0].counts = wsresult.data[i].counts;
						}
						if (wsresult.data[i].type == "PROD_B" && wsresult.data[i].counts > 0) {
							result.d.yaoshi[1].counts = wsresult.data[i].counts;
						}
						if (wsresult.data[i].type == "PROD_C" && wsresult.data[i].counts > 0) {
							result.d.yaoshi[2].counts = wsresult.data[i].counts;
						}
					}

				} else {
					result.d.yaoshi = [{
						"counts": 0,
						"type": "PROD_A" //铜钥匙
					}, {
						"counts": 0,
						"type": "PROD_B" //银钥匙
					}, {
						"counts": 0,
						"type": "PROD_C" //金钥匙
					}];
				}
				res.render("m4/sjkh", result);
			});
		});
	} else {

		result.d.drawModel = 1;
		result.d.yaoshi = [{
			"counts": 0,
			"type": "PROD_A" //铜钥匙
		}, {
			"counts": 0,
			"type": "PROD_B" //银钥匙
		}, {
			"counts": 0,
			"type": "PROD_C" //金钥匙
		}];
		res.render("m4/sjkh", result);
	}
});
/*
 * 双节狂欢礼包
 */
router.get('/pra/sjkhlihe', function(req, res, next) {
	var user = req.session.user;
	/*模拟数据*/
	/*user = {};
	user.custId = '15002746';
	user.phoneNumber = '17845698745';*/

	var type = req.query.type ? req.query.type : 1;


	var date = new Date().getTime();
	var startDate = new Date('2015-09-25 00:00:00').getTime();
	var endDate = new Date('2015-10-26 23:59:59').getTime();
	if (date < startDate) {
		res.send(utils.getFailResult("活动还未开始，请耐心等待!", "", "", "aa"));
	}
	if (date > endDate) {
		res.send(utils.getFailResult("活动已结束!", "", "", "aa"));
	}


	if (!user) {
		res.send(utils.getFailResult("您还未登录，请先登录!", "", "", "login"));
	} else {
		var tel = user.phoneNumber ? user.phoneNumber.toString() : "";
		var custId = user.custId ? user.custId.toString() : "";
		wsclient.getSJPrizeChances({
			custId: user.custId.toString(),
			type: "1"
		}, function(ws) {

			wsclient.exchargeSJPrize({
				tel: tel,
				custId: custId,
				type: type
			}, function(wsresult) {
				req.session.sjlbStart = 0;
				res.send(utils.getSuccessResult(wsresult.data, "", "", "sjkhbaoxian"));
			});

		});


	}
});
/*
 * 双节狂欢抽宝箱
 */
router.get('/pra/sjkhbaoxian', function(req, res, next) {

	var user = req.session.user;
	/*模拟数据*/
	/*user = {};
	user.custId = '15002746';
	user.phoneNumber = '17845698745';*/

	var type = req.query.type ? req.query.type : 1;


	var date = new Date().getTime();
	var startDate = new Date('2015-09-25 00:00:00').getTime();
	var endDate = new Date('2015-10-26 23:59:59').getTime();
	if (date < startDate) {
		res.send(utils.getFailResult("活动还未开始，请耐心等待!", "", "", "aa"));
	}
	if (date > endDate) {
		res.send(utils.getFailResult("活动已结束!", "", "", "aa"));
	}



	var type = req.query.type;
	var obj = {};

	if (!user) {
		res.send(utils.getFailResult("您还未登录，请先登录!", "", "", "login"));
	} else {
		var tel = user.phoneNumber ? user.phoneNumber.toString() : "";
		var custId = user.custId ? user.custId.toString() : "";

		wsclient.getSJPrizeChances({
			custId: user.custId,
			type: "2"
		}, function(wsresult) {
			if (!wsresult.success) {
				res.send(utils.getFailResult("系统错误，请重新开启!", "", "", "sjkhbaoxian"));
				return;
			}
			obj.yaoshi = [{
				"counts": 0,
				"type": "PROD_A" //铜钥匙
			}, {
				"counts": 0,
				"type": "PROD_B" //银钥匙
			}, {
				"counts": 0,
				"type": "PROD_C" //金钥匙
			}];

			for (var i = 0; i < wsresult.data.length; i++) {
				if (wsresult.data[i].type == "PROD_A" && wsresult.data[i].counts > 0) {
					obj.yaoshi[0].counts = wsresult.data[i].counts;
				}
				if (wsresult.data[i].type == "PROD_B" && wsresult.data[i].counts > 0) {
					obj.yaoshi[1].counts = wsresult.data[i].counts;
				}
				if (wsresult.data[i].type == "PROD_C" && wsresult.data[i].counts > 0) {
					obj.yaoshi[2].counts = wsresult.data[i].counts;
				}
			}

			var yaoshiStr = "";
			if (type == "PROD_A") yaoshiStr = "铜";
			if (type == "PROD_B") yaoshiStr = "银";
			if (type == "PROD_C") yaoshiStr = "金";

			if (type == "PROD_A" && obj.yaoshi[0].counts || (type == "PROD_B" && obj.yaoshi[1].counts) || (type == "PROD_C" && obj.yaoshi[2].counts)) {
				wsclient.exchargeSJKeyPrize({
					tel: tel,
					custId: custId,
					type: type
				}, function(wsresult2) {

					if (wsresult2.data == "0") {
						res.send(utils.getFailResult("钥匙数量不足，快去投资获取" + yaoshiStr + "钥匙吧!", "", "", "sjkhbaoxian"));
					}
					//type == "PROD_A" && obj.yaoshi[0].counts || (type == "PROD_B" && obj.yaoshi[1].counts) || (type == "PROD_C" && obj.yaoshi[2].counts)
					switch (type) {
						case "PROD_A":
							obj.yaoshi[0].counts = obj.yaoshi[0].counts - 1;
							break;
						case "PROD_B":
							obj.yaoshi[1].counts = obj.yaoshi[1].counts - 1;
							break;
						case "PROD_C":
							obj.yaoshi[2].counts = obj.yaoshi[2].counts - 1;
							break;
					}

					obj.money = wsresult2.data;
					res.send(utils.getSuccessResult(obj, "", "", "sjkhbaoxian"));
				});
			} else {
				res.send(utils.getFailResult("钥匙数量不足，快去投资获取" + yaoshiStr + "钥匙吧!", "", "", "sjkhbaoxian"));
			}


		});


	}



	//result.send(utils.getFailResult("验证码已失效", "", "", "validcodetips"));
	//res.send(result);
});
module.exports = router;