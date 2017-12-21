var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

/*
 * 检查登录状态。
 */
router.all('/p/*', function(req, res, next) {

	var user = req.session.user;
	var url = req.url.toLowerCase();
	if (utils.isNotNull(user)) {

		if (utils.isNotNull(user.dtCustId)) {
			next();
		} else {
			res.redirect('/spread/login');
		}

	} else {
		if (url.indexOf('/p/pra/') >= 0) {
			return res.send(utils.getFailResult("登录名已失效,请重新登录", "", "", "login"));
		} else {
			res.redirect('/spread/login');
		}

	}
});

/*首页*/
router.get("/", function(req, res, next) {
	res.redirect('/spread/login');
});
/*登录*/
router.route('/login')
	.get(function(req, res, next) {
		var user = req.session.user;

		if (user && user.dtCustId) {
			res.redirect('/spread/p/my');
		} else {
			res.render("spread/login");
		}
	})
	.post(function(req, res, next) {
		var username = req.body.username;
		var password = req.body.password;
		var uinfo = {
			loginName: username,
			loginPassword: password,
			regType: '4',
			loginIp: utils.getClientIp(req)
		};

		wsclient.userLogin(uinfo, function(wsresult) {
			if (wsresult.success) {
				var sessionJson = {
					custId: wsresult.data.id,
					loginname: wsresult.data.loginName,
					mobile: wsresult.data.mobile
				};

				utils.createSession(sessionJson, req, res);
				req.session.user.dtCustId = sessionJson.custId;
				res.send(utils.getSuccessResult(null, ''));
				/*/!*查询状态*!/
				wsclient.getMyPopularizeInfo({custId:sessionJson.custId}, function(wsresult) {
					if (wsresult.success) {
						var roleType;
						if(wsresult.data=="0"){
							roleType = 0;
						}else{
							roleType = wsresult.data.roleType;
						}

					}else{
						res.send(utils.getFailResult(wsresult.msg, "", "", "login"));
					}
				});*/

			} else {
				res.send(utils.getFailResult(wsresult.msg, "", "", "login"));
			}
		});

	});

/*退出*/
router.get("/logout", function(req, res, next) {
	req.session.destroy();
	res.redirect('/spread/login');
});

/*我的信息*/
router.get("/p/my", function(req, res, next) {
	var user = req.session.user;
	//var roleType = req.session.roleType;
	var ejsvar = {};
	ejsvar.headTitle = "我的信息";
	//if(roleType==0) res.redirect('/spread/p/apply');
	wsclient.getMyPopularizeInfo({
		custId: user.custId
	}, function(wsresult) {
		if (wsresult.success) {

			req.session.roleType = wsresult.data.roleType;
			ejsvar.myPop = wsresult.data;
			if (wsresult.data.higherLevelTel) ejsvar.myPop.higherLevelTelx = utils.mobeileTosen(wsresult.data.higherLevelTel);
			res.render("spread/my", ejsvar);
		} else {

			if (wsresult.data == "0") {
				res.redirect('/spread/p/apply');
			} else {
				res.render("spread/login");
			}

		}
	});

});

/*申请*/
router.get("/p/apply", function(req, res, next) {
	var user = req.session.user;
	var roleType = req.session.roleType;
	var ejsvar = {};
	ejsvar.headTitle = "推广申请";
	res.render("spread/apply", ejsvar);
});

/*申请回调*/
router.post("/p/pra/applyback", function(req, res, next) {
	var user = req.session.user;
	//var roleType = req.session.roleType;
	var roleType = req.body.roletype;
	var mobile = req.body.mobile;
	wsclient.popularizeValidateTel({
		roleType: roleType,
		tel: mobile
	}, function(wsresult) {
		if (wsresult.success) {
			wsresult.data.telx = utils.mobeileTosen(wsresult.data.tel);
			wsresult.data.roleType = roleType;
			res.send(utils.getSuccessResult(wsresult.data, ''));
		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "login"));
		}
	});
	//res.render("spread/applyback");
});

/*保存申请记录*/
router.post("/p/pra/saveapply", function(req, res, next) {
	var user = req.session.user,
		roleType = req.body.roletype,
		mobile = req.body.mobile;
	wsclient.popularizeValidateTel({
		roleType: roleType,
		tel: mobile
	}, function(wsresult) {
		if (wsresult.success) {
			var popJson = wsresult.data;
			wsclient.savePopularizeUserInfo({
				custId: user.custId,
				roleType: roleType,
				higherLevelCustId: popJson.recommendId,
				seqNum: popJson.seqNum

			}, function(wsresult) {
				if (wsresult.success) {
					res.send(utils.getSuccessResult(wsresult.data, ''));
				} else {
					res.send(utils.getFailResult("10", "", "", "applysave"));
				}
			});

		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "applysave"));
		}
	});
});

/*管理兼职列表*/
router.get("/p/jlist", function(req, res, next) {
	var user = req.session.user;
	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "管理兼职";
	wsclient.getPopularizeSubRoleList({
		custId: user.custId,
		roleType: 3,
		page: 1,
		rows: 20
	}, function(wsresult) {
		if (wsresult.success) {
			ejsvar.data = wsresult.data;
			res.render("spread/jlist", ejsvar);
		} else {
			res.redirect('spread/login');
		}
	});

});

/*管理兼职列表ajax*/
router.get("/p/pra/jlist", function(req, res, next) {
	var user = req.session.user;
	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "管理兼职";
	var page = req.query.page;
	wsclient.getPopularizeSubRoleList({
		custId: user.custId,
		roleType: 3,
		page: page,
		rows: 20
	}, function(wsresult) {
		if (wsresult.success) {
			var str = '';
			for (var i = 0; i < wsresult.data.rows.length; i++) {
				str += '<ul class="list-con">';
				var custName = "";
				if (wsresult.data.rows[i].custName) {
					custName = wsresult.data.rows[i].custName;
				} else {
					custName = '';
				}

				str += '<li>' + utils.mobeileTosen(wsresult.data.rows[i].tel) + '</li>';
				str += '<li>' + wsresult.data.rows[i].applyTime.loginName + '</li>';
				str += '<li class="list-con-item5">' + wsresult.data.rows[i].applyTime.substr(0, 10) + '<br>' + wsresult.data.rows[i].applyTime.substr(11).replace(/:/g, " : ") + '</li>';
				str += '<li><a href="javascript:;" class="close jlistclose" rid="' + wsresult.data.rows[i].recommendId + '" roletype="' + wsresult.data.rows[i].recomType + '" tel="' + utils.mobeileTosen(wsresult.data.rows[i].tel) + '" custname="' + wsresult.data.rows[i].custName + '"></a></li>';
				str += '</ul>';
			}

			res.send(utils.getSuccessResult(str, ''));
		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "pra/jlist"));
		}
	});
});

/*管理推广大使列表*/
router.get("/p/tlist", function(req, res, next) {
	var user = req.session.user;
	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "管理推广大使";

	wsclient.getPopularizeSubRoleList({
		custId: user.custId,
		roleType: 1,
		page: 1,
		rows: 20
	}, function(wsresult) {
		if (wsresult.success) {
			ejsvar.data = wsresult.data;
			res.render("spread/tlist", ejsvar);
		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "tlist"));
		}
	});
});

/*管理推广大使列表ajax*/
router.get("/p/pra/tlist", function(req, res, next) {
	var user = req.session.user;
	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "管理推广大使";
	var page = req.query.page;
	wsclient.getPopularizeSubRoleList({
		custId: user.custId,
		roleType: 1,
		page: page,
		rows: 20
	}, function(wsresult) {
		if (wsresult.success) {
			var str = '';
			for (var i = 0; i < wsresult.data.rows.length; i++) {
				str += '<ul class="list-con">';
				if (wsresult.data.rows[i].custName) {
					custName = wsresult.data.rows[i].custName;
				} else {
					custName = '';
				}
				str += '<li>' + custName + '</li>';
				str += '<li>' + utils.mobeileTosen(wsresult.data.rows[i].tel) + '</li>';
				str += '<li class="list-con-item5">' + wsresult.data.rows[i].applyTime.substr(0, 10) + '<br>' + wsresult.data.rows[i].applyTime.substr(11).replace(/:/g, " : ") + '</li>';
				str += '<li><a href="javascript:;" class="close tlistclose" rid="' + wsresult.data.rows[i].recommendId + '" roletype="' + wsresult.data.rows[i].recomType + '" tel="' + utils.mobeileTosen(wsresult.data.rows[i].tel) + '" custname="' + wsresult.data.rows[i].custName + '"></a></li>';
				str += '</ul>';
			}

			res.send(utils.getSuccessResult(str, ''));
		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "pra/tlist"));
		}
	});
});
/*删除指定角色*/
router.get("/p/pra/delpopu", function(req, res, next) {
	var user = req.session.user;
	var rid = req.query.rid;
	var myid = req.query.myid;
	if (myid == 1) rid = user.custId;
	wsclient.removePopularizeRole({
		custId: user.custId.toString(),
		recommendId: rid.toString()
	}, function(wsresult) {
		if (wsresult.success) {
			if (user.custId == rid) {
				req.session.user.dtCustId = null;
			}
			res.send(utils.getSuccessResult(wsresult.data, ''));
		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "delete"));
		}
	});
	//res.send(utils.getFailResult("1", "", "", "delete"));
	//res.send(utils.getSuccessResult("1", ''));
});

/*业绩统计*/
router.get("/p/mycount", function(req, res, next) {
	var user = req.session.user;
	var roleType = req.session.roleType;
	/*var searchName = req.query.k ? req.query.k: '';
	var searchStartDate = req.query.sd ? req.query.sd : '';
	var searchEndDate = req.query.ed ? req.query.ed : '';
	var page= req.query.page ? req.query.page: 1;*/
	var searchName = '';
	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "业绩统计";
	ejsvar.roleType = roleType;
	var nowDate = new Date();
	/*var nd = {
		year:nowDate.getFullYear(),
		month:nowDate.getMonth()+1,
		day:nowDate.getDate()
	};*/
	//获取星期
	var sn;
	var en;

	switch (nowDate.getDay()) {
		case 0:
			sn = -6;
			en = 0;
			break;
		case 1:
			sn = 0;
			en = 6;
			break;
		case 2:
			sn = -1;
			en = 5;
			break;
		case 3:
			sn = -2;
			en = 4;
			break;
		case 4:
			sn = -3;
			en = 3;
			break;
		case 5:
			sn = -4;
			en = 2;
			break;
		case 6:
			sn = -5;
			en = 1;
			break;
	}

	var searchStartDateObj = new Date((nowDate / 1000 + (86400 * sn)) * 1000);
	var searchEndDateObj = new Date((nowDate / 1000 + (86400 * en)) * 1000);
	var sd = {
		year: searchStartDateObj.getFullYear(),
		month: searchStartDateObj.getMonth() + 1,
		day: searchStartDateObj.getDate()
	};
	var ed = {
		year: searchEndDateObj.getFullYear(),
		month: searchEndDateObj.getMonth() + 1,
		day: searchEndDateObj.getDate()
	};
	if (sd.month < 10) sd.month = "0" + sd.month.toString();
	if (sd.day < 10) sd.day = "0" + sd.day.toString();
	if (ed.month < 10) ed.month = "0" + ed.month.toString();
	if (ed.day < 10) ed.day = "0" + ed.day.toString();
	var sdStr = sd.year + '-' + sd.month + '-' + sd.day;
	var edStr = ed.year + '-' + ed.month + '-' + ed.day;

	/*var searchEndDateStr = searchEndDateObj.getFullYear()+'-'+(searchEndDateObj.getMonth()+1)+'-'+searchEndDateObj.getDate();
	var searchStartDateStr = searchStartDateObj.getFullYear()+'-'+(searchStartDateObj.getMonth()+1)+'-'+searchStartDateObj.getDate();*/

	/*ejsvar.nowDate = searchEndDateStr;*/
	/*if(searchStartDate == '') searchStartDate = searchStartDateStr;
	if(searchEndDate == '') searchEndDate = searchEndDateStr;*/
	var sInfo = {
		custId: user.custId.toString(),
		roleType: roleType,
		searchName: searchName,
		searchStartDate: sdStr,
		searchEndDate: edStr,
		page: 1,
		rows: 20
	};
	ejsvar.search = sInfo;
	/*ejsvar.data = {};
	ejsvar.data.total = 4;*/
	wsclient.getPopularizeAchievementList(sInfo, function(wsresult) {
		if (wsresult.success) {
			ejsvar.data = wsresult.data;
			res.render("spread/mycount", ejsvar);
		} else {
			res.redirect('/spread/p/my');
		}
	});

});

/*业绩统计ajax*/
router.get("/p/pra/mycount", function(req, res, next) {
	var user = req.session.user;
	var roleType = req.session.roleType;

	var searchName = req.query.k ? req.query.k : '';
	var searchStartDate = req.query.sd ? req.query.sd : '';
	var searchEndDate = req.query.ed ? req.query.ed : '';
	var page = req.query.page ? req.query.page : 1;
	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "业绩统计";
	ejsvar.roleType = roleType;

	/*var searchEndDate = new Date();
	var searchStartDate = new Date((searchEndDate/1000-(86400*6))*1000);

	var searchEndDateStr = searchEndDate.getFullYear()+'-'+(searchEndDate.getMonth()+1)+'-'+searchEndDate.getDate();
	var searchStartDateStr = searchStartDate.getFullYear()+'-'+(searchStartDate.getMonth()+1)+'-'+searchStartDate.getDate();*/
	var sInfo = {
		custId: user.custId.toString(),
		roleType: roleType,
		searchName: searchName,
		searchStartDate: searchStartDate,
		searchEndDate: searchEndDate,
		page: page,
		rows: 20
	};

	var roleTypeArr = [];
	roleTypeArr[1] = "推广大使";
	roleTypeArr[2] = "代理";
	roleTypeArr[3] = "兼职";
	roleTypeArr[4] = "全职";

	wsclient.getPopularizeAchievementList(sInfo, function(wsresult) {

		/*伪数据BEGIN*/
		/*var html = '<ul class="list-con list-con1"><li class="list-con-item3">果果三十八<br>132****0038</li><li>推广大使</li><li>23个</li></ul>';
		for(var i=0; i<10; i++){
			html +='<ul class="list-con list-con1"><li class="list-con-item3">果果三十八<br>132****0038</li><li>推广大使'+i+'</li><li>23个</li></ul>';
		}


		res.send(utils.getSuccessResult(html, ''));*/
		/*伪数据END*/
		if (wsresult.success) {
			console.log('dkshsei----' + JSON.stringify(wsresult.data.rows));
			var str = '';
			var recomName;
			for (var i = 0; i < wsresult.data.rows.length; i++) {
				recomName = wsresult.data.rows[i].recomName || '';
				if(wsresult.data.rows[i].nowType==1){
					str +='<a href="/spread/p/expand/'+ wsresult.data.rows[i].promoId+'">'
				}
				str += '<ul class="list-con list-con1">';
				str += '<li class="list-con-item3">' + recomName + '<br>' + utils.mobeileTosen(wsresult.data.rows[i].tel) + '</li>';
				str += '<li>' + roleTypeArr[wsresult.data.rows[i].nowType] + '</li>';
				str += '<li>' + wsresult.data.rows[i].counts + '个</li>';
				str += '</ul>';
				if(wsresult.data.rows[i].nowType==1){
					str +='</a>'
				}

			}
			res.send(utils.getSuccessResult(str, '', '', wsresult.data.total));
		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "pra/mycount"));
		}
	});

});

/*业绩明细*/
router.get("/p/detail", function(req, res, next) {
	var user = req.session.user;
	var roleType = req.session.roleType;

	var searchName = '';



	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "业绩明细";
	ejsvar.roleType = roleType;
	var nowDate = new Date();
	/*var nd = {
	 year:nowDate.getFullYear(),
	 month:nowDate.getMonth()+1,
	 day:nowDate.getDate()
	 };*/
	//获取星期
	var sn;
	var en;

	switch (nowDate.getDay()) {
		case 0:
			sn = -6;
			en = 0;
			break;
		case 1:
			sn = 0;
			en = 6;
			break;
		case 2:
			sn = -1;
			en = 5;
			break;
		case 3:
			sn = -2;
			en = 4;
			break;
		case 4:
			sn = -3;
			en = 3;
			break;
		case 5:
			sn = -4;
			en = 2;
			break;
		case 6:
			sn = -5;
			en = 1;
			break;
	}


	var searchStartDateObj = new Date((nowDate / 1000 + (86400 * sn)) * 1000);
	var searchEndDateObj = new Date((nowDate / 1000 + (86400 * en)) * 1000);
	var sd = {
		year: searchStartDateObj.getFullYear(),
		month: searchStartDateObj.getMonth() + 1,
		day: searchStartDateObj.getDate()
	};
	var ed = {
		year: searchEndDateObj.getFullYear(),
		month: searchEndDateObj.getMonth() + 1,
		day: searchEndDateObj.getDate()
	};
	if (sd.month < 10) sd.month = "0" + sd.month.toString();
	if (sd.day < 10) sd.day = "0" + sd.day.toString();
	if (ed.month < 10) ed.month = "0" + ed.month.toString();
	if (ed.day < 10) ed.day = "0" + ed.day.toString();
	var sdStr = sd.year + '-' + sd.month + '-' + sd.day;
	var edStr = ed.year + '-' + ed.month + '-' + ed.day;

	/*var searchEndDateStr = searchEndDateObj.getFullYear()+'-'+(searchEndDateObj.getMonth()+1)+'-'+searchEndDateObj.getDate();
	 var searchStartDateStr = searchStartDateObj.getFullYear()+'-'+(searchStartDateObj.getMonth()+1)+'-'+searchStartDateObj.getDate();*/

	/*ejsvar.nowDate = searchEndDateStr;*/
	/*if(searchStartDate == '') searchStartDate = searchStartDateStr;
	 if(searchEndDate == '') searchEndDate = searchEndDateStr;*/
	var sInfo = {
		custId: user.custId.toString(),
		roleType: roleType,
		searchName: searchName,
		searchStartDate: sdStr,
		searchEndDate: edStr,
		page: 1,
		rows: 20
	};
	ejsvar.search = sInfo;
	/*	ejsvar.data = {};
		ejsvar.data.total = 4;*/
	wsclient.getPopularizePromoDetailList(sInfo, function(wsresult) {
		if (wsresult.success) {
			ejsvar.data = wsresult.data;
			res.render("spread/detail", ejsvar);
		} else {
			res.redirect('/spread/p/my');
		}
	});
});

/*业绩明细ajax*/
router.get("/p/pra/detail", function(req, res, next) {
	var user = req.session.user;
	var roleType = req.session.roleType;

	var searchName = req.query.k ? req.query.k : '';
	var searchStartDate = req.query.sd ? req.query.sd : '';
	var searchEndDate = req.query.ed ? req.query.ed : '';
	var page = req.query.page ? req.query.page : 1;


	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "业绩明细";
	ejsvar.roleType = roleType;

	/*var searchEndDate = new Date();
	 var searchStartDate = new Date((searchEndDate/1000-(86400*6))*1000);

	 var searchEndDateStr = searchEndDate.getFullYear()+'-'+(searchEndDate.getMonth()+1)+'-'+searchEndDate.getDate();
	 var searchStartDateStr = searchStartDate.getFullYear()+'-'+(searchStartDate.getMonth()+1)+'-'+searchStartDate.getDate();*/
	var sInfo = {
		custId: user.custId.toString(),
		roleType: roleType,
		searchName: searchName,
		searchStartDate: searchStartDate,
		searchEndDate: searchEndDate,
		page: page,
		rows: 20
	};


	wsclient.getPopularizePromoDetailList(sInfo, function(wsresult) {
		if (wsresult.success) {
			console.log(JSON.stringify(wsresult));
			var str = '';
			var recomName;
			for (var i = 0; i < wsresult.data.rows.length; i++) {
				recomName = wsresult.data.rows[i].recomName || '';

				if (wsresult.data.rows[i].doubleFlag == 'Y') {
					str += '<ul class="list-con list-con1 redFontColor">';
				} else {
					str += '<ul class="list-con list-con1">';
				}
				str += '<li class="list-con-item4">' + recomName + '<br>' + utils.mobeileTosen(wsresult.data.rows[i].tel) + '</li>';
				str += '<li>' + utils.mobeileTosen(wsresult.data.rows[i].recomTel) + '</li>';
				str += '<li class="list-con-item3">' + wsresult.data.rows[i].createTime.substr(0, 10) + '<br>' + wsresult.data.rows[i].createTime.substr(11).replace(/:/g, " : ") + '</li>';
				str += '</ul>';

			}
			res.send(utils.getSuccessResult(str, '', '', wsresult.data.total));
		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "pra/detail"));
		}
	});

});
/*业绩统计 推广大使详情页面*/
router.get("/p/expand/:promoId", function(req, res, next) {
	if (!(req.params.promoId)) {
		res.redirect('/spread/p/my');
	}
	var user = req.session.user;
	var roleType = req.session.roleType;
	/*var searchName = req.query.k ? req.query.k: '';
	var searchStartDate = req.query.sd ? req.query.sd : '';
	var searchEndDate = req.query.ed ? req.query.ed : '';
	var page= req.query.page ? req.query.page: 1;*/
	var searchName = '';
	var ejsvar = {};
	ejsvar.myPromoId=req.params.promoId;
	ejsvar.utils = utils;
	ejsvar.headTitle = "业绩统计";
	ejsvar.roleType = roleType;
	var nowDate = new Date();
	/*var nd = {
		year:nowDate.getFullYear(),
		month:nowDate.getMonth()+1,
		day:nowDate.getDate()
	};*/
	//获取星期
	var sn;
	var en;

	switch (nowDate.getDay()) {
		case 0:
			sn = -6;
			en = 0;
			break;
		case 1:
			sn = 0;
			en = 6;
			break;
		case 2:
			sn = -1;
			en = 5;
			break;
		case 3:
			sn = -2;
			en = 4;
			break;
		case 4:
			sn = -3;
			en = 3;
			break;
		case 5:
			sn = -4;
			en = 2;
			break;
		case 6:
			sn = -5;
			en = 1;
			break;
	}

	var searchStartDateObj = new Date((nowDate / 1000 + (86400 * sn)) * 1000);
	var searchEndDateObj = new Date((nowDate / 1000 + (86400 * en)) * 1000);
	var sd = {
		year: searchStartDateObj.getFullYear(),
		month: searchStartDateObj.getMonth() + 1,
		day: searchStartDateObj.getDate()
	};
	var ed = {
		year: searchEndDateObj.getFullYear(),
		month: searchEndDateObj.getMonth() + 1,
		day: searchEndDateObj.getDate()
	};
	if (sd.month < 10) sd.month = "0" + sd.month.toString();
	if (sd.day < 10) sd.day = "0" + sd.day.toString();
	if (ed.month < 10) ed.month = "0" + ed.month.toString();
	if (ed.day < 10) ed.day = "0" + ed.day.toString();
	var sdStr = sd.year + '-' + sd.month + '-' + sd.day;
	var edStr = ed.year + '-' + ed.month + '-' + ed.day;
	var sInfo = {
		custId: req.params.promoId,
		roleType: roleType,
		searchName: searchName,
		searchStartDate: sdStr,
		searchEndDate: edStr,
		page: 1,
		rows: 20
	};
	ejsvar.search = sInfo;
	/*ejsvar.data = {};
	ejsvar.data.total = 4;*/
	wsclient.getPopularizeAchievementList(sInfo, function(wsresult) {
		if (wsresult.success) {
			ejsvar.data = wsresult.data;
			res.render("spread/expand", ejsvar);
		} else {
			res.redirect('/spread/p/my');
		}
	});

});
/*业绩统计 推广大使ajax页面*/
router.get("/p/pra/expand/:promoId", function(req, res, next) {
	var user = req.session.user;
	var roleType = req.session.roleType;

	var searchName = req.query.k ? req.query.k : '';
	var searchStartDate = req.query.sd ? req.query.sd : '';
	var searchEndDate = req.query.ed ? req.query.ed : '';
	var page = req.query.page ? req.query.page : 1;
	var ejsvar = {};
	ejsvar.utils = utils;
	ejsvar.headTitle = "业绩统计";
	ejsvar.roleType = roleType;

	/*var searchEndDate = new Date();
	var searchStartDate = new Date((searchEndDate/1000-(86400*6))*1000);

	var searchEndDateStr = searchEndDate.getFullYear()+'-'+(searchEndDate.getMonth()+1)+'-'+searchEndDate.getDate();
	var searchStartDateStr = searchStartDate.getFullYear()+'-'+(searchStartDate.getMonth()+1)+'-'+searchStartDate.getDate();*/
	var sInfo = {
		custId: req.params.promoId,
		roleType: roleType,
		searchName: searchName,
		searchStartDate: searchStartDate,
		searchEndDate: searchEndDate,
		page: page,
		rows: 20
	};

	var roleTypeArr = [];
	roleTypeArr[1] = "推广大使";
	roleTypeArr[2] = "代理";
	roleTypeArr[3] = "兼职";
	roleTypeArr[4] = "全职";

	wsclient.getPopularizeAchievementList(sInfo, function(wsresult) {

		/*伪数据BEGIN*/
		/*var html = '<ul class="list-con list-con1"><li class="list-con-item3">果果三十八<br>132****0038</li><li>推广大使</li><li>23个</li></ul>';
		for(var i=0; i<10; i++){
			html +='<ul class="list-con list-con1"><li class="list-con-item3">果果三十八<br>132****0038</li><li>推广大使'+i+'</li><li>23个</li></ul>';
		}


		res.send(utils.getSuccessResult(html, ''));*/
		/*伪数据END*/
		if (wsresult.success) {
			console.log('dkshsei----' + JSON.stringify(wsresult.data.rows));
			var str = '';
			var recomName;
			for (var i = 0; i < wsresult.data.rows.length; i++) {
				recomName = wsresult.data.rows[i].recomName || '';
				str += '<ul class="list-con list-con1">';
				str += '<li class="list-con-item3">' + recomName + '<br>' + utils.mobeileTosen(wsresult.data.rows[i].tel) + '</li>';
				str += '<li>' + roleTypeArr[wsresult.data.rows[i].nowType] + '</li>';
				str += '<li>' + wsresult.data.rows[i].counts + '个</li>';
				str += '</ul>';
			}
			res.send(utils.getSuccessResult(str, '', '', wsresult.data.total));
		} else {
			res.send(utils.getFailResult(wsresult.data, "", "", "pra/mycount"));
		}
	});

});
module.exports = router;