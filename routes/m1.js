var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

/*
 *欢乐暑期活动页
 */
router.get("/p20150701", function(req, res, next) {
	var t = new Date("2015-08-31 00:00:00");
	if (new Date().getTime() >= t) {
		res.redirect(config.base.domain);
	}

	res.render('m1/p20150701');
});

router.get("/p20150701_share/:custId?", function(req, res, next) {
	var t = new Date("2015-08-31 00:00:00");
	if (new Date().getTime() >= t) {
		res.redirect(config.base.domain);
	}

	var custId = req.params.custId || "";
	var resobj = {};
	resobj.isWX = false;

	if (req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
		resobj.isWX = true;
		wsclient.WeiXinjsapi_ticket(function(result) {
			var crypto = require('crypto');
			var timespan = new Date().getTime();
			var noncestr = Math.random().toString(36).substr(2);
			var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com/m1" + req.url
			var shasum = crypto.createHash('sha1');
			shasum.update(content);
			resobj.signature = shasum.digest('hex');
			resobj.timespan = timespan;
			resobj.noncestr = noncestr;
			resobj.shareURL = config.base.promodomain + "m1/niubereg/" + custId;
			resobj.custId = custId;

			if (custId) {
				wsclient.selectRecomInfoById({
					id: custId
				}, function(wsresult) {
					if (wsresult.success) {
						resobj.custId = custId;
						resobj.loginName = wsresult.data.mobile || wsresult.data.loginName;
						res.render('m1/p20150701_share', resobj);
					}
				});
			} else {
				resobj.loginName = "";
				resobj.custId = custId;
				res.render('m1/p20150701_share', resobj);
			}

		});
	} else {

		if (custId) {
			wsclient.selectRecomInfoById({
				id: custId
			}, function(wsresult) {
				if (wsresult.success) {
					resobj.custId = custId;
					resobj.loginName = wsresult.data.mobile || wsresult.data.loginName;
					resobj.shareURL = config.base.promodomain + "m1/niubereg/" + custId;
					res.render('m1/p20150701_share', resobj);
				}
			});
		} else {
			res.render('m1/p20150701_share', {
				isWX: false,
				custId: custId,
				loginName: "",
				shareURL: config.base.promodomain + "m1/niubereg/" + custId
			});
		}

	}



});

/*验证手机号是否存在*/
router.get("/p20150701/getCustByPhone", function(req, res, next) {
	wsclient.getCustByPhone({
		mobile: req.query.mobile
	}, function(wsresult) {
		res.send(wsresult);
	});
});

router.get("/getQrcode", function(req, res, next) {
	var custId = req.query.custId || "";
	var qRUrl = config.base.promodomain + "m1/niubereg/" + custId;

	wsclient.customerQrcode({
		QRUrl: qRUrl,
		color: 0x64AFFF,
		margin: 1
	}, function(wsresult) {
		if (wsresult.success) {
			//将图片返回给页面
			var buffer = new Buffer(wsresult.data, 'base64');
			res.writeHead(200, {
				'Content-Type': 'image/png',
				'Content-Length': buffer.length
			});
			res.end(buffer);

		} else {
			res.send(utils.getFailResult(wsresult.msg));
		}
	});

});

function regRend(req, res, custId) {
	var resobj = {
		loginName: "",
		signature: "",
		timespan: "",
		noncestr: ""
	}
	req.session.sid = req.query.sid ? req.query.sid : "";
	if (custId) {
		wsclient.selectRecomInfoById({
			id: custId
		}, function(wsresult) {
			if (wsresult.success) {
				resobj.custId = custId;
				resobj.loginName = wsresult.data.mobile || wsresult.data.loginName;
				res.render('m1/niubereg', resobj);
			}
		});
	} else {
		resobj.loginName = "";
		resobj.custId = custId;
		res.render('m1/niubereg', resobj);
	}
}

/*牛呗h5注册页面*/
router.get("/niubereg/:custId?", function(req, res, next) {
	var t = new Date("2015-08-31 00:00:00");
	if (new Date().getTime() >= t) {
		res.redirect(config.base.domain);
	}

	regRend(req, res, req.params.custId);
});


/*提交牛呗注册信息*/
router.post('/niuberegister', function(req, res, next) {
	var queryString = (req.headers.referer.split("?")[1]) || '';
	var pswd = req.body.pswd,
		pswdagn = req.body.pswdagn,
		mobile = req.body.mobile,
		//mobile = req.session.mobileCode.pnumber;
		smsCode = req.body.vcode,
		pcode = req.body.inviteCode;
	console.log('牛呗注册H5 sid='+req.session.regSource+'----------------------'+'queryString='+queryString);
	var uinfo = {
		loginPassword: pswd,
		pswdagn: pswdagn,
		recommendCode: pcode, //邀请码
		mobile: mobile, //手机号码
		regType: "3",
		smsCode: smsCode,
		activitySrc: "牛呗欢乐暑期",
		regOs: utils.delectOS(req),
		regDevice: utils.platSource(req),
		loginIp: utils.getClientIp(req),
		regSource: req.session.regSource || "",
		queryString: queryString
	};
	if (req.session.curtime) {
		if (req.session.mobileCode) {
			/*if (mobile != req.session.mobileCode.pnumber) {
				return res.send(utils.getFailResult("手机号前后不一致", "", "", "phonetips"));
			}*/
			if (pswd != pswdagn) {
				return res.send(utils.getFailResult("密码不一致", "", "", "againuserPwdtips"));
			}
			if (utils.isNull(uinfo.loginIp)) {
				logger.info('Invalid login ip : ', uinfo);
				return res.send(utils.getFailResult('异常请求，请联系客服。'));
			}
			wsclient.createCustomer(uinfo, function(wsresult) {
				if (wsresult.success) {
					//创建并保存session
					utils.createSession({
						//loginname: uname,
						//custId: wsresult.data.id,
						mobile: mobile
					}, req, res);
					req.session.mobileCode = null;
					req.session.captcha = null;
					req.session.uservalidphonetime = new Date().getTime();
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

	//"loginPassword":"****","smsCode":"短信验证码","mobile":"手机号码","regOs":"注册设备","loginIp":"ip地址","regType":"3"
	//invoke webservice	
});
/*牛呗注册成功页面*/
router.get('/niubesuc', function(req, res, next) {
	var t = new Date("2015-08-31 00:00:00");
	if (new Date().getTime() >= t) {
		res.redirect(config.base.domain);
	}
	if (!req.session.user) {
		res.redirect("/m1/niubereg");
		return;
	}
	var derectUrl = {
		url: "",
		os: "",
	}
	var url = "";
	if (utils.delectOS(req) == "IOS") {
		derectUrl.url = "https://itunes.apple.com/cn/app/niu-bei/id998444014?mt=8";
		derectUrl.os = "ios"
	} else if (utils.delectOS(req) == "ANDROID") {
		if (req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
			derectUrl.url = "http://android.myapp.com/myapp/detail.htm?apkName=com.niuwa.niubei.android";
			derectUrl.os = "android";
		} else {
			derectUrl.url = "http://www.i-niuwa.com/getfile/niuwaniubei/niubei.apk";
			derectUrl.os = "android";
		}

	} else {
		derectUrl.androidurl = "http://www.i-niuwa.com/getfile/niuwaniubei/niubei.apk";
		derectUrl.iosurl = "https://itunes.apple.com/cn/app/niu-bei/id998444014?mt=8";
		derectUrl.os = "else";
	}
	res.render("m1/niubesuc", derectUrl);
});

/*注册牛呗发送手机号码*/
router.post('/pla/phonegeneratemobilecode', function(req, res, next) {
	var pnumber = req.body.pnumber;
	var icode = req.body.icode || null;
	req.session.uservalidphonetime = req.session.uservalidphonetime || {};
	if (req.session.uservalidphonetime && req.session.uservalidphonetime + 60000 >= new Date().getTime()) {
		res.send(utils.getFailResult("一分钟内只允许发送一次验证码"));
		return;
	}
	if (icode) {
		if (!req.session.captcha.code ) {
			res.send(utils.getFailResult("图形验证码失效，点击重新获取"));
			return;
		}
		if (icode.toLowerCase() != (req.session.captcha.code).toLowerCase() ) {
			res.send(utils.getFailResult("图形验证码不正确"));
			return;
		}
	} else {

	}
	if (req.session.curtime) {
		req.session.curtime = req.session.curtime + 1;
	} else {
		req.session.curtime = 1;
	}
	if (req.session.curtime > 4000) {
		res.send(utils.getFailResult("请联系牛娃金融客服进行人工手机认证"));
		return
	} else {
		var uinfo = {
			mobile: pnumber,
			type: 0
		};
		if (utils.isNull(pnumber)) {
			logger.error('Invalid input parameter : ', uinfo);
			res.send(utils.getFailResult(messages.phoneNoIsNull));
		} else {
			//invoke webservice
			wsclient.niuBeiGenerateMobileCode(uinfo, function(wsresult) {
				if (wsresult.success) {
					//将验证码保存在session中
					var mobileCode = {
						code: wsresult.data,
						pnumber: pnumber,
						time: new Date().getTime()
					}
					req.session.mobileCode = mobileCode;
					req.session.uservalidphonetime = new Date().getTime();
					res.send(utils.getSuccessResult(null, null, wsresult.msg));
				} else {
					res.send(utils.getFailResult(wsresult.msg));
				}
			});
		}
	}
});

/*判断图形验证码是否正确 
var captcha = {
				code: wsresult.data.radomStr,
				time: new Date().getTime()
			}
			req.session.captcha = captcha;
			*/
router.post('/pla/imgVaditionCode', function(req, res, next) {
	var imgcode = req.body.captchacode;
	if (req.session.captcha) {
		if (imgcode.toLowerCase() != (req.session.captcha.code).toLowerCase()) {
			res.send(utils.getFailResult("图片验证码不正确"));
			return;
		}
		res.send(utils.getSuccessResult());

	} else {
		res.send(utils.getFailResult("已失效，请点击图形重新获取"));
		return;
	}
})


module.exports = router;