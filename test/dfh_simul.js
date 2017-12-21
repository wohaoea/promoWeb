require("should");
var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var simul = require("./simulwrapper");


//大富豪用户初使数据
wsclient.dfh_userinfo = function(params, ca) {
	var success = simul.wrapOK;
	success.data = {
		times: 9, //还有多少次
		place: 49 //目前的位置
	};
	ca(success);
};
exports.dfh_userinfo = wsclient.dfh_userinfo;

//大富豪签到
wsclient.dfh_sign = function(params, ca) {
	var success = simul.wrapOK;
	success.data = {
		authCode:0, //0 正常 1:未实名认证 2.未手机认证
		sign:1 //1：签到成功 2：已签到 -1:签到失败
	};
	ca(success);
};
exports.dfh_sign = wsclient.dfh_sign;

//转起来
wsclient.dfh_zhuan = function(params, ca) {
	var success = simul.wrapOK;
	success.data = {
		times:1, //剩余次数
		setp: 6,
		lastplace: 40, //最后步数
		authCode: 0 //0 正常 1:未实名认证 2.未手机认证

	};
	ca(success);
};
exports.dfh_zhuan = wsclient.dfh_zhuan;