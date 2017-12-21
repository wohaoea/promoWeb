/**
 * Created by Administrator on 2016/10/14.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var wsclient = require('../common/wsclient');

//通信认证
router.get("/communication", function(req, res, next) {//20180404120444f3f2109c2caa48fea7a08399f34cdca3
	var token = req.query.sign
	wsclient.findOneBySign({
		"head": {
			"sign": token
		},
		"con": {

		}
	}, function(json) {
		if(json.head && json.head.st == '0') {
			req.session.userinfo = json.body;
			tianjiAuth(req, res, next);
		}else{
			res.send((json.head||{}).msg||"请求异常");
		}
	})
});

// 聚信立通讯认证
function JxlAuth(req, res, next) {
	var userinfo = req.session.userinfo;
	if(!userinfo.custId) {
		res.redirect("/infoclt/index");
		return;
	}
	var tongxinVar = {
		'title': '通讯认证',
		'link': '联系客服'
	};

	tongxinVar.phone = userinfo.mobile.substr(0, 3) + '*****' + userinfo.mobile.substr(8);
	wsclient.findJxlAuth({
		CUST_ID: userinfo.custId,
	}, function(result) {
		if(result.success) {
			req.session.userinfo.mobileOperator = result.data.mobileOperator;
			if(result.data.jxlMobileAuthStatus == 'AS') {
				return res.redirect('/infoclt/communication/tongxinSuccess');
			} else {
				tongxinVar.result = result
				res.render("infoclt/tongxin_identification", oJson);
			}
		}

	})
}

// 天机通讯认证
function tianjiAuth(req, res, next) {
	var userinfo = req.session.userinfo;
	if(!userinfo.custId) {
		res.redirect("/infoclt/index");
		return;
	}
	var tongxinVar = {
		'title': '通讯认证',
		'link': '联系客服',
		// result:{
		// 	data:{
		// 		tianjiH5Url: config.base.domain + "infoclt/communication/tongxinSuccess"
		// 	}
		// }
	};
	// res.render("infoclt/tianji/index",tongxinVar);
	wsclient.tianjiAddr({
		CUST_ID: userinfo.custId,
		REDIRECT_URL: config.base.promodomain + "communication/tongxinSuccess"
	}, function(result) {
		if(result.success) {
			tongxinVar.result = result
			if(!!result.data.tianjiH5Url){
				res.redirect(result.data.tianjiH5Url);
			}else{
				res.send("访问出错");
			}
		}else{
			res.send(result.msg);
		}
	})
}

/**通信认证成功*/
router.get("/communication/tongxinSuccess", function(req, res, next) {
	tianjiCallback(req, res, next)
});

// 聚信立通信认证成功
function jxlCallback(req, res, next) {
	var userinfo = req.session.userinfo;
	if(!userinfo.custId) {
		res.redirect("/infoclt/index");
		return;
	}
	var tongxinVar = {
		'title': '通信认证',
		'link': '联系客服'
	};
	var phone_test = userinfo.mobile;
	var phone_pwd_length = '';
	for(var i = 0; i < userinfo.count_pwd_length; i++) {
		phone_pwd_length = phone_pwd_length + '*'
	}
	tongxinVar.phone_pwd_length = phone_pwd_length;
	tongxinVar.phone = phone_test.substr(0, 3) + '*****' + phone_test.substr(8);
	wsclient.findJxlAuth({
		CUST_ID: userinfo.custId,
	}, function(result) {
		if(result.success) {
			tongxinVar.result = result;
			var oJson = utils.addNextUrl(req, tongxinVar, "tongxinSuccess")
			res.render("infoclt/tongxin_identification_success", oJson);
		}

	})
}

// 天机通信认证成功
function tianjiCallback(req, res, next) {
	var userinfo = req.session.userinfo;
	var query = req.query;
	var tongxinVar = {
		'title': '通信认证',
		'link': '联系客服'
	};
	switch (query.state){
		case 'report': tongxinVar.state = "1"; break;
		case 'crawl': tongxinVar.state = "1";  break;
		case 'login': tongxinVar.state = "1"; break;
		case 'init': tongxinVar.state = "0";  break;
		case 'login_fail': tongxinVar.state = "0"; break;
		case 'crawl_fail': tongxinVar.state = "0"; break;
		case 'report_fail': tongxinVar.state = "0"; break;
		default : tongxinVar.state = "0"; break;
	}
	// wsclient.tianjiH5Response(query,function (json) {
	// 	if(json.authStatus=="AS"){
    //
	// 	}
	// })
	res.render("communication/tianji/h5callback", tongxinVar);
}

router.post('/communication/jxlMobileAuth', function(req, res) {

	var userinfo = req.session.userinfo;
	req.session.userinfo.count_pwd_length = req.body.password.length
	wsclient.jxlMobileAuth({
		CUST_ID: userinfo.custId,
		password: req.body.password,
		smsCode: req.body.smsCode,
		type: req.body.type,
		resendSmsCode: req.body.resendSmsCode,
		mod: 'H5'
	}, function(result) {

		res.send(result)
	})
})

router.post('/communication/jxlRestMobilePwd', function(req, res) {

	var userinfo = req.session.userinfo;
	wsclient.jxlRestMobilePwd({
		CUST_ID: userinfo.custId,
		password: req.body.password,
		smsCode: req.body.smsCode,
		type: req.body.type,
		resendSmsCode: req.body.resendSmsCode,
		mod: 'H5'
	}, function(result) {
		res.send(result)
	})
})

//重置服务密码提示信息
router.get("/communication/restInfo", function(req, res, next) {
	var restVar = {
		'title': '重置服务密码',
		'link': ''
	};

	res.render("infoclt/restpassword_info", restVar);
});
//重置服务密码
router.get("/communication/restPwd", function(req, res, next) {
	var userinfo = req.session.userinfo;

	if(!userinfo.custId) {
		res.redirect("/infoclt/index");
		return;
	}
	var mobile = userinfo.mobile.substr(0, 3) + '*****' + userinfo.mobile.substr(8);
	var mobileOperator = userinfo.mobileOperator
	var tongxinVar = {
		'title': '重置服务密码',
		'link': '查看帮助',
		'mobile': mobile,
		'mobileOperator': mobileOperator
	};
	tongxinVar.phone = userinfo.mobile.substr(0, 3) + '*****' + userinfo.mobile.substr(8);

	res.render("infoclt/restPwd", tongxinVar);
});

router.get("/communication/temp", function (req, res, next) {
	res.render("infoclt/tianji/temp", {})
})
module.exports = router;