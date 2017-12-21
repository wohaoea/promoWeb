var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var config = require('../config');

//银率网推广
router.get("/getProduct", function(req, res, next) {
	var query = req.query;
	var pageIndex = query.page;
	var pageIndexForApi = pageIndex;
	var pagesize = query.page_size;
	var producttag = 1;
	pageIndex = pageIndex == null ? 0 : parseInt(pageIndex) - 1;
	pagesize = pagesize == null ? 10 : parseInt(pagesize);
	var uinfo = {
		producttag: producttag, //1-->新客专享、2-->优选计划、3-->宝宝精选  4--->债权转换
		pageIndex: pageIndex, //页码
		pageSize: pagesize, //每页数据多少
		startReleaseTime: query.begin, //最小的散标发布日期
		endReleaseTime: query.end //最大的散标发布日期
	};
	var pdetail = {}; //产品详情
	var results = {};
	wsclient.ProductList(uinfo, function(wsresult) {
		results.page = pageIndexForApi;
		results.page_size = pagesize;
		if (wsresult.success) {
			var d = wsresult.data;
			results.total_page = Math.ceil(d.recordCount / pagesize);
			results.status = 1;
			var projects = [];
			var project_url = "https://www.i-niuwa.com/newclient/productdetail?productId=";
			//console.log(d);
			for (var i = 0, len = d.pageResult.length; i < len; i++) {
				projects.push({
					name:d.pageResult[i].productname,
					total_amount:d.pageResult[i].loanamount,
					remain_amount:d.pageResult[i].remainamount,
					progress:d.pageResult[i].investprogress,
					year_return:(d.pageResult[i].yearincome+d.pageResult[i].addYield)/100,
					term:d.pageResult[i].investdate,
					term_unit:d.pageResult[i].investdatestandard=="day"?"天":"月",
					payback_way:"到期还本息",
					min_amount:d.pageResult[i].mininvest,
					apply_url:project_url+d.pageResult[i].productid,
					type:"债权标",
					releasedate:d.pageResult[i].releaseTime,
					invest_num:d.pageResult[i].countInvest,
					return_begin_at:"投资次日计息",
					completedate:d.pageResult[i].fullScallDate?d.pageResult[i].fullScallDate.split(" ")[0]:""
				});
			}
			results.project = projects;
			res.send(results);
		} else {
			results.status = -1;
			res.send(results);
		}
	});
});


//众牛网推广列表
router.get("/getListByZn", function(req, res, next) {
	var uinfo = {
		producttag: 1, //1-->新客专享、2-->优选计划、3-->宝宝精选  4--->债权转换
		pageIndex: 0, //页码
		pageSize: 2147483647, //每页数据多少
		popularizeDate:new Date()
	};
	var results = {};
	wsclient.ProductList(uinfo, function(wsresult) {
		if (wsresult.success) {
			var d = wsresult.data;
			results.status = 1;
			results.msg = "";
			if(d.pageResult){
				results.status = 0;
			}
			var projects=d.pageResult.reduce(function(projects,item){
				var status="0";
				if(item.fullScallDate){
					status=2;
				}else if(item.startsale&&new Date(item.startsale)<new Date()){
					status=1;
				}
				var amounted=item.loanamount-(item.remainamount||0);
				projects.push({
					pid:item.productid,
					status:status,//项目状态（0：预投标，1：投标中，2：投标结束）
					amounted:amounted,
					progress:item.investprogress
				});
				return projects;
			},[]);
			results.list = projects;
		} else {
			results.status = 2;
			results.msg="请求错误";
		}
		res.send(results);
	});
});


//众牛网推广详细
router.get("/getDataByZn/pid/:pid?", function(req, res, next) {
	var uinfo = {
		producttag: 1, //1-->新客专享、2-->优选计划、3-->宝宝精选  4--->债权转换
		productid: req.params.pid
	};
	var results = {};
	wsclient.detailsProduct(uinfo, function(wsresult) {
		var d = wsresult.data;
		if (wsresult.success&&d) {
			var project_url = "https://www.i-niuwa.com/newclient/productdetail?productId=";
			var detail="为了让新客户更好地了解平台流程，体验投资乐趣，牛娃金融特推出的供新客户投资的新牛专享产品。新牛专享可享双倍投资收益，除项目本身所产生的利息收益外，平台还另外给予同等收益的奖励。";

			var status="0";
			if(d.fullScallDate){
				status=2;
			}else if(d.startsale&&new Date(d.startsale)<new Date()){
				status=1;
			}
			var duration = d.investdatestandard=="day"?d.investdate/30:d.investdate;
			var guaranttype=d.guaranteemethod=="CAPITAL_INTEREST"?1:2;
			results.status=0;
			results.data = {
				pid: d.productid,
				name: d.productname,
				url:project_url+d.productid,
				//TODO 1:票据标;2:抵押标;3:担保标;4:保理标;5:融租标;6:信用标;7:债权标;
				type:7,
				yield: (d.yearincome+ d.addYield),
				duration:duration,
				repaytype:4,
				guaranttype:guaranttype,
				threshold: d.mininvest,
				status:status,
				amount: d.loanamount,
				amounted: d.loanamount-(d.remainamount||0),
				progress: d.investprogress,
				detail:[
					{"title":"计划介绍"},
					{"content":"为了让新客户更好地了解平台流程，体验投资乐趣，牛娃金融特推出的供新客户投资的新牛专享产品。新牛专享可享双倍投资收益，除项目本身所产生的利息收益外，平台还另外给予同等收益的奖励。"},
					{"image":"https://www.i-niuwa.com/imgs/zhu.jpg"},
					{"content":"注：该预期收益已扣除相关服务款项。"},

					{"title":"计划历程"},
					{"image":"https://www.i-niuwa.com/imgs/licheng.jpg"}
				],
				startdate: d.startsale?d.startsale.split(" ")[0]:"",
				enddate: d.endsale?d.endsale.split(" ")[0]:"",
				publishtime: d.pubtime
			};

			//results.data=d;

		} else if(!d){
			results.status = 2;
			results.msg="请求参数错误";
		}else{
			results.status = 2;
			results.msg="请求错误";
		}
		res.send(results);
	});
});

//2345推广
router.get("/getPopularizeList", function(req, res, next) {
	var underscore = require("underscore");

	wsclient.getPopularizeList({}, function(result) {
		underscore.each(result.data, function(obj) {
			switch (obj.tag) {
				case 0: //新牛
					obj.link = config.base.domain + "newclient/productdetail?productId=" + obj.productId + "&sid=1026&utm_source=2345-licai&utm_medium=nav&utm_campaign=hp";
					break;
				case 1: //懒牛
					obj.link = config.base.domain + "plan/productdetail?productId=" + obj.productId + "&sid=1026&utm_source=2345-licai&utm_medium=nav&utm_campaign=hp";
					break;
				case 2: //智牛
					obj.link = config.base.domain + "featured/productdetail?productId=" + obj.productId + "&sid=1026&utm_source=2345-licai&utm_medium=nav&utm_campaign=hp";
					break;
			}
			delete obj.tag;
			delete obj.productId;
		});
		res.send(result.data);
	});

});


//2345推广
router.get("/getHotPopularizeList", function(req, res, next) {
	var underscore = require("underscore");
	wsclient.getHotPopularizeList({}, function(result) {
		underscore.each(result.data.group, function(obj) {
			switch (obj.tag) {
				case 0: //新牛
					obj.url = config.base.domain + "newclient/productdetail?productId=" + obj.productId + "&sid=1026&utm_source=2345-licai&utm_medium=nav&utm_campaign=hp";
					break;
				case 1: //懒牛
					obj.url = config.base.domain + "plan/productdetail?productId=" + obj.productId + "&sid=1026&utm_source=2345-licai&utm_medium=nav&utm_campaign=hp";
					break;				
			}
			delete obj.tag;
			delete obj.productId;
		});
		res.send(result.data);
	});

});

//推广查询
router.get("/mpc/:i/:j", function(req, res, next) {

	wsclient.adsQuery({
		bengbeng: req.url.replace("/mpc", "")
	}, function(result) {
		res.send(result);
	});

});

//网贷之家--借款项目列表
router.get("/getloanProjectListBywdzj", function(req, res, next) {
	var query = req.query||{},results = {};
	var querydate=query.date,page=query.page,pageSize=query.pageSize;
	if(validateDate(querydate)&&validateNum(page)&&validateNum(pageSize)){
		var uinfo = {
			date: querydate,
			page: (page-1)*pageSize, 
			pageSize: pageSize
		};
		wsclient.queryLoanProject(uinfo, function(wsresult) {
			if (wsresult.success) {
				results=wsresult.data;
				results.currentPage=page;
				results.totalPage= Math.ceil(results.totalCount/pageSize);
			} else {
				results.msg="请求错误";
			}
			res.send(results);
		});
	}else{
		results.msg="请求参数错误";
		res.send(results);
	}
	
});


module.exports = router;


function validateDate(date){
	if(date==="undefined"||date==null){
		return false;
	}
	var reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;     
    var r = date.match(reg); 
	return reg.test(date);
}

function validateNum(num){
	if(num==="undefined"||num==null){
		return false;
	}
	var reg = /^[0-9]*$/;    
	console.log(num+"===="+reg.test(num));
    if(reg.test(num)&&num>0){
    	return true;
    }
	return false;
}