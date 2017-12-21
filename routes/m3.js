var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");

router.get("/niubei", function(req, res, next) {
	//res.render("m3/niubei");
	res.render("m3/niubeiNew");
});

router.get("/niubeiLoan", function(req, res, next) {
    var result = {
        downloadurl:'',
        inviterId:req.query.inviterId,
        hasInvite:['2003', '2024', '2025'].indexOf(req.session.regSource)>=0,
        isWX:false
    };
    if (utils.delectOS(req) == "IOS") {
        result.downloadurl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android";
    } else {
        result.downloadurl = "https://ms.i-niuwa.com/file/downLoad?path=pl_niubei.apk";
    }
    res.render('account/generalize',result);
});
//上海白领嘉年华
router.get("/jianianhua", function(req, res, next){
	res.render("m3/jianianhua");
});
module.exports = router;