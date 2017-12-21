var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

function validation(res, phone, name, email) {
	if (phone.length != 11) {
		res.send(
			utils.getFailResult('手机号必须为11位')
		);
		return false
	}
	if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(phone)) {
		res.send(
			utils.getFailResult('请输入您的有效手机号')
		);
		return false
	}
	if (!/^\s*[\u4e00-\u9fa5]{1,}[\u4e00-\u9fa5.·]{0,15}[\u4e00-\u9fa5]{1,}\s*$/.test(name)) {
		res.send(
			utils.getFailResult('真实姓名应为2~8个汉字')
		);
		return false
	}
	if (!/^[0-9a-z][_.0-9a-z-]{0,31}@([0-9a-z][0-9a-z-]{0,30}[0-9a-z]\.){1,4}[a-z]{2,4}$/.test(email.toLowerCase())) {
		res.send(
			utils.getFailResult('邮箱地址格式错误')
		);
		return false
	}
}

router.all("/", function(req, res, next) {
	utils.gameTime('2015-10-20','2015-11-30',res);
	var page = req.query.page || 1;
	if (req.query.app) {
		var app = req.query.app;
	} else {
		var app = req.session.app;
	}

	if (req.session.ceopcode) {

	} else {
		req.session.ceopcode = req.query.ceopcode || null //获取分享用户id
	}
	var result = {};
	wsclient.wceolist({
		rows: 10,
		page: page
	}, function(wsresult) {
		if (wsresult.success) {
			var totalpageSize = Math.ceil(wsresult.data.total / 10) //总页数
			var ceolist = wsresult.data.listData;
			var total = wsresult.data.total;
			var lastpage = (page == totalpageSize) ? true : false
			result = {
				totalpageSize: totalpageSize,
				ceolist: ceolist,
				total: total,
				lastpage: lastpage,
				h5domain: config.base.h5domain,
				dom: config.base.domain,
				promodomain: config.base.promodomain
			}
			if (app == '1') {
				result.app = 1;
			} else {
				result.app = 2;
			}
			req.session.app = result.app;
		}
		if (req.session.ceopcode) {
			wsclient.selectRecomInfoById({
				id: req.session.ceopcode
			}, function(wsresult) {
				if (wsresult.success) {
					req.session.ploginName = wsresult.data.loginName;
				}
				wsclient.WeiXinjsapi_ticket(function(ress) {
					var crypto = require('crypto');
					var timespan = new Date().getTime();
					var noncestr = Math.random().toString(36).substr(2);
					var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.originalUrl
					var shasum = crypto.createHash('sha1');
					shasum.update(content);
					result.signature = shasum.digest('hex');
					result.timespan = timespan;
					result.noncestr = noncestr;
					console.log('signature=' + result.signature + "===========" + 'timespan=' + result.timespan + "===========")
					console.log('noncestr=' + result.noncestr + "===========")
					if (req.session.user) {
						result.cusid = req.session.user.custId;
					} else {
						result.cusid = req.session.ceopcode;
					}
					if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
						result.iswxOS = true
					} else {
						result.iswxOS = false
					}
					return res.render("ceo/index", result);
				});
			});
		} else {
			wsclient.WeiXinjsapi_ticket(function(ress) {
				var crypto = require('crypto');
				var timespan = new Date().getTime();
				var noncestr = Math.random().toString(36).substr(2);
				var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.originalUrl
				var shasum = crypto.createHash('sha1');
				shasum.update(content);
				result.signature = shasum.digest('hex');
				result.timespan = timespan;
				result.noncestr = noncestr;
				console.log('signature=' + result.signature + "===========" + 'timespan=' + result.timespan + "===========")
				console.log('noncestr=' + result.noncestr + "===========")
				if (req.session.user) {
					result.cusid = req.session.user.custId;
				} else {
					result.cusid = req.session.ceopcode;
				}
				if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
					result.iswxOS = true
				} else {
					result.iswxOS = false
				}
				return res.render("ceo/index", result);
			});
		}

	})
});
/*手机验证*/
router.get("/vphone", function(req, res, next) {
	var id = req.query.id;
	var obj = {
		id: id
	}
	if (req.session.app == 1) {
		obj.app = 1;
	} else {
		obj.app = 2;
	}
	return res.render("ceo/vphone", obj);
});
/*提交验证信息*/
router.get("/pla/vphone", function(req, res, next) {
	var id = req.query.id;
	var tel = req.query.tel;
	var obj = {
		id: id,
		tel: tel
	}
	wsclient.wvote(obj, function(wsresult) {
		return res.send(wsresult);
	});
});

/*注册*/
router.get("/ceoreg", function(req, res, next) {
	utils.gameTime('2015-10-20','2015-11-30',res);
	var obj = {
		tel: req.query.tel
	}
	if (req.session.app == 1) {
		obj.app = 1;
	} else {
		obj.app = 2;
	}
	return res.render("ceo/ceoreg", obj);
});
/*说明*/
router.get("/referral", function(req, res, next) {
	utils.gameTime('2015-10-20','2015-11-30',res);
	if (req.session.ceopcode) {

	} else {
		req.session.ceopcode = req.query.ceopcode || null //获取分享用户id
	}

	var result = {
		h5domain: config.base.h5domain,
		dom: config.base.domain,
		promodomain: config.base.promodomain
	}
	if (req.session.app == 1) {
		result.app = 1;
	} else {
		result.app = 2;
	}
	if (req.session.ceopcode) {
		wsclient.selectRecomInfoById({
			id: req.session.ceopcode
		}, function(wsresult) {
			if (wsresult.success) {
				req.session.ploginName = wsresult.data.loginName;
			}
			wsclient.WeiXinjsapi_ticket(function(ress) {
				var crypto = require('crypto');
				var timespan = new Date().getTime();
				var noncestr = Math.random().toString(36).substr(2);
				var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.originalUrl
				var shasum = crypto.createHash('sha1');
				shasum.update(content);
				result.signature = shasum.digest('hex');
				result.timespan = timespan;
				result.noncestr = noncestr;
				if (req.session.user) {
					result.cusid = req.session.user.custId;
				} else {
					result.cusid = req.session.ceopcode;
				}
				if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
					result.iswxOS = true
				} else {
					result.iswxOS = false
				}
				return res.render("ceo/referral", result);
			});
		});
	} else {
		wsclient.WeiXinjsapi_ticket(function(ress) {
			var crypto = require('crypto');
			var timespan = new Date().getTime();
			var noncestr = Math.random().toString(36).substr(2);
			var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.originalUrl
			var shasum = crypto.createHash('sha1');
			shasum.update(content);
			result.signature = shasum.digest('hex');
			result.timespan = timespan;
			result.noncestr = noncestr;
			if (req.session.user) {
				result.cusid = req.session.user.custId;
			} else {
				result.cusid = req.session.ceopcode;
			}
			if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
				result.iswxOS = true
			} else {
				result.iswxOS = false
			}
			return res.render("ceo/referral", result);
		});
	}
});
/*参加*/
router.get("/ceoapply", function(req, res, next) {
	utils.gameTime('2015-10-20','2015-11-30',res);
	if (req.session.ceopcode) {} else {
		req.session.ceopcode = req.query.ceopcode || null //获取分享用户id
	}
	var result = {
		h5domain: config.base.h5domain,
		dom: config.base.domain,
		promodomain: config.base.promodomain
	}
	if (req.session.app == 1) {
		result.app = 1;
	} else {
		result.app = 2;
	}
	if (req.session.ceopcode) {
		wsclient.selectRecomInfoById({
			id: req.session.ceopcode
		}, function(wsresult) {
			if (wsresult.success) {
				req.session.ploginName = wsresult.data.loginName;
			}
			wsclient.WeiXinjsapi_ticket(function(ress) {
				var crypto = require('crypto');
				var timespan = new Date().getTime();
				var noncestr = Math.random().toString(36).substr(2);
				var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.originalUrl
				var shasum = crypto.createHash('sha1');
				shasum.update(content);
				result.signature = shasum.digest('hex');
				result.timespan = timespan;
				result.noncestr = noncestr;
				if (req.session.user) {
					result.cusid = req.session.user.custId;
				} else {
					result.cusid = req.session.ceopcode;
				}
				if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
					result.iswxOS = true
				} else {
					result.iswxOS = false
				}
				return res.render("ceo/ceoapply", result);
			});
		});
	} else {
		wsclient.WeiXinjsapi_ticket(function(ress) {
			var crypto = require('crypto');
			var timespan = new Date().getTime();
			var noncestr = Math.random().toString(36).substr(2);
			var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.originalUrl
			var shasum = crypto.createHash('sha1');
			shasum.update(content);
			result.signature = shasum.digest('hex');
			result.timespan = timespan;
			result.noncestr = noncestr;
			if (req.session.user) {
				result.cusid = req.session.user.custId;
			} else {
				result.cusid = req.session.ceopcode;
			}
			if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
				result.iswxOS = true
			} else {
				result.iswxOS = false
			}
			return res.render("ceo/ceoapply", result);
		});
	}
});

/*提交参与信息*/
router.get("/pla/ceoapply", function(req, res, next) {
	validation(res, req.query.phone, req.query.name, req.query.email);
	wsclient.wceoreg({
			name: req.query.name,
			email: req.query.email,
			tel: req.query.phone
		}, function(wsresult) {
			res.send(wsresult);
			return
		})
		//return res.render("ceo/ceoapply");
});
/*投票*/
router.get("/pla/vote", function(req, res, next) {

});
/*投票列表页*/
router.get("/pla/datelist", function(req, res, next) {
	var rows = 10;
	var page = req.query.page || 1;
	var result = {};
	wsclient.wceolist({
		rows: 10,
		page: page
	}, function(wsresult) {
		if (wsresult.success) {
			var totalpageSize = Math.ceil(wsresult.data.total / 10) //总页数
			var ceolist = wsresult.data.listData;
			var total = wsresult.data.total;
			var lastpage = (page == totalpageSize) ? true : false
			result = {
				totalpageSize: totalpageSize,
				ceolist: ceolist,
				total: total,
				lastpage: lastpage
			}
		}
		res.render('ceo/ceolist', result)
	});
});
module.exports = router;