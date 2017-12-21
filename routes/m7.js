var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var _ = require("underscore");
var logger = require("../common/logger");
var huixiangshenghuoUrl = "/m7/huixiangshenghuo";
var cms_hxsh_banner_path = 'images/catalog/huixiangshenghuo_banner.json';
var test_json_path = "";
var channels = {
	"CHANNEL_FOOD": 1,
	"CHANNEL_LIFE": 2,
	"CHANNEL_RECREATION": 3,
	"CHANNEL_CAR": 4
}
var product = true;
if (!product) {
	test_json_path = "/home/guimaodai/disk2/workspace/niuwap2p/json/";
}

function renderHXSH(req, res, msg) {
	/*取福袋session*/
	var fudai = req.session.fudai;
	var guoqing = req.session.guoqing;
	utils.cmsReadFile(config.base.cmsFilePath + cms_hxsh_banner_path, function(bannerJson) {
		if (bannerJson) {
			for (var key in bannerJson) {
				if (bannerJson[key] && bannerJson[key].imageURL === "") delete bannerJson[key];
			}
		}
		if (!product) {
			utils.cmsReadFile(test_json_path + "shoplist.json", function(result) {
				return res.render("m7/huixiangshenghuo", {
					user: req.session.user || null,
					domain: config.base.domain,
					promodomain: config.base.promodomain,
					_custId: req.session.user ? req.session.user.custId : "",
					banner: bannerJson,
					shoplist: result.data,
					originalUrl: encodeURIComponent(config.base.promodomain + (req.originalUrl).substring(1)),
					pageResult: res.locals.pageResult,
					utils: utils,
					config: config,
					fudai: fudai,
					guoqing:guoqing,
					
				});
			});
		} else {
			wsclient.getCommerceActivityListForHome({}, function(result) {
				console.log(result);
				return res.render("m7/huixiangshenghuo", {
					user: req.session.user || null,
					domain: config.base.domain,
					promodomain: config.base.promodomain,
					_custId: req.session.user ? req.session.user.custId : "",
					banner: bannerJson,
					shoplist: result.data,
					originalUrl: encodeURIComponent(config.base.promodomain + (req.originalUrl).substring(1)),
					pageResult: res.locals.pageResult,
					utils: utils,
					config: config,
					fudai: fudai,
					guoqing:guoqing,
					
				});
			});
		}
	});
}

function getGridData(info, req, res, filepath) {
	if (!product) {
		var result = {
			"success": true,
			"msg": "成功",
			"data": {
				"total": 30,
				"page": 1,
				"listData": [{
					"id": 111,
					"commerceCode": "commercecode011",
					"channel": "CHANNEL_RECREATION",
					"commerceName": "字体变小一点最多能够容纳纳纳纳",
					"commerceLogo": "logo",
					"activityTitle": "title11",
					"activityType": "LINK",
					"status": "RELEASED",
					"orderNo": 111,
					"endTime": "2016-01-15 00:00:00",
					"giftDesc": "字体变小一点最多能够容纳纳",
					"picLink": "",
					"createTime": "2016-01-15 17:02:00",
					"updateTime": "2016-01-15 17:02:00",
					"creator": "jsj",
					"updateUser": "jsj",
					"delFlag": "N"
				}, {
					"id": 111,
					"commerceCode": "commercecode011",
					"channel": "CHANNEL_RECREATION",
					"commerceName": "commerceName11",
					"commerceLogo": "logo",
					"activityTitle": "title11",
					"activityType": "LINK",
					"status": "RELEASED",
					"orderNo": 111,
					"endTime": "2016-01-15 00:00:00",
					"giftDesc": "mmerceName11Desc",
					"picLink": "",
					"createTime": "2016-01-15 17:02:00",
					"updateTime": "2016-01-15 17:02:00",
					"creator": "jsj",
					"updateUser": "jsj",
					"delFlag": "N"
				}, {
					"id": 111,
					"commerceCode": "commercecode011",
					"channel": "CHANNEL_RECREATION",
					"commerceName": "commerceName11",
					"commerceLogo": "logo",
					"activityTitle": "title11",
					"activityType": "LINK",
					"status": "RELEASED",
					"orderNo": 111,
					"endTime": "2016-01-15 00:00:00",
					"giftDesc": "mmerceName11Desc",
					"picLink": "",
					"createTime": "2016-01-15 17:02:00",
					"updateTime": "2016-01-15 17:02:00",
					"creator": "jsj",
					"updateUser": "jsj",
					"delFlag": "N"
				}, {
					"id": 111,
					"commerceCode": "commercecode011",
					"channel": "CHANNEL_RECREATION",
					"commerceName": "commerceName11",
					"commerceLogo": "logo",
					"activityTitle": "title11",
					"activityType": "LINK",
					"status": "RELEASED",
					"orderNo": 111,
					"endTime": "2016-01-15 00:00:00",
					"giftDesc": "mmerceName11Desc",
					"picLink": "",
					"createTime": "2016-01-15 17:02:00",
					"updateTime": "2016-01-15 17:02:00",
					"creator": "jsj",
					"updateUser": "jsj",
					"delFlag": "N"
				}, {
					"id": 111,
					"commerceCode": "commercecode011",
					"channel": "CHANNEL_RECREATION",
					"commerceName": "commerceName11",
					"commerceLogo": "logo",
					"activityTitle": "title11",
					"activityType": "LINK",
					"status": "RELEASED",
					"orderNo": 111,
					"endTime": "2016-01-15 00:00:00",
					"giftDesc": "mmerceName11Desc",
					"picLink": "",
					"createTime": "2016-01-15 17:02:00",
					"updateTime": "2016-01-15 17:02:00",
					"creator": "jsj",
					"updateUser": "jsj",
					"delFlag": "N"
				}],
				"rows": 12
			},
			"msgType": "info",
			"global": false
		};


		var total = result.data.total;
		result.paging = utils.paging(total, info.page, info.rows);
		result.utils = utils;
		result.config = config;
		result.channel = info.channel;
		result = getPJson(req, result);
		res.render(filepath, result);
	} else {
		wsclient.getCommerceActivityListForPage({
			"channel": info.channel,
			"page": info.page + 1,
			"rows": info.rows
		}, function(result) {
			if (result.success) {
				var total = result.data.total;
				result.paging = utils.paging(total, info.page, info.rows);
				result.utils = utils;
				result.config = config;
				result.channel = info.channel;
				result = getPJson(req, result);
				wsclient.productList({
					"producttag": 5,
					"pageIndex": 0,
					"pageSize": 8
				}, function(productResult) {
					if (productResult.success) {
						var recordCount = productResult.data.recordCount;
						result.productCount = recordCount;
						res.render(filepath, result);
					} else {

					}
				})
			} else {

			}
		});
	}
}

router.get(/\/huixiangshenghuo/, function(req, res, next) {
	var info = {
		"producttag": 5,
		"pageIndex": 0,
		"pageSize": 1
	};
	wsclient.productList(info, function(result) {
		if (result.success) {
			res.locals.pageResult = result.data.pageResult;
			//result = getPJson(req, result);
			next()
		} else {
			res.locals.pageResult = [];
			next()
		}
	})

});

router.get("/huixiangshenghuo", function(req, res, next) {
	return renderHXSH(req, res);
});

router.get("/channel/:channel", function(req, res, next) {
	//todo getCommerceActivityListForPage
	if (!channels[req.params.channel]) return res.redirect(config.base.domain);
	var info = {
		"channel": req.params.channel,
		"page": req.query.pageIndex || 0,
		"rows": 12
	};
	getGridData(info, req, res, 'm7/huixiangshenghuo_grid');
});


router.get('/pla/channel/:channel', function(req, res, next) {
	var info = {
		"channel": req.params.channel,
		"page": parseInt(req.query.pageIndex) || 0,
		"rows": 12
	};
	getGridData(info, req, res, 'm7/temp_grid_body');
});

router.get("/huixiangshenghuo_getshopstatus/:shopcode", function(req, res, next) {
	if (!product) {
		return res.send({
			active: true
		});
	}
	wsclient.getCommerceActivityLifeProduct({
		commerceCode: req.params.shopcode
	}, function(shopinfoResult) {
		if (shopinfoResult && shopinfoResult.data && shopinfoResult.data[0] && shopinfoResult.data[0].status === "RELEASED") {
			return res.send({
				active: true
			});
		} else return res.send({
			active: false
		});
	});
});

router.get("/huixiangshenghuo_pages/:shopcode", function(req, res, next) {
	if (!req.params.shopcode) return res.redirect(config.base.domain);
	if (product) {
		if (!req.session.user) return res.redirect(config.base.domain + "login?apchy=m7/huixiangshenghuo_pages/" + req.params.shopcode);
		wsclient.getCommerceActivityLifeProduct({
			commerceCode: req.params.shopcode
		}, function(shopinfoResult) {
			if (!shopinfoResult.success) return res.redirect(config.base.domain);
			if (!shopinfoResult.data || !shopinfoResult.data.length) {
				res.status(404);
				res.redirect("/notfound");
				return;
			}
			wsclient.getCommerceActivityChance({
				custId: req.session.user.custId,
				commerceCode: req.params.shopcode
			}, function(wsresult) {
				if (!wsresult.success) return res.redirect(config.base.domain);
				console.log("----------------------")
				if (shopinfoResult.data) {
					shopinfoResult = shopinfoResult.data[0] || {};
				}
				// console.log(shopinfoResult);
				var _data = {
					data: wsresult.data || "",
					commerceCode: req.params.shopcode,
					commerceName: shopinfoResult.commerceName,
					commerceLogo: shopinfoResult.commerceLogo,
					activityType: shopinfoResult.activityType,
					activityTitle: shopinfoResult.activityTitle,
					picLink: shopinfoResult.picLink,
					activityDesc: shopinfoResult.activityDesc
				};
				console.log(_data)
				return res.render("m7/huixiangshenghuo_pages_tmpl", getPJson(req, _data));
			});
		});
	} else return res.render("m7/huixiangshenghuo_pages_tmpl", getPJson(req, {
		data: "12",
		commerceCode: "louxia100",
		commerceName: "楼下100",
		commerceLogo: 12,
		activityType: "LINK", //ELECTRONIC_TICKET,QR_CODE,LINK
		activityTitle: "楼下100下午茶15元代金券",
		picLink: "http://www.baidu.com",
		activityDesc: "<div class=\"hsh_illus_title\">商品详情描述</div><ul class=\"hsh_illus_content\"><li>50元周边游优惠券（满500使用）；150元长线优惠券（满1500元使用）；300元出境优惠券（满3000元使用），每一个优惠券码中三种优惠券各四张，合计2000元。</li><li></li></ul><br/><div class=\"hsh_illus_title\">使用方式</div><ul class=\"hsh_illus_content\"><li>1、登录51you.com->点击个人中心->点击激活优惠券->输入优惠券代码->激活成功；</li><li>2、选择旅游线路；使用对应优惠券抵扣旅游费用。</li></ul><br/><div class=\"hsh_illus_title\">使用规则</div><ul class=\"hsh_illus_content\"><li> 1、红包金额同一订单同一类型产品不可叠加使用；</li><li> 2、上红包不适用特价、某些制定优惠活动产品，不适用于单门票、单机票以及单酒店等单品类产品；</li><li> 3、短线、长线、出境红包不能交互使用，仅适用于制定产品类别。</li></ul><br/><div class=\"hsh_illus_title\">有效期</div><ul class=\"hsh_illus_content\"><li>有效期至2015年12月31日。</li><li>    <br/></li><li>注意事项（异常情况等）</li><li>客服电话：4008180898</li></ul><br/>"
	}));
});

function buildTempl(req, res, next) {
	var result = {
		user: {},
		domain: config.base.domain,
		promodomain: config.base.promodomain,
		_custId: "1",
		data: "12",
		commerceCode: "louxia100",
		commerceName: "楼下100",
		commerceLogo: 12,
		activityType: "LINK", //ELECTRONIC_TICKET,QR_CODE,LINK
		activityTitle: "楼下100下午茶15元代金券",
		picLink: "/imgs/louxia100_logo.png",
		activityDesc: "<div class=\"hsh_illus_title\">商品详情描述</div><ul class=\"hsh_illus_content\"><li>50元周边游优惠券（满500使用）；150元长线优惠券（满1500元使用）；300元出境优惠券（满3000元使用），每一个优惠券码中三种优惠券各四张，合计2000元。</li><li></li></ul><br/><div class=\"hsh_illus_title\">使用方式</div><ul class=\"hsh_illus_content\"><li>1、登录51you.com->点击个人中心->点击激活优惠券->输入优惠券代码->激活成功；</li><li>2、选择旅游线路；使用对应优惠券抵扣旅游费用。</li></ul><br/><div class=\"hsh_illus_title\">使用规则</div><ul class=\"hsh_illus_content\"><li> 1、红包金额同一订单同一类型产品不可叠加使用；</li><li> 2、上红包不适用特价、某些制定优惠活动产品，不适用于单门票、单机票以及单酒店等单品类产品；</li><li> 3、短线、长线、出境红包不能交互使用，仅适用于制定产品类别。</li></ul><br/><div class=\"hsh_illus_title\">有效期</div><ul class=\"hsh_illus_content\"><li>有效期至2015年12月31日。</li><li>    <br/></li><li>注意事项（异常情况等）</li><li>客服电话：4008180898</li></ul><br/>"
	};
	for (var key in result) {
		if (req.params.hasOwnProperty(key)) {
			result[key] = req.params[key];
		}
	}
	console.log(result);
	return res.render("m7/huixiangshenghuo_pages_tmpl", result);
}

router.get("/huixiangshenghuo_pages_tmpl", function(req, res, next) {
	return buildTempl(req, res, next);
});

router.post("/huixiangshenghuo_pages_tmpl", function(req, res, next) {
	return buildTempl(req, res, next);
});

router.get("/huixiangshenghuo_userconfirm/:shopcode", function(req, res, next) {
	if (product) {
		if (!req.session.user) return res.send({
			success: false,
			msg: "notlogin"
		});
		var custId = req.session.user.custId;
		wsclient.getCommerceActivityResult({
			custId: custId,
			commerceCode: req.params.shopcode
		}, function(wsresult) {
			return res.send(wsresult);
		});
	} else return res.send({
		"success": true,
		"msg": "成功",
		"data": 3,
		"msgType": "info",
		"global": false
	});
});

router.get("/huixiangshenghuo_checktogo/:shopcode", function(req, res, next) {
	if (product) {
		if (!req.session.user) return res.send({
			success: false,
			msg: "notlogin"
		});
		wsclient.getCommerceActivityChance({
			custId: req.session.user.custId,
			commerceCode: req.params.shopcode
		}, function(wsresult) {
			res.send(wsresult);
		});
		return;
	} else return res.send({
		"success": true,
		"msg": "成功",
		"data": 3,
		"msgType": "info",
		"global": false
	})
});

/*公共json*/
function getPJson(req, list) {
	/**
     *  取圣诞节session
     */
	var christmas = config.christmas;
	var newyear = config.newyear;
    var now = new Date().getTime();
    var activeStartTime = christmas.start;
    var activeEndTime = christmas.end;
    if(now > activeStartTime && now < activeEndTime) {
        var isChristmasDay = true
    }else{
        var isChristmasDay = false
	}
	if(now > newyear.start && now < newyear.end) {
        var isNewyear = true
    }else{
        var isNewyear = false
    }
	var pJson = {
		user: req.session.user || null,
		domain: config.base.domain,
		promodomain: config.base.promodomain,
		isChristmasDay: isChristmasDay,
		isNewyear: isNewyear,
		_custId: req.session.user ? req.session.user.custId : "",
		originalUrl: encodeURIComponent(config.base.promodomain + (req.originalUrl).substring(1))
	};
	//console.log(_);
	var newArr = _.extend(pJson, list)
	return newArr;
}


function getLsit(info, req, res, filepath) {
	wsclient.productList(info, function(result) {
		if (result.success) {
			var recordCount = result.data.recordCount;
			result.paging = utils.paging(recordCount, info.pageIndex, info.pageSize);
			result.utils = utils;
			result.config = config;
			result = getPJson(req, result);
			res.render(filepath, result);
		} else {

		}
	})
}

/*惠享生活活动产品列表*/
router.get('/xsqglist', function(req, res, next) {
	var pageIndex = req.query.pageIndex || 0;
	var info = {
		"producttag": 5,
		"pageIndex": pageIndex,
		"pageSize": 8
	};
	getLsit(info, req, res, 'm7/xsqglist')
});



router.get('/pla/xsqglist', function(req, res, next) {
	var pageIndex = req.query.pageIndex || 0;
	var info = {
		"producttag": 5,
		"pageIndex": pageIndex,
		"pageSize": 8
	};
	getLsit(info, req, res, 'm7/tmp_xsqglist')
});
/*惠享生活活动产品详情*/
router.get('/xsqgdetail/:prodCode?', function(req, res, next) {
	if (!(req.params.prodCode)) {
		res.redirect('/m7/huixiangshenghuo');
		return
	}
	var user = req.session.user;
	var info = {
		"producttag": 5,
		"pageIndex": 0,
		"pageSize": 1,
		"prodCode": req.params.prodCode,
		'custId': user ? user.custId : ''
	};
	getLsit(info, req, res, 'm7/xsqgdetail')

});
/*投资限时产品*/
router.post('/pra/investXsqg', function(req, res, next) {
	var user = req.session.user;
	if (!user) {
		res.send({
			success: false,
			tourl: config.base.domain + 'login?hxsh=' + config.base.promodomain + (req.session.lastURL).substring(1)
		})
		return
	}
	var info = {
		custId: user.custId,
		loginName: user.loginname,
		userBidMoney: parseFloat(req.body.userBidMoney),
		envelopeNo: req.body.envelopeNo || "",
		prodCode: req.body.prodCode,
		productTag: 5,
		platForm: "P2P",
		couponNo: req.body.couponNo || "",
		ext: "t=touzi"
	}
	wsclient.instantInvest(info, function(result) {
		if(result.success && result.data.url){
			result.data.message = decodeURIComponent(result.data.message);
			result.data.message = utils.dataConvert(result.data.message);
		}
		return res.send(result);
	})
		//result= getPJson(req,result)
		//res.render('m7/xsqgdetail',result)
});

/*获取居间协议*/
router.get("/pra/getBetweenDeal", function(req, res, next) {
	var urlencode = require('urlencode2');
	//var querystring = require('querystring');
	var user = req.session.user;
	var uinfo = {
		custId: user.custId
	}
	if (user == null) {
		res.send(utils.getFailResult('', '/login'));
	}
	wsclient.viewIICProtocol(uinfo, function(wsresult) {
		if (wsresult.data != null) {
			wsresult.data = wsresult.data;
			wsresult.data = wsresult.data.replace(/\r\n/);
			wsresult.data = wsresult.data.substring(wsresult.data.indexOf('<body>') + 6, wsresult.data.indexOf('</body>'));
		}
		res.send(wsresult)
	})
});
module.exports = router;