var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

router.all("/*",function(req, res, next){
	
	if(req.cookies.sign){
		res.appCreditVip={};
		res.appCreditVip.sign=req.cookies.sign;
		
	}
	
	next();
});
//信用达人
router.get("/index/:sign", function(req, res, next) {
	if(req.params.sign ){
		res.setHeader("Set-Cookie", ['sign='+req.params.sign+';path=/']);
		
	}
	return res.render("app/index");
});

//查找单个达人信息
router.get("/findOneCreditVip", function(req, res, next) {
	var custId=res.appCreditVip.vipid;
	wsclient.findOneCreditVip({
		sign:res.appCreditVip.sign,
		vipId:custId
	}, function(result) {
		return res.json(result);
	});
});
//查询达人、申请人基本信息
router.get("/findBase", function(req, res, next) {
	var custId=res.appCreditVip.vipid;
	wsclient.findBase({
		sign:res.appCreditVip.sign,
		custId:req.query.custId,
		jobType:req.query.jobType,//1：达人、2：申请人
		applyType:req.query.applyType
	}, function(result) {
		return res.json(result);
	});
});

router.get("/findList", function(req, res, next) {
	wsclient.findList({
		sign:res.appCreditVip.sign,
		applyType:req.query.applyType
	}, function(result) {
		return res.json(result);
	});
});
/*
//申请增加额度
router.get("/saveApplyAmt_money", function(req, res, next) {
	wsclient.saveApplyAmt({
		score:req.query.score,
		sign:res.appCreditVip.sign,
		vipId:req.query.vipid,
		type:2
	}, function(result) {
		return res.json(result);
	});
});
*/
//申请授信/增加额度
router.get("/saveApplyAmt", function(req, res, next) {
	wsclient.saveApplyAmt({
		sign:res.appCreditVip.sign,
		vipId:req.query.vipid,
		type:req.query.type
	}, function(result) {
		return res.json(result);
	});
});

//申请列表-申请  拒绝 通过
router.get("/findApplyList", function(req, res, next) {
	wsclient.findApplyList({
		sign:res.appCreditVip.sign,
		type:req.query.type||1
	}, function(result) {
		return res.json(result);
	});
});
//取消授信增额
router.get("/saveCancelAll",function(req, res, next){
	wsclient.saveCancelAll({
		sign:res.appCreditVip.sign,
		custId:req.query.custId
	}, function(result) {
		return res.json(result);
	});
});
//查询借款记录
router.get("/findLoanList", function(req, res, next) {
	wsclient.findLoanList({
		sign:res.appCreditVip.sign,
		custId:req.query.custid
	}, function(result) {
		return res.json(result);
	});
});
//同意授权/增额
router.get("/saveAgreeCredit", function(req, res, next) {
	wsclient.saveAgreeCredit({
		sign:res.appCreditVip.sign,
		id:req.query.id,
		score:req.query.score||0
	}, function(result) {
		return res.json(result);
	});
});
//拒绝授权/增额
router.get("/saveRefuseCredit", function(req, res, next) {
	wsclient.saveRefuseCredit({
		sign:res.appCreditVip.sign,
		id:req.query.id
	}, function(result) {
		return res.json(result);
	});
});

module.exports = router;