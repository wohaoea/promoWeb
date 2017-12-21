var express = require('express');
var router = express.Router();
var utils = require('../common/utils');
var wsclient = require('../common/wsclient');
var config = require('../config');


function wxShare(req, resObj, shareInfo, callback){
    var user = req.session.user;
    if( req.headers['user-agent'].indexOf("MicroMessenger") >= 0  ){
        resObj.isWX = true;
        wsclient.WeiXinjsapi_ticket(function(result){
            var crypto = require('crypto');
            var timestamp = new Date().getTime();
            var noncestr = Math.random().toString(36).substr(2);
            var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url="+ config.base.wxshareurl + req.originalUrl;
            var shasum = crypto.createHash('sha1');
            shasum.update(content);
            resObj.signature = shasum.digest('hex');
            resObj.appId = config.base.wxappid;
            resObj.timestamp = timestamp;
            resObj.noncestr = noncestr;

            resObj.shareTitle = shareInfo.title;
            resObj.shareDesc = shareInfo.desc;
            resObj.shareLink = config.base.wxshareurl + shareInfo.link;
            resObj.shareImgUrl = config.base.wxshareurl + shareInfo.imgUrl;

            callback(resObj)
        });
    }else{
        resObj.isWX = false;
        callback(resObj)
    }
};

/**牛娃推广页**/
router.get('/niuwa',function( req, res, next ){
    var result = {
        downloadurl:'http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.app.android',
        inviterId:req.query.inviterId
    };
    var sid = req.query.sid;
    if( !sid ){
        res.redirect("/notfound");
        return;
    }
    var shareInfo = {
        title:'牛娃互联网金融',
        desc:'随时随地投资 时时刻刻钱生钱',
        link:'/generalize/niuwa?inviterId='+req.query.inviterId,
        imgUrl:'/imgs/account/niuwa-logo.png'
    };
    wxShare(req, result, shareInfo, function(data){
        res.render('generalize/niuwa',data);
    },shareInfo);
});

/**为牛呗风控审核不过的用户推荐其它借款渠道**/
router.get('/otherTrench',function(req, res, next){
    res.render('generalize/trench');
});

/**流量银行着陆页**/
router.get('/freeFlow',function(req, res, next){
    res.render('generalize/free_flow',{ promodomain:config.base.promodomain});
});



module.exports = router;