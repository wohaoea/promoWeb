var express = require('express');
var utils = require('../common/utils');
var config = require('../config');
var router = express.Router();
var path = require('path');
var wsclient = require('../common/wsclient');
var async = require("async");




//用户注册
exports.userReg = function(req, callback) {
	if (!utils.vaildPhone(req.body.userphone) ||
		!utils.isNotNull(req.body.userpwd)) {
		return callback({
			msg: "数据验证失败"
		}, null);
	}
	(function () {
		if ((req.body.hasimg==true||req.body.hasimg=='true')&&(req.session.captcha == null || req.body.icode == null || req.session.captcha.code.toLowerCase() != req.body.icode.toLowerCase())) {
			return callback({msg:"图片验证码有误"},null);
		}
		wsclient.verificationCode({
			"smsCode": req.body.vaildcode,
			"mobile": req.body.userphone
		}, function (result,err) {
			if (!result.success) {
				callback({msg:"短信验证码有误"}, null);
				return;
			}
			var tmpIp = utils.getClientIp(req);
			if(tmpIp.indexOf("::ffff:")!=-1){
				tmpIp = tmpIp.split("::ffff:")[1];
			}
			var params = {
				loginPassword: req.body.userpwd,
				mobile: req.body.userphone, //手机号码
				regType: "4",
				regOs: utils.delectOS(req),
				regDevice: utils.platSource(req),
				belongPlatform: "P2P",
				loginIp: tmpIp,
				regSource: req.session.regSource || "",
				queryString: req.session.queryString||""
			};
			wsclient.userReg(params, function (results,err) {
				callback(results,err);
			}); //如果验证码正确则
		});
	})();
	// async.waterfall([
	// 		function(acb) {
	// 			wsclient.verificationCode({
	// 				"smsCode": req.body.vaildcode,
	// 				"mobile": req.body.userphone
	// 			}, acb);
	// 		},
	// 		function(result, acb) {
	// 			if (req.body.hasimg&&(req.session.captcha == null || req.body.icode == null || req.session.captcha.code.toLowerCase() != req.body.icode.toLowerCase())) {
	// 				return res.send(utils.getFailResult("图形验证码不正确", "", "", "icode"));
	// 			}
	// 			if (!result.success) {
	// 				return acb({msg:"验证码不正确,请重新输入"}, null);
	// 			}
	// 			var params = {
	// 				loginPassword: req.body.userpwd,
	// 				mobile: req.body.userphone, //手机号码
	// 				regType: "4",
	// 				regOs: utils.delectOS(req),
	// 				regDevice: utils.platSource(req),
	// 				belongPlatform: "P2P",
	// 				loginIp: utils.getClientIp(req),
	// 				regSource: req.session.regSource || "",
	// 				queryString: req.session.queryString||""
	// 			};
	// 			wsclient.userReg(params, acb); //如果验证码正确则
	// 		}
	// 	],
	// 	function(err, results) {
	// 		callback(err, results);
	// 	});


};

/*
1.验证手机号码是否已注册
2.若未注册则发送验证码
*/
exports.senduserRegVaildCode = function(req, recallback) {
	if (!utils.vaildPhone(req.body.phone)) {
		return recallback({
			msg: "数据验证失败"
		}, null);
	};
	var phone = req.body.phone;
	(function () {
		var params = {
			pnumber: phone,
			ptype: "mcode"
		};
		wsclient.checkBindPhoneNo(params, function (result,err) {
			if (!result.success) {
				result.type="conflict";
				recallback(result, null);
				return;
			}

			var params = {
				ptype: "mcode",
				pnumber: phone,
				actType: 2
			};
			wsclient.sendRegVaildNo(params, function (results,err) {
				results.data = null;
				recallback(results, err);
			});
		});
	})()

	// async.waterfall([
	// 		function(cb) {
	// 			var params = {
	// 				pnumber: phone,
	// 				ptype: "mcode"
	// 			};
	// 			wsclient.checkBindPhoneNo(params, cb);
	// 		},
	// 		function(result, cb) {
	// 			console.log("--------------",result)
	// 			if (!result.success) {
	// 				return cb(result, null);
	// 			}
    //
	// 			var params = {
	// 				ptype: "mcode",
	// 				pnumber: phone,
	// 				actType: 2
	// 			};
	// 			wsclient.sendRegVaildNo(params, cb);
	// 		}
	// 	],
	// 	function(err, results) {
	// 		console.log(err,results)
	// 		recallback(err, results);
	// 	});

};
