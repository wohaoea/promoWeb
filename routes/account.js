var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var enumeration = require('../common/enumeration');

/**登录页**/
router.get("/login", function(req, res, next) {
    wxShare(req, {}, function(data){
        res.render('account/login',data);
    })
});
/**登录**/
router.post("/login", function(req, res, next) {
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
            res.send(utils.getSuccessResult(null, ''));
        } else {
            res.send(utils.getFailResult(wsresult.msg, "", "", "login"));
        }
    });
});


/**注册页**/
router.get("/register", function(req, res, next) {
    wxShare(req, {}, function(data){
        res.render('account/register',data);
    })
});

/**找回密码**/
router.get("/findPwd", function(req, res, next) {
    var user  = req.session.userInfo;
    if(!user){
        return wxShare(req, {certAuth:'N',
            safeProblem:'N',
            safeProblemObj:{
                key:'',
                value:''
            }}, function(data){
            res.render('account/findpassword',data);
        })
    }
    wsclient.safeProblemLoad({
        custId:user.userid
    },function(results){
        if (!results.success) {
            return res.send(results.data);
        }
        var safeProbleKey;
        if(results.data.safeProblem=="Y"){
            //有安全问题
            var safeProblemList = results.data.safeProblemList;
            safeProbleKey = safeProblemList[Math.floor(Math.random()*safeProblemList.length)];
        }
        wxShare(req, {
            starTel:user.starPhone,
            certAuth:results.data.certAuth,
            safeProblem:results.data.safeProblem,
            safeProblemObj:enumeration.getsafeProblem(safeProbleKey)
        }, function(data){
            res.render('account/findpassword',data);
        });
    });
});

/**验证手机是否存在**/
router.post("/checkMobile",function(req,res){
    var mobile = req.body.mobile;
    var result = {};
    wsclient.getCustByPhone({
       mobile: mobile
    },function(json1){
        result.mobileResult = json1;
        if(json1.success){
            req.session.tmpUserInfo = {
                mobile:mobile,
                custId:json1.data.custId
            };
            wsclient.safeProblemLoad({
                custId:json1.data.custId
            },function(json2){
                var safeProbleKey;
                var safeProblemResult = {
                    certAuth:json2.data.certAuth,
                    safeProblem:json2.data.safeProblem
                };
                if(json2.data.safeProblem=="Y"){
                    //有安全问题
                    var safeProblemList = json2.data.safeProblemList;
                    safeProbleKey = safeProblemList[Math.floor(Math.random()*safeProblemList.length)];
                    safeProblemResult.safeProblemObj = enumeration.getsafeProblem(safeProbleKey)
                }
                result.safeProblemResult = safeProblemResult;
                res.send(result);
            });
        }else{
            res.send(result);
        }
    });
});
/**忘记密码发送短信**/
router.post("/sendShortMsg",function(req,res,next){
    var user  = req.session.tmpUserInfo;
    var sendMobileCodeTime = req.session.sendMobileCodeTime;
    var count =  60;
    var second = sendMobileCodeTime?(count-(new Date().getTime() - new Date(sendMobileCodeTime).getTime())/1000):null;
    second = parseInt(second);
    if(sendMobileCodeTime && second>0){
        res.send({
            success:false,
            msg:"一分钟内只允许发送一次验证码",
            second:second
        });
    }else{
        req.session.sendMobileCodeTime = new Date();
        wsclient.sendRegVaildNo({
            pnumber: req.body.mobile,
            ptype: 'mcode',
            custId: user.custId,
            actType: "3"
        },function(results){
            delete results.data;
            res.send(results);
        });
    }
});

/**安全问题验证**/
router.post("/pwdProblemCheck",function(req,res,next){
    var user  = req.session.tmpUserInfo;
    wsclient.pwdProblemCheck({
        custId:user.custId,
        mobile:req.body.mobile,
        certNo:req.body.certNo,
        mobileCode:req.body.msgCode,
        dictCode:req.body.dictCode,
        answer:req.body.answer
    },function(result){
        res.send(result);
    });
});


/**重置密码**/
router.get("/findPwd/reset", function(req, res, next) {
    wxShare(req, {}, function(data){
        res.render('account/findpwdstep2',data);
    });
});

/**重置密码提交**/
router.post("/passwordreset",function (req, res, next) {
    var user = req.session.tmpUserInfo;
    wsclient.passwordreset({
        custId:user.custId,
        newPassword:req.body.newPassword,
        newPassword2:req.body.newPassword2
    },function(results){
        res.send(results);
    });
});

/**密码修改成功**/
router.get("/findPwd/modifySuccess", function(req, res, next) {
    wxShare(req, {}, function(data){
        res.render('account/modify_success',data);
    });
});

function wxShare(req, resObj, callback, shareInfo){
    var user = req.session.user;
    if( req.headers['user-agent'].indexOf("MicroMessenger") >= 0  ){
        resObj.isWX = true;
        wsclient.WeiXinjsapi_ticket(function(result){
            var crypto = require('crypto');
            var timestamp = new Date().getTime();
            var noncestr = Math.random().toString(36).substr(2);
            var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url="+ config.base.wxshareurl + req.originalUrl
            var shasum = crypto.createHash('sha1');
            shasum.update(content);
            resObj.signature = shasum.digest('hex');
            resObj.appId = config.base.wxappid;
            resObj.timestamp = timestamp;
            resObj.noncestr = noncestr;
            if(shareInfo){
                resObj.shareTitle = shareInfo.title;
                resObj.shareDesc = shareInfo.desc;
                resObj.shareLink = config.base.wxshareurl + shareInfo.link;
                resObj.shareImgUrl = config.base.wxshareurl + shareInfo.imgUrl;
            }else{
                resObj.shareTitle = '邀请好友送现金一起壕';
                resObj.shareDesc = '推荐好友投资，立享百元奖励';
                resObj.shareLink = config.base.wxshareurl + "/account/invitereg/" + (user?user.custId:'g');
                resObj.shareImgUrl = config.base.wxshareurl + "/imgs/account/share.jpg";
            }
            callback(resObj)
        });
    }else{
        resObj.isWX = false;
        callback(resObj)
    }
}
/**未登录的活动首页**/
router.get("/invite", function(req, res, next) {
    var user = req.session.user;
    var resObj = {
        user : user,
        isWX: false
    };
    wxShare(req, resObj, function(data){
        res.render('account/invite',data);
    })
});

/**分享的邀请页**/
router.get("/invitereg/:inviterId", function(req, res, next) {
    var inviterId = req.params.inviterId;
    wsclient.selectRecomInfoById({
        id: inviterId
    },function(json){
        var result = {
            inviteCode:'',
            isValid:false
        };
        if (json.success) {
            if(json.data.mobile){
                result.inviteCode = json.data.mobile;
                result.isValid = true;
            }else if(json.data.loginName){
                result.inviteCode = json.data.loginName;
                result.isValid = true;
            }
        }
        wxShare(req, result, function(rjson){
            res.render('account/invitereg',rjson);
        })
    });
});

/**判断是否开户**/
router.post('/isOpenAccount',function(req,res){
    var user = req.session.user;
    wsclient.userAuthInfo({
        custId: user.custId
    }, function(wsresult) {
        if (wsresult.success) {
            var isAuth = wsresult.data.fundAccount.openStatus == 'Y' ? true : false; //是否绑定资金账户
            wsresult.isAuth = isAuth;
        }
        res.send(wsresult);
    })
});

/**实名认证**/
router.get("/identityAuth", function(req, res, next) {
    wxShare(req, {}, function(rjson){
        res.render('account/identity_auth',rjson);
    })
});

/**实名认证**/
router.post("/certAuth", function(req, res, next) {
    var user = req.session.user;
    if( user ){
        wsclient.certAuth({
            custId: user.custId,
            // idCardType: "G2_IDCARD",
            // ext: "t=shimingrenzheng",
            transChl:'H5',
            realName: req.body.realName,//汇付需要,切换新网的时候去掉
            idCardNo: req.body.idCardNo,//汇付需要,切换新网的时候去掉
            //mobile: user.phoneNumber//汇付需要,切换新网的时候去掉
            userRole: "1"
        },function (wsresult) {
            if(wsresult.success){
                wsresult.data.message = decodeURIComponent(wsresult.data.message);
                wsresult.data.message = utils.dataConvert(wsresult.data.message);
            }
            res.send(wsresult);
        });
    }else{
        res.send({url:"/account/login"});
    }
});

/**推广页**/
router.get("/generalize",function(req, res, next){
    var result = {
        downloadurl:'',
        inviterId:req.query.inviterId,
        hasInvite:true
    };
    if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
        result.downloadurl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android&g_f=991653";
    } else {
        if (utils.delectOS(req) == "IOS") {
            result.downloadurl = "https://itunes.apple.com/cn/app/id998444014?mt=8";
        } else {
            result.downloadurl = "https://ms.i-niuwa.com/file/downLoad?path=pl_niubei.apk";
        }
    }
    var shareInfo = {
        title:'牛呗借款--分分钟到账',
        desc:'灵活额度，超低利率，轻松还款无压力',
        link:'/account/generalize?inviterId='+req.query.inviterId+(req.query.sid?"&sid="+req.query.sid:""),
        imgUrl:'/imgs/niubei-logo.png'
    };
    wxShare(req, result, function(data){
        res.render('account/generalize',data);
    },shareInfo);
});


module.exports = router;