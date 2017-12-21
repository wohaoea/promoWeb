var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");
var wxmr = require('../routes/mr.js');
/*获取微信分享参数信息*/
function wxShareInfo(req, res, next) {
	var wxopenid, wxtoken, code, sdjson = {};
	wsclient.WeiXinShare({
		url: req.originalUrl
	}, function(ress) {
		/*		var crypto = require('crypto');
		 var timespan = new Date().getTime();
		 var noncestr = Math.random().toString(36).substr(2);
		 var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=" + (config.base.wxshareurl + req.originalUrl)
		 var shasum = crypto.createHash('sha1');
		 shasum.update(content);*/
		res.locals.wxShareOpt = {};
		res.locals.wxShareOpt.nwwxappid = config.base.wxappid;
		res.locals.wxShareOpt.signature = ress.signature;
		res.locals.wxShareOpt.timespan = ress.timespan;
		res.locals.wxShareOpt.noncestr = ress.noncestr;
		console.log('分享信息-----------------------------' + JSON.stringify(res.locals.wxShareOpt))
		next();
	});
};

/*获取用户信息*/

function getwxInfo(req, res, next) {
	var wxopenid, wxtoken, code, sdjson = {};
	/*res.cookie('wxopenid','oxxnatwdGsKVOHEHgCnku0DyLVOo', {
	 expires: new Date(Date.now() + 24 * 60 * 60 * 60 * 30),
	 path: '/'
	 });
	 req.cookies.wxopenid='oxxnatwdGsKVOHEHgCnku0DyLVOo';*/
	if (req.cookies.wxopenid) {
		wxopenid = req.cookies.wxopenid;
		wxmr.findJSON(req, res, wxopenid, function(obj) {
			/*判断存在cookie 但芒果内未存情况*/
			if (!obj) {
				req.cookies.wxopenid=null;
				var URI = encodeURIComponent(config.base.wxshareurl + req.originalUrl);
				var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.base.wxappid + '&redirect_uri=' + URI + '&response_type=code&scope=snsapi_userinfo&state=niuwap2p#wechat_redirect';
				res.redirect(url);
				return
			}
			wsclient.getWXUserRefreshToken(req,res,obj['refresh_token'], function(result) {
				wsclient.getWXUserInfo(result['access_token'], function(result) {
					res.locals.wxInfo = result;
					console.log('已有openid-----------------------------' + JSON.stringify(res.locals.wxInfo))
					next()
				});
			});
		});
	} else {
		code = req.query.code;
		wsclient.getWXUserToken(code, function(result) {
			var wxtoken = {
				openid: result['openid'],
				access_token: result['access_token'],
				refresh_token: result['refresh_token']
			}
			wxmr.doAdd(req, res, wxtoken, function(obj) {
				/*创建openid  cookie */
				res.cookie('wxopenid', wxtoken['openid'], {
					expires: new Date(Date.now() + 864000000),
					path: '/'
				});
				if (obj.success) {
					wsclient.getWXUserInfo(result['access_token'], function(result) {
						res.locals.wxInfo = result;
						console.log('无openid-----------------------------' + JSON.stringify(res.locals.wxInfo))
						next()
					});
				} else {
					wsclient.getWXUserInfo(result['access_token'], function(result) {
						//result.openid = null;
						res.locals.wxInfo = result;
						console.log('无openid-----------------------------' + JSON.stringify(res.locals.wxInfo))
						next()
					});
				}
			});

		});
	}
}


/*跳转到页面获取 腾讯code **************前期先隐 测试放开*/
router.get(/^\/sdh5\S*$|^\/interest\S*$/, function(req, res, next) {
	/*活动时间*/
	var flag = 0
	if (new Date() > new Date('2016-1-19 00:00:00') || new Date() < new Date('2015-12-18 00:00:00')) {
		res.redirect(config.base.h5domain);
	}

	if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") < 0) {
		var title = {};
		if (/^\/interest\S*$/.test(req.path)) {
			title = {
				title: '和讯牛娃商城纳新',
				weixintip: 'jiaxi'
			}
		} else {
			title = {
				title: '和讯牛娃商城纳新',
				weixintip: 'eggs'
			}
		}
		res.render('m6/wxtip.html', title);
		return
	}

	if (req.cookies.wxopenid) {
		getwxInfo(req, res, next);
		//wxShareInfo(req,res,next);
	} else {
		if (req.query.code && req.query.state) {
			getwxInfo(req, res, next);
		} else {
			var URI = encodeURIComponent(config.base.wxshareurl + req.originalUrl);
			var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.base.wxappid + '&redirect_uri=' + URI + '&response_type=code&scope=snsapi_userinfo&state=niuwap2p#wechat_redirect';
			res.redirect(url);
			return;
		}
	}
});
router.get(/^\/sdh5\S*$|^\/interest\S*$/, function(req, res, next) {
	if (/^\/interest$/.test(req.path)) {
		next();
		return
	}
	wxShareInfo(req, res, next);
});
/*分享页面*/
router.get('/sdh5share/:shareRedId?', function(req, res, next) {
	/*获取用户要分享现金券额度*/
	res.locals.utils = utils;
	res.locals.shareRedId = req.params.shareRedId;
	res.locals.config = config;
	/*	res.locals.dataMoney = '5555.55';
	 res.render('m6/sdh5share', res.locals);
	 return*/
	/*shareRedId,openId,nickName,headPic,sex,province,city,country*/
	if(1==1){
		var info = {
			shareRedId: req.params.shareRedId,
			openId: res.locals.wxInfo.openid,
			nickName: res.locals.wxInfo.nickname,
			headPic: res.locals.wxInfo.headimgurl,
			sex: res.locals.wxInfo.sex,
			province: res.locals.wxInfo.province,
			city: res.locals.wxInfo.city,
			country: res.locals.wxInfo.country
		};

		wsclient.getHXNewCustomShareRedAmount(info, function(wsresult) {
			if (wsresult.success) {
				res.locals.dataMoney = wsresult.data;
				res.render('m8/sdh5share', res.locals);
			} else {
				res.locals.dataMoney = "0";
				res.render('m8/sdh5share', res.locals);
			}
		});
	}else{
		var info = {
			shareRedId: 'dasfdasfdasf',
			openId: 'openId',
			nickName: 'name',
			headPic: 'headPic',
			sex: 'sex',
			province: 'province',
			city: 'city',
			country: 'dasfd'
		};
		res.locals.wxShareOpt = {}
		res.locals.wxShareOpt.signature = 'signature';
		res.locals.wxShareOpt.timespan = 'timespan';
		res.locals.wxShareOpt.noncestr = 'noncestr';

		res.locals.dataMoney = "200";
		res.render('m8/sdh5share', res.locals);
	}


});


/*router.get('/testcookie',function(req,res,next){
 if(req.cookies.openid){
 console.log(req.cookies.openid);
 }else{
 res.cookie('openid', '11112wtetgrgrrrrrrr', { expires: new Date(Date.now() + 24*60*60*60*30),path: '/' });
 }
 res.render('m6/test.html');
 });*/
/*活动用户提示语*/
function tishiyu(randomP) {
	var tishi = ['拆红包的姿势不错哦', '手气好就是那么骄傲', '你是传说中的招财猫吧', '这运气简直逆天', '人品值突破天际了', '土豪我们做朋友吧'];
	random = parseInt(5 * randomP);
	return tishi[random];
}
/*众人领取现金券*/
router.get('/sdh5lq/:shareRedId?', function(req, res, next) {
	res.locals.shareRedId = req.params.shareRedId;
	res.locals.tishiyu = tishiyu;
	res.locals.utils = utils;
	if(1==1){
		var info = {
			shareRedId: req.params.shareRedId,
			openId: res.locals.wxInfo.openid,
			nickName: res.locals.wxInfo.nickname,
			headPic: res.locals.wxInfo.headimgurl,
			sex: res.locals.wxInfo.sex,
			province: res.locals.wxInfo.province,
			city: res.locals.wxInfo.city,
			country: res.locals.wxInfo.country
		}

		/*测试数据*/
		/*var info = {
			shareRedId:'87f90bd1021e4b04b96be88ac124f22c',
			openId:new Date().getTime(),
			nickName:'nickname',
			headPic:'headPic',
			sex:'22',
			province:'province',
			city:'city',
			country:'dasfd',
			tel:req.query.tel,
			ttime:'1450689945952'
		};
		res.locals.wxShareOpt = {}
		res.locals.wxShareOpt.signature = 'signature';
		res.locals.wxShareOpt.timespan = 'timespan';
		res.locals.wxShareOpt.noncestr = 'noncestr';*/
		/*测试数据end*/
		res.locals.info = info;
		wsclient.getHXNewCustomShareRedList(info, function(wsresult) {
			if (wsresult.success) {
				res.locals.wxList = wsresult.data;
				wsclient.getHXNewCustomShareRedShareHead(info, function(wsresult) {
					if (wsresult.success) {
						res.locals.shareperson = wsresult.data;
						res.locals.config = config;
						res.render('m8/sdh5lq', res.locals);
					} else {
						res.redirect(config.base.h5domain)
						//res.locals.wxList = [];
						//res.render('m6/sdh5lq', res.locals);
					}
				});
			} else {
				//res.locals.shareperson = '';
				res.redirect(config.base.h5domain)
			}
		});
	}else{
		var info = {
			shareRedId: 'dasfdasfdasf',
			openId: 'openId',
			nickName: 'name',
			headPic: 'headPic',
			sex: 'sex',
			province: 'province',
			city: 'city',
			country: 'dasfd'
		};
		res.locals.wxShareOpt = {}
		res.locals.wxShareOpt.signature = 'signature';
		res.locals.wxShareOpt.timespan = 'timespan';
		res.locals.wxShareOpt.noncestr = 'noncestr';

		res.locals.info = info;
		res.locals.wxList=[];
		res.locals.shareperson = {};
		res.locals.config = config;
		res.render('m8/sdh5lq', res.locals);

	}
});

/*领取现金券list*/
router.get('/pla/sdh5lqlist', function(req, res, next) {
	wsclient.getHXNewCustomShareRedList(req.query, function(wsresult) {
		if (wsresult.success) {
			res.locals.wxList = wsresult.data;
			res.locals.config = config;
			res.locals.tishiyu = tishiyu;
			res.locals.utils = utils;
			res.render('m8/shareredlist', res.locals);
		} else {
			//res.locals.shareperson = '';
			res.redirect(config.base.h5domain)
		}
	});
});

/*输入手机领取红包*/
function getEndTime(data) {
	var bimonth = ((parseInt(new Date(data).getMonth()) + 2) < 10) ? ('0' + (parseInt(new Date(data).getMonth()) + 2)) : (parseInt(new Date(data).getMonth()) + 2);
	var birday = (parseInt(new Date(data).getDate()) < 10) ? ('0' + parseInt(new Date(data).getDate())) : (parseInt(new Date(data).getDate()));;
	if (parseInt(new Date(data).getMonth()) + 1 == 12) {
		return (parseInt(new Date(data).getFullYear()) + 1) + '-' + '01' + '-' + birday;
	}
	return new Date(data).getFullYear() + '-' + bimonth + '-' + birday;
}

router.get('/pla/getjxq', function(req, res, next) {
	if (req.query.tel == '') {
		res.send({
			success: false,
			msg: '请输入手机号'
		})
		return
	}
	if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(req.query.tel)) {
		res.send({
			success: false,
			msg: '请输入有效手机号码'
		})
		return
	}

	/*测试数据begin*/

	/*req.query={
		shareRedId:'87f90bd1021e4b04b96be88ac124f22c',
			openId:new Date().getTime(),
		nickName:'nickname',
		headPic:'headPic',
		sex:'22',
		province:'province',
		city:'city',
		country:'dasfd',
		tel:req.query.tel,
		ttime:'1450689945952'
	}*/
	/*测试数据end*/
	wsclient.getHXNewCustomShareRedResult(req.query, function(wsresult) {
		if (wsresult.success) {
			if (wsresult.data == '-1') {
				res.send({
					success: false,
					msg: '该手机号已抢过红包'
				})
				return
			}
			if (wsresult.data == '-2') {
				res.send({
					success: false,
					msg: '红包已领完'
				})
				return
			}
			if (wsresult.data == '-3') {
				res.send({
					success: false,
					msg: '网络繁忙，重新领取'
				})
				return
			}
			res.send({
				success: true,
				amount: wsresult.data.amount,
				telVali: wsresult.data.telVali,
				endtime: (wsresult.data.overTime).split(' ')[0],
				domh5: config.base.h5domain
			});
		} else {
			res.send({
				success: false,
				msg: '网络繁忙，重新领取'
			})
		}
	});

	/*res.send({
		success: true,
		amount: 10,
		telVali: '13876877665',
		endtime: '2016-09-22',
		domh5: config.base.h5domain
	});*/

});

function getTime(y, m, d) {
	var myDate = new Date();
	myDate.setHours(0);
	myDate.setMinutes(0);
	myDate.setSeconds(0);
	myDate.setFullYear(y, m - 1, d);
	return myDate;
}

function checkDate() {
	return getTime(2015, 12, 17) < new Date() && getTime(2016, 1, 19) > new Date();
}

router.get("/smashingeggs", function(req, res, next) {
	//req.session.lastURL = "/smashingeggs";
	if (!checkDate()) return res.redirect(config.base.domain);
	if (!req.session.user) {
		return res.render("m6/smashingeggs", {
			user: null,
			domain: config.base.domain,
			promodomain: config.base.promodomain,
			_custId: "",
			_g_surplus: 0,
			_s_surplus: 0,
			_g_exchange: 0,
			_s_exchange: 0,
			_shareId: ""
		});
	}
	wsclient.smashingeggs_get_eggs_info({
		custId: req.session.user.custId
	}, function(wsresult) {
		// console.log(wsresult);
		if (!wsresult) wsresult = {};
		if (!wsresult.success) wsresult = {};
		/*map value from backend to*/
		if (wsresult.data) {
			wsresult = wsresult.data;
			if (wsresult.eggs && wsresult.eggs.length > 0) {
				for (var index in wsresult.eggs) {
					var egg = wsresult.eggs[index];
					if (egg.eggType == "1") {
						wsresult.golden_surplus = egg.counts;
					} else if (egg.eggType == "2") {
						wsresult.silver_surplus = egg.counts;
					}
				}
			}
		}
		wsresult.golden_exchange = wsresult.redCount;
		wsresult.silver_exchange = wsresult.redAmount;
		wsresult.shareId = wsresult.shareRedId;
		/**/
		res.render("m6/smashingeggs", {
			user: req.session.user,
			domain: config.base.domain,
			promodomain: config.base.promodomain,
			_custId: req.session.user.custId,
			_g_surplus: wsresult.golden_surplus || 0,
			_s_surplus: wsresult.silver_surplus || 0,
			_g_exchange: wsresult.golden_exchange || 0,
			_s_exchange: wsresult.silver_exchange || 0,
			_shareId: wsresult.shareId || ""
		});
	});
});

router.get("/smashingeggs_smashing_eggs/:type", function(req, res, next) {
	req.session.lastURL = "/smashingeggs";
	if (!checkDate()) return res.send(utils.getFailResult("-1", "", "timeout"));
	if (!req.session.user) {
		req.session.lastURL = "/smashingeggs";
		return res.send(utils.getFailResult("-1", "", "notlogin"));
	}
	wsclient.smashingeggs_smashing_eggs({
		custId: req.session.user.custId,
		type: req.params.type
	}, function(wsresult) {
		// console.log(wsresult);
		res.send(wsresult);
	});
});

router.get("/getQRCode/:id", function(req, res, next) {
	req.session.lastURL = "/smashingeggs";
	if (!checkDate()) return res.send(utils.getFailResult("-1", "", "timeout"));
	var id = req.params.id || "";
	var qRUrl = config.base.wxshareurl + "/m6/sdh5share/" + id;
	// console.log(qRUrl);
	wsclient.customerQrcode({
		QRUrl: qRUrl,
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

/*众人帮加息首页*/
router.get('/interest', function(req, res, next) {
	res.locals.userInfo = req.session.user;
	res.locals.utils = utils;
	res.locals.config = config;
	if (!(res.locals.userInfo)) {
		//res.send('{a111111}')
		res.render('m6/interest.html', res.locals);

	} else {
		wsclient.getInvestPeopleHelpList({
			custId: (res.locals.userInfo.custId).toString()
		}, function(wsresult) {
			if (wsresult.success) {
				res.locals.investList = wsresult.data;
				res.render('m6/interest.html', res.locals);
			} else {
				res.locals.investListflag = '1';
				res.locals.investList = [];
				res.render('m6/interest.html', res.locals);
			}
		});
	}


});
/*众人帮加息投资懒牛计划 投资者分享页面*/
router.get('/interestshare/:recordNo?', function(req, res, next) {
	res.locals.userInfo = req.session.user;
	var recordNo = req.params.recordNo;

	if (!res.locals.userInfo || typeof(recordNo) == 'undefined') {
		res.redirect('/m6/interest');
		return
	}
	res.locals.recordNo = req.params.recordNo;
	res.locals.tishiyu = tishiyu;
	res.locals.config = config;
	res.locals.utils = utils;
	var info = {
		recordNo: req.params.recordNo,
		openId: res.locals.wxInfo.openid,
		nickName: res.locals.wxInfo.nickname,
		headPic: res.locals.wxInfo.headimgurl,
		sex: res.locals.wxInfo.sex,
		province: res.locals.wxInfo.province,
		city: res.locals.wxInfo.city,
		country: res.locals.wxInfo.country,
		page: 1,
		rows: 5
	}
	res.locals.info = info;
	res.locals.tishiyu = tishiyu;
	wsclient.setWechatInfo(info, function(wsresult) {
		if (wsresult.success) {
			wsclient.getInvestRecordDetail(info, function(wsresult) {
				if (wsresult.success) {
					res.locals.investRecordDetail = wsresult.data
					wsclient.getPeopleHelpDetails(info, function(wsresult) {
						if (wsresult.success) {
							res.locals.peopleHelpDetails = wsresult.data
							res.render('m6/interestshare.html', res.locals)
						} else {

						}
					})
				}
			})
		}
	})
});

/*众人帮加息列表页面*/
router.get('/pla/interestshare/:recordNo?', function(req, res, next) {
	var page = req.query.page;
	res.locals.tishiyu = tishiyu;
	res.locals.utils = utils;
	if (typeof(page) == 'undefined') {
		res.send({
			url: '/m6/interest',
			success: false,
			data: 4
		})
	}
	var info = {
		recordNo: req.params.recordNo,
		page: page,
		rows: 20
	}

	wsclient.getPeopleHelpDetails(info, function(wsresult) {
		if (wsresult.success) {
			res.locals.peopleHelpDetails = wsresult.data
			res.render('m6/interestlist.html', res.locals)
		} else {

		}
	});
});

/*众人帮访问者页面*/
router.get('/interesthelp/:recordNo?', function(req, res, next) {
	var user = req.session.user;
	if (req.session.user) {
		res.locals.myinfo = req.session.user;
	} else {
		res.locals.myinfo = {};
	}
	var recordNo = req.params.recordNo;

	if (typeof(recordNo) == 'undefined') {
		res.redirect('/m6/interest');
		return
	}
	res.locals.recordNo = req.params.recordNo;
	res.locals.tishiyu = tishiyu;
	res.locals.utils = utils;
	res.locals.config = config;
	var info = {
		recordNo: req.params.recordNo,
		openId: res.locals.wxInfo.openid,
		nickName: res.locals.wxInfo.nickname,
		headPic: res.locals.wxInfo.headimgurl,
		sex: res.locals.wxInfo.sex,
		province: res.locals.wxInfo.province,
		city: res.locals.wxInfo.city,
		country: res.locals.wxInfo.country,
		page: 1,
		rows: 5
	}
	res.locals.info = info;
	wsclient.getInvestRecordDetail(info, function(wsresult) {
		if (wsresult.success) {
			res.locals.investRecordDetail = wsresult.data
			wsclient.getPeopleHelpDetails(info, function(wsresult) {
				if (wsresult.success) {
					res.locals.peopleHelpDetails = wsresult.data
					res.render('m6/interesthelp.html', res.locals)
				} else {

				}
			})
		}
	})
});

/*提交帮助加息*/
router.get('/pla/jxhelp/:recordNo?', function(req, res, next) {
	req.query.recordNo = req.params.recordNo;
	wsclient.helpOtherAddRate(req.query, function(wsresult) {
		if (wsresult.success) {
			res.send({
				success: true,
				data: wsresult.data
			});
		} else {
			res.send({
				success: false,
				msg: '服务器繁忙，请稍后再试'
			});
		}
	});
});

/*计息领红包*/
router.get('/pla/jxlhb/:recordNo?', function(req, res, next) {
	req.query.recordNo = req.params.recordNo;
	wsclient.getRedEnvelope(req.query, function(wsresult) {
		if (wsresult.success) {
			if (wsresult.data.isSuccess) {
				res.send({
					success: true,
					data: wsresult.data,
					endtime: wsresult.data.overTime,
					domh5: config.base.h5domain
				});
			} else {
				if (wsresult.data.isExist) {
					res.send({
						success: false,
						msg: '该手机号已领取红包'
					});
				} else {
					res.send({
						success: false,
						msg: '网络繁忙，重新领取'
					});
				}

			}
		} else {
			res.send({
				success: false,
				msg: '网络繁忙，重新领取'
			});
		}
	});
});

//结束获取加息值
router.get('/pla/hqjxz/:recordNo?', function(req, res, next) {
	var info = {
		recordNo: req.params.recordNo
	}
	wsclient.updatePeopleHelpStatues(info, function(wsresult) {
		if (wsresult.success) {
			res.send({
				success: true,
				data: wsresult.data
			});
		} else {
			res.send({
				success: false,
				msg: '网络繁忙，重新领取'
			});
		}
	});
});

/*获取基本信息*/
router.get('/pla/getInvestRecordDetail/:recordNo?', function(req, res, next) {
	req.query.recordNo = req.params.recordNo;
	wsclient.getInvestRecordDetail(req.query, function(wsresult) {
		if (wsresult.success) {
			if (typeof(wsresult.data.addRate) == 'undefined') {
				res.send({
					success: true,
					addRate: 0
				});
				return
			}
			//res.locals.addrate = wsresult.data.addRate
			if (wsresult.data.addRate == '1') {
				wsclient.updatePeopleHelpStatues({
					recordNo: req.params.recordNo
				}, function(wsresult) {
					res.send({
						success: true,
						addRate: 1
					});
				});
			} else {
				res.send({
					success: true,
					addRate: wsresult.data.addRate
				})
			}

		} else {
			res.send({
				success: true,
				addRate: 0
			})
		}
	});
});

module.exports = router;