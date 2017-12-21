var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
var messages = require('../common/messages');
var path = require("path");
var logger = require("../common/logger");
var user = require("./user");
var querystring = require("querystring");
var async = require("async");
router.all('/*', function(req, res, next) {
    if (config.base.acceptedHosts) {
        if (req.headers['host']) {
            //var matchResult = req.headers['host'].match(/^(\S*)p2ppub\.com(\S*)$/);
            // console.log(req.headers['host']+'============')
            var matchResult = req.headers['host'].indexOf(config.base.acceptedHosts);
            var originalUrl = req.originalUrl.substring(1);
            if (!req.query["vsliajdfasldfjlz"])
                if (matchResult != -1) {
                    return res.redirect(config.base.promodomain + originalUrl);
                }
        }
    }
    var regSource = req.query.sid;
    //var queryString
    if (regSource) {
        req.session.regSource = regSource.length > 4 ? "" : regSource;
    }

    var queryString = (req.url.split("?")[1]) || '';
    if (queryString != '' && req.query.sid) {
        req.session.queryString = querystring.unescape(queryString);
        if (req.headers['referer']) {
            var qs = querystring.parse(req.headers['referer']);
            if (qs.wd) {
                req.session.queryString = req.session.queryString + "&wd=" + qs.wd;
            }
            if (qs.oq) {
                req.session.queryString = req.session.queryString + "&oq=" + qs.oq;
            }
        }
    }
    var url = req.url;
    if (url.indexOf('/huixiangshenghuo_checktogo') < 0 && url.indexOf('/product/instantInvest') < 0 && url.indexOf('weberror') < 0 && url.indexOf('undefined') < 0 && url.indexOf('/getReadCountAndLikeCount') < 0 && url.indexOf('/updateReadCount') < 0 && url.indexOf('/updateLikeCount') < 0 && url.indexOf('/baidumap') < 0 && url.indexOf('/share/') < 0 && url.indexOf('/pla/') < 0 && url.indexOf('/pra/') < 0 && url.indexOf('/js') < 0 && url.indexOf('/imgs') < 0 && url.indexOf('/css') && url.indexOf('/protrcol') < 0 && url.indexOf('/login') < 0 && url.indexOf('/getimg') < 0 && url.indexOf('/buyback') < 0 && url.indexOf('/forgotpasswordstepthree') < 0 && url.indexOf('/forgotpasswordsteptwo') < 0 && url.indexOf('/forgotpasswordstepfour') < 0) {
        //uba.ubaTracer(req);
        if (req.query.pageUrl) {

        } else {
            req.session.lastURL = url;
        }

        var queryString = (req.originalUrl.split("?")[1]) || '';
        if (queryString != '' && req.query.sid) {
            req.session.queryString = querystring.unescape(queryString);
            if (req.headers['referer']) {
                var qs = querystring.parse(req.headers['referer']);
                if (qs.wd) {
                    req.session.queryString = req.session.queryString + "&wd=" + qs.wd;
                }
                if (qs.oq) {
                    req.session.queryString = req.session.queryString + "&oq=" + qs.oq;
                }
            }
        }

    }
    /**
     *  牛呗抽奖活动精美水杯
     */
    if (!req.session.luckDraw || req.session.luckDraw.luckDrawTime.end !== config.luckDrawTime.end) {
        // 如果session没有luckDraw或者session中的幸运抽奖送水杯活动结束时间与配置不一样
        req.session.luckDraw = {};
        req.session.luckDraw.luckDrawTime = config.luckDrawTime;
        req.session.luckDraw.luckDrawTime.now = new Date().getTime();
        req.session.luckDraw.show = 1;
        
    } else {
        req.session.luckDraw.luckDrawTime.now = new Date().getTime();
    }

    if(req.session.luckDraw.luckDrawTime.now > req.session.luckDraw.luckDrawTime.end){
        // 超出活动时间
        req.session.luckDraw.isEnd = true;
        req.session.luckDraw.awardList = ['免利息30天', '现金券8元', '免本金50%', '现金券58元', '免本金25%', '流量包10M', '谢谢参与', '流量包100M']
    }else{
        // 方便测试改时间
        req.session.luckDraw.awardList = ['免利息30天', '现金券8元', '免本金50%', '现金券58元', '免本金25%', '流量包10M', '精美水杯', '流量包100M'];
        req.session.luckDraw.isEnd = false;  //精美水杯活动是否结束。false未结束，true已结束
    }

    /*福袋活动写session*/
    if (!req.session.fudai) {
        req.session.fudai = {};
        req.session.fudai.fudaiTime = config.fudaiTime;
        req.session.fudai.fudaiTime.now = new Date().getTime();
        req.session.fudai.closebtnon = 1;

    } else {
        req.session.fudai.fudaiTime.now = new Date().getTime();
    }
    /*国庆加息活动写session*/
    if (!req.session.guoqing) {
        req.session.guoqing = {};
        req.session.guoqing.guoqingTime = config.guoqingTime;
        req.session.guoqing.guoqingTime.now = new Date().getTime();
        req.session.guoqing.closebtnon = 1;

    } else {
        req.session.guoqing.guoqingTime.now = new Date().getTime();
    }
    var loginIP = utils.getClientIp(req);
    if (utils.isNull(loginIP)) {
        res.send(utils.getFailResult('异常请求，请联系客服。'));
    } else {
        next();
    }
    
});

/*
 *获取IMG
 */
router.get(/^\/share\/([\w\/\.\-\_]+)$/, function(req, res, next) {
    if (!req.params[0]) {
        res.send("无此图片");
    }
    var imgid = req.params[0];
    /* console.log(imgid+'');*/
    var accessPath = "/share/";

    var fs = require("fs");
    fs.readFile(accessPath + imgid, function(err, data) {
        if (data) {
            /*res.write(data, "binary");
             res.end();*/
            res.writeHead(200, {
                'Content-Type': 'image/jpeg'
            });
            res.end(data);
        } else {
            res.send("图片不存在");
        }
    });

});

router.get("/reg/:custId?", function(req, res, next) {

    var resobj = {
        loginName: "",
        signature: "",
        timespan: "",
        noncestr: "",
        dom: config.base.domain,
        h5domain: config.base.h5domain
    }
    req.session.sid = req.query.sid ? req.query.sid : "";
    var imgid = "/imgs/headb-02-04.jpg";

    if (req.params.custId) {
        wsclient.selectRecomInfoById({
            id: req.params.custId
        }, function(wsresult) {
            if (wsresult.success) {
                wsclient.WeiXinjsapi_ticket(function(result) {
                    var crypto = require('crypto');
                    var timespan = new Date().getTime();
                    var noncestr = Math.random().toString(36).substr(2);
                    var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.url
                    var shasum = crypto.createHash('sha1');
                    shasum.update(content);
                    resobj.loginName = wsresult.data.loginName;
                    resobj.signature = shasum.digest('hex');
                    resobj.timespan = timespan;
                    resobj.noncestr = noncestr;
                    resobj.custId = req.params.custId;
                    resobj.imgid = imgid;
                    res.render('m/h5reg', resobj);
                });
                /*resobj.loginName = wsresult.data.loginName;
                 res.render('reg', {loginName:wsresult.data.loginName,custId:req.params.custId});*/
            }
        });
    } else {
        wsclient.WeiXinjsapi_ticket(function(result) {
            var crypto = require('crypto');
            var timespan = new Date().getTime();
            var noncestr = Math.random().toString(36).substr(2);
            var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.url
            var shasum = crypto.createHash('sha1');
            shasum.update(content);
            resobj.loginName = "";
            resobj.signature = shasum.digest('hex');
            resobj.timespan = timespan;
            resobj.noncestr = noncestr;
            resobj.custId = "";
            resobj.imgid = imgid;
            res.render('m/h5reg', resobj);
        });
        /*res.render('reg', {loginName:"",custId:""});*/
    }
});



//铁路推广
router.get("/regwifi/:custId?", function(req, res, next) {

    var resobj = {
        loginName: "",
        signature: "",
        timespan: "",
        noncestr: "",
        dom: config.base.domain,
        h5domain: config.base.h5domain
    }
    req.session.sid = req.query.sid ? req.query.sid : "";
    var imgid = "/imgs/headb-02-04.jpg";

    if (req.params.custId) {

        wsclient.selectRecomInfoById({
            id: req.params.custId
        }, function(wsresult) {
            if (wsresult.success) {
                wsclient.WeiXinjsapi_ticket(function(result) {
                    var crypto = require('crypto');
                    var timespan = new Date().getTime();
                    var noncestr = Math.random().toString(36).substr(2);
                    var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.url
                    var shasum = crypto.createHash('sha1');
                    shasum.update(content);
                    resobj.loginName = wsresult.data.loginName;
                    resobj.signature = shasum.digest('hex');
                    resobj.timespan = timespan;
                    resobj.noncestr = noncestr;
                    resobj.custId = req.params.custId;
                    resobj.imgid = imgid;
                    res.render('m/h5reg_wifi', resobj);
                });
                /*resobj.loginName = wsresult.data.loginName;
                 res.render('reg', {loginName:wsresult.data.loginName,custId:req.params.custId});*/
            } else {
                resobj.loginName = wsresult.data.loginName;
                res.render('m/h5reg_wifi', resobj);
            }
        });
    } else {
        wsclient.WeiXinjsapi_ticket(function(result) {
            var crypto = require('crypto');
            var timespan = new Date().getTime();
            var noncestr = Math.random().toString(36).substr(2);
            var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.url
            var shasum = crypto.createHash('sha1');
            shasum.update(content);
            resobj.loginName = "";
            resobj.signature = shasum.digest('hex');
            resobj.timespan = timespan;
            resobj.noncestr = noncestr;
            resobj.custId = "";
            resobj.imgid = imgid;
            res.render('m/h5reg_wifi', resobj);
        });
        /*res.render('reg', {loginName:"",custId:""});*/
    }
});


//学信网获取验证码
router.get("/chsigetcode", function(req, res, next) {
    res.render("chsigetcode");
});

//充值说明
router.get("/chongzhi", function(req, res, next) {
    res.render('chongzhi');
});

//提现说明
router.get("/tixian", function(req, res, next) {
    res.render('tixian');
});

//红包说明
router.get("/hongbao", function(req, res, next) {
    res.render('hongbao');
});

//借款说明
router.get("/jiekuan", function(req, res, next) {
    res.render('jiekuan');
});

//帮助中心
router.get("/help", function(req, res, next) {
    res.render('help');
});
/**新网说明页**/
router.get(/^\/xwExplain\/.*/,function(req,res){
    var url = req.path;
    var type = url.slice(11, url.length);
    var title = null;
    switch (type) {
        case 'card':
            title = '银行卡管理说明';
            break;
        case 'recharge':
            title = '充值说明';
            break;
        case 'withdraw':
            title = '提现说明';
            break;
        case 'reward':
            title = '奖励说明';
            break;
        case 'borrowing':
            title = '借款说明';
            break;
        case 'repayment':
            title = '还款说明';
            break;
        case 'amount':
            title = '额度说明';
            break;
    }
    var sign = req.query.sign;
    if( type == 'withdraw' ){
        if (!sign) {
            sign = '';
            wsclient.withdrawTypeGet({

            },function(result){
                var withdrawType = result.data.withdrawType;
                res.render('xw_explain', { type: type, title: title , withdrawType:withdrawType });
            })
        }else{
            wsclient.findOneBySign({
                "head": {
                    "sign": sign
                },
                "con": {

                }
            }, function(result) {
                if (result.head.st == 0) {
                    wsclient.accountFund({
                        custId: result.body.custId
                    }, function(wsresult) {
                        wsclient.withdrawTypeGet({
                            "platform":"PC",
                            "acctNo": wsresult.data.accountNo
                        },function(result){
                            var withdrawType = result.data.withdrawType;
                            res.render('xw_explain', { type: type, title: title , withdrawType:withdrawType });
                        })
                    })
                }else{
                    res.send(result.head.msg)
                }
            })
        }
        
    }else{
        res.render('xw_explain', { type: type, title: title });
    }
});

//汇付说明页
router.get(/^\/huifuExplain\/.*/, function(req, res, next) {
    var url = req.originalUrl;
    var type = url.slice(14, url.length);
    var title = null;
    switch (type) {
        case 'card':
            title = '银行卡管理说明';
            break;
        case 'recharge':
            title = '充值说明';
            break;
        case 'withdraw':
            title = '提现说明';
            break;
        case 'unwrap':
            title = '解绑说明';
            break;
    }
    res.render('huifu_explain', { type: type, title: title });
});

/*手机端分享跳转*/
router.get("/niuwashare", function(req, res, next) {
    var os = utils.delectOS(req);
    var derectUrl = '';
    os = "Android";
    if (os == "IOS") {
        derectUrl = "https://itunes.apple.com/cn/app/huang-you-xiang-ji/id587176822?mt=8";
    } else if (os == "Android") {
        derectUrl = "http://gdown.baidu.com/data/wisegame/0e428543f8ce300c/xianshimianfei_128.apk";
    }

    var varobj = {
        os: os,
        derectUrl: derectUrl
    }

    res.render('niuwashare', varobj);
});

//报名页
//router.get("/signup", function(req, res, next) {
//	res.render('signup');
//});

//手机验证
// router.get("/mobilecheck", function(req, res, next) {
// 	var phone = req.query.phone;
// 	res.send({
// 		success: true,
// 		phone: phone
// 	});
// });

//报名保存
// router.post("/signupsave", function(req, res, next) {
// 	var signdata = {
// 		figure: req.query.figure,
// 		reason: req.query.reason,
// 		username: req.query.username,
// 		school: req.query.school,
// 		phone: req.query.phone,
// 		address: req.query.address
// 	};

// 	res.send({
// 		success: true
// 	});
// });

/*手机注册成功*/
router.get("/succereg", function(req, res, next) {
    var result = {};
    result.sid = req.session.sid;
    req.session.sid = "";
    res.render('succreg', result);
});
/*报名成功*/
router.get("/succesign", function(req, res, next) {
    res.render('succsignup');
});
/*条款*/
router.get("/clause", function(req, res, next) {
    res.render('clause');
});
/*注册协议*/
router.get("/clause2", function(req, res, next) {
    res.render('clause2');
});
/*线上借款服务*/
router.get("/loan_agreement", function(req, res, next) {

    var username = req.query.username;
    var usercard = req.query.usercard;
    var varobj = {};
    varobj.username = username;
    varobj.usercard = usercard;
    //}
    res.render('loan_agreement', varobj);
});

/*借款人居间服务*/
router.get("/service_agreement", function(req, res, next) {
    res.render('service_agreement');
});



/*
 * 提交注册用户信息。
 */
router.post('/register', function(req, res, next) {
    var queryString = req.session.queryString || '';
    var uname = req.body.uname,
        pswd = req.body.pswd,
        pswdagn = req.body.pswdagn,
        pcode = req.body.pcode,
        vcode = req.body.vcode,
        captchacode = req.body.captchacode || '';
    mobile = req.session.mobileCode.pnumber;
    pcode = pcode ? pcode : null;
    console.log('推广页面注册 sid=' + req.session.regSource + '----------------------' + 'queryString=' + queryString);
    var uinfo = {
        loginName: uname,
        loginPassword: pswd,
        pswdagn: pswdagn,
        recommendCode: pcode, //邀请码
        mobile: mobile, //手机号码
        regType: "2",
        regOs: utils.delectOS(req),
        regDevice: utils.platSource(req),
        belongPlatform: "P2P",
        loginIp: utils.getClientIp(req),
        regSource: req.session.regSource || "",
        queryString: queryString
    };
    if (utils.isNull(uinfo.loginIp)) {
        logger.info('Invalid login ip : ', uinfo);
        res.send(utils.getFailResult('异常请求，请联系客服。'));
    } else if (utils.isNull(uname)) {
        res.send(utils.getFailResult(messages.loginNameIsNull));
    } else if (utils.isNull(pswd) || utils.isNull(pswdagn)) {
        res.send(utils.getFailResult(messages.passwordIsNull));
    } else if (pswd != pswdagn) {
        res.send(utils.getFailResult(messages.passwordDifference));
    } else if (req.session.mobileCode.pnumber != mobile || req.session.mobileCode.code != vcode) {
        return res.send(utils.getFailResult(messages.vcodeNotCorrect));
    } else if (!req.session.captcha || req.session.captcha.code.toUpperCase() != captchacode.toUpperCase()) {
        logger.info('---------' + req.session.captcha.code);
        return res.send(utils.getFailResult("校验码不正确"));
    } else {

        //invoke webservice
        wsclient.createCustomer(uinfo, function(wsresult) {
            if (wsresult.success) {
                //创建并保存session
                utils.createSession({
                    loginname: uname,
                    custId: wsresult.data.id,
                    mobile: mobile
                }, req, res);
                req.session.mobileCode = null;
                req.session.captcha = null;
                req.session.uservalidphonetime = new Date().getTime();
                res.send(utils.getSuccessResult(null, ''));
            } else {
                res.send(utils.getFailResult(wsresult.msg));
            }
        });
    }
});

/*
 * 提交pc着陆页注册用户信息。
 */
router.post('/pcmarketreg', function(req, res, next) {

    if (req.body.regmarket == 'reg3') {
        req.session.regSource = '1116';
    }
    var queryString = req.session.queryString || '';
    var pswd = req.body.pswd,
        vcode = req.body.vcode,
        captchacode = req.body.captchacode || '';
    mobile = req.body.mobile;
    pcode = req.body.pcode ? req.body.pcode : null;
    var uinfo = {
        loginPassword: pswd,
        recommendCode: pcode, //邀请码
        mobile: mobile, //手机号码
        regType: "4",
        regOs: utils.delectOS(req),
        regDevice: utils.platSource(req),
        belongPlatform: "P2P",
        loginIp: utils.getClientIp(req),
        regSource: req.session.regSource || "",
        queryString: queryString
    };
    if (!req.session.mobileCode) {
        return res.send(utils.getFailResult("手机验证码过期请重新获取", "", "", "vcode"));
    }
    if (!req.session.captcha) {
        return res.send(utils.getFailResult("图片校验码过期请重新获取", "", "", "captchacode"));
    }
    if (utils.isNull(uinfo.loginIp)) {
        logger.info('Invalid login ip : ', uinfo);
        res.send(utils.getFailResult('异常请求，请联系客服。', '', '', "xieyi"));
    } else if (req.session.mobileCode.pnumber != mobile) {
        return res.send(utils.getFailResult("手机号有更改请重新获取手机验证码", "", "", "moble"));
    } else if (utils.isNull(pswd)) {
        res.send(utils.getFailResult(messages.passwordIsNull, "", "", "psd"));
    } else if (req.session.mobileCode.code != vcode) {
        return res.send(utils.getFailResult(messages.vcodeNotCorrect, "", "", "vcode"));
    } else if (!req.session.captcha || req.session.captcha.code.toUpperCase() != captchacode.toUpperCase()) {
        logger.info('---------' + req.session.captcha.code);
        return res.send(utils.getFailResult("图片校验码不正确", '', '', 'captchacode'));
    } else {

        //invoke webservice
        wsclient.createCustomer(uinfo, function(wsresult) {
            if (wsresult.success) {
                //创建并保存session
                utils.createSession({
                    loginname: wsresult.data.loginName,
                    custId: wsresult.data.id,
                    mobile: mobile
                }, req, res);
                req.session.mobileCode = null;
                req.session.captcha = null;
                req.session.uservalidphonetime = new Date().getTime();
                res.send(utils.getSuccessResult(null, ''));
            } else {
                res.send(utils.getFailResult(wsresult.msg, '', '', 'xieyi'));
            }
        });
    }
});

/*
 * 提交pc着陆页注册用户信息。
 */
router.post('/regformarket', function(req, res, next) {
    var queryString = req.session.queryString || '';
    var pswd = req.body.pswd,
        vcode = req.body.vcode,
        captchacode = req.body.captchacode || '';
    mobile = req.body.mobile;
    pcode = req.body.pcode ? req.body.pcode : null;
    var uinfo = {
        loginPassword: pswd,
        recommendCode: pcode, //邀请码
        mobile: mobile, //手机号码
        regType: "4",
        regOs: utils.delectOS(req),
        regDevice: utils.platSource(req),
        belongPlatform: "P2P",
        loginIp: utils.getClientIp(req),
        regSource: req.session.regSource || "",
        queryString: queryString
    };
    if (!req.session.mobileCode) {
        return res.send(utils.getFailResult("手机验证码过期请重新获取", "", "", "vcode"));
    }
    if (!req.session.captcha) {
        return res.send(utils.getFailResult("图片校验码过期请重新获取", "", "", "captchacode"));
    }
    if (utils.isNull(uinfo.loginIp)) {
        logger.info('Invalid login ip : ', uinfo);
        res.send(utils.getFailResult('异常请求，请联系客服。', '', '', "xieyi"));
    } else if (req.session.mobileCode.pnumber != mobile) {
        return res.send(utils.getFailResult("手机号有更改请重新获取手机验证码", "", "", "moble"));
    } else if (utils.isNull(pswd)) {
        res.send(utils.getFailResult(messages.passwordIsNull, "", "", "psd"));
    } else if (req.session.mobileCode.code != vcode) {
        return res.send(utils.getFailResult(messages.vcodeNotCorrect, "", "", "vcode"));
    } else if (!req.session.captcha || req.session.captcha.code.toUpperCase() != captchacode.toUpperCase()) {
        logger.info('---------' + req.session.captcha.code);
        return res.send(utils.getFailResult("图片校验码不正确", '', '', 'captchacode'));
    } else {

        //invoke webservice
        wsclient.createCustomer(uinfo, function(wsresult) {
            if (wsresult.success) {
                //创建并保存session
                utils.createSession({
                    loginname: wsresult.data.loginName,
                    custId: wsresult.data.id,
                    mobile: mobile
                }, req, res);
                req.session.mobileCode = null;
                req.session.captcha = null;
                req.session.uservalidphonetime = new Date().getTime();
                res.send(utils.getSuccessResult(null, ''));
            } else {
                res.send(utils.getFailResult(wsresult.msg, '', '', 'xieyi'));
            }
        });
    }
});
router.get("/notfound", function(req, res, next) {
    res.render("notfound");

});

router.get("/error", function(req, res, next) {
    res.render("error");

});

/*验证图片验证码是否正确*/

router.post('/pla/generatecaptchareg', function(req, res, next) {
    validateCaptcha(req, res, next);
});

/*
 * 生成图形验证码。
 */
router.get('/pla/generatecaptchareg', function(req, res, next) {

    var uinfo = {
        sessionid: req.session.id
    };
    //将验证码保存在session中
    var captcha = {
            code: '',
            time: new Date().getTime()
        }
        //invoke webservice
    wsclient.generateCaptcha(uinfo, function(wsresult) {
        if (wsresult.success) {
            //将验证码保存在session中
            var captcha = {
                code: wsresult.data.radomStr,
                time: new Date().getTime()
            }
            req.session.captcha = captcha;
            //将图片返回给页面
            var buffer = new Buffer(wsresult.data.base64String, 'base64');
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


/*
 * 检查注册用户登录名是否有效。
 */
router.post('/pla/checkloginname', function(req, res, next) {
    var uname = req.body.uname;
    var uinfo = {
        loginname: uname
    };
    //invoke webservice
    wsclient.checkLoginName(uinfo, function(wsresult) {
        if (wsresult.success) {
            res.send(utils.getSuccessResult());
        } else {
            res.send(utils.getFailResult(wsresult.msg));
        }
    });
});
/*
 * 发送手机验证码。
 */
router.post('/pla/generatemobilecode', function(req, res, next) {

    if (req.session.captcha == null || req.body.icode == null || req.session.captcha.code.toLowerCase() != req.body.icode.toLowerCase()) {
        return res.send(utils.getFailResult("图形验证码不正确", "", "", "captchacode"));
    }

    var pnumber = req.body.pnumber;
    /*if (req.session.uservalidphonetime && req.session.uservalidphonetime + 60000 >= new Date().getTime()) {
     res.send(utils.getFailResult("一分钟内只允许发送一次验证码","","","1"));
     return;
     }*/
    req.session.uservalidphonetime = new Date().getTime();
    if (req.session.curtime) {
        req.session.curtime = req.session.curtime + 1;
    } else {
        req.session.curtime = 1;
    }
    if (req.session.curtime > 4) {
        res.send(utils.getFailResult("请联系牛娃金融客服进行人工手机认证", "", "", "1"));
        return
    } else {
        var uinf1 = {
            pnumber: pnumber,
            ptype: 2,
            custId: null
        };
        //invoke webservice
        wsclient.validateBindPhoneNo(uinf1, function(wsresult) {
            if (wsresult.success) {
                req.session.markphoneNum = pnumber;
                var uinfo = {
                    pnumber: pnumber,
                    ptype: 'mcode',
                    custId: null,
                    actType: 2 // 固定值 ： 2代表绑定，3代表验证原始手机号，4代表验证新手机号
                };
                if (utils.isNull(pnumber)) {
                    logger.error('Invalid input parameter : ', uinfo);
                    res.send(utils.getFailResult(messages.phoneNoIsNull), '', '', "2");
                } else {
                    //invoke webservice
                    wsclient.generateMobileCode(uinfo, function(wsresult) {
                        if (wsresult.success) {
                            //将验证码保存在session中
                            var mobileCode = {
                                code: wsresult.data,
                                pnumber: pnumber,
                                time: new Date().getTime()
                            }
                            req.session.mobileCode = mobileCode;
                            req.session.uservalidphonetime = new Date().getTime();
                            res.send(utils.getSuccessResult(null, null, wsresult.msg));
                        } else {
                            res.send(utils.getFailResult(wsresult.msg));
                        }
                    });
                }
            } else {
                res.send(utils.getFailResult(wsresult.msg, '', '', "2"));
            }
        });
    }
});
/**/
/*
 * 验证手机是否已经被绑定过。
 */
router.post('/pla/validatebindphoneno', function(req, res, next) {

    var pnumber = req.body.pnumber;
    var uinfo = {
        pnumber: pnumber,
        ptype: 2,
        custId: null
    };
    //invoke webservice
    wsclient.validateBindPhoneNo(uinfo, function(wsresult) {
        if (wsresult.success) {
            req.session.markphoneNum = pnumber;
            //user.uservalidphonetime = new Date().getTime();
            res.send(utils.getSuccessResult());
        } else {
            res.send(utils.getFailResult(wsresult.msg));
        }
    });
});
/*验证手机验证码*/
router.post('/pla/validatephonecode', function(req, res, next) {
    var pnumber = req.body.pnumber;
    var pcode = req.body.pcode;

    //logger.info("------------------" + req.session.mobileCode.pnumber);
    if (req.session.mobileCode == null) {
        //验证码失效
        return res.send(utils.getFailResult(messages.invalidVCode));

    }
    if (req.session.mobileCode.pnumber != pnumber) {
        //手机与验证码不匹配
        return res.send(utils.getFailResult(messages.phoneNoNotMatchVCode));
    }
    if (req.session.mobileCode.code != pcode) {
        //验证码不正确
        return res.send(utils.getFailResult(messages.vcodeNotCorrect));
    } else {
        //验证码正确
        return res.send(utils.getSuccessResult());
    }

});
/*提交早鸟注册页*/
router.post("/pla/birdreg", function(req, res, next) {
    var loginName = req.body.loginname,
        loginPassword = req.body.loginpassword,
        aloginPassword = req.body.aloginname,
        mobile = req.body.pnumber,
        regOs = req.body.regOs,
        regDevice = req.body.regDevice;
    if (loginPassword != aloginPassword) {
        return res.send(utils.getFailResult("密码不一致"));
    }
    if (mobile != req.session.mobileCode.pnumber) {
        return res.send(utils.getFailResult(messages.phoneNoNotMatchVCode));
    }
    var uinfo = {
        loginName: loginName,
        loginPassword: loginPassword,
        regType: "2",
        mobile: mobile,
        recommendCode: req.session.referrerman,
        belongPlatform: "P2P",
        regSource: "",
        regDevice: regDevice,
        regOs: regOs
    }
    wsclient.createCustomer(uinfo, function(wsresult) {
        if (wsresult.success) {
            req.session.user = {
                loginName: wsresult.data.loginName,
                custId: wsresult.data.id
            };
            req.session.mobileCode = null;
            res.send(utils.getSuccessResult());
        } else {
            res.send(utils.getFailResult(wsresult.msg));
        }
    });
})

//pc注册第2步
router.get("/regpc2", function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        res.redirect("/");
        return;
    }
    res.render('regpc2');
});

//pc注册第3步
router.get("/regpc3", function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        res.redirect("/");
        return;
    }
    result = {
        custId: user.custId,
        domain: config.base.domain
    }
    res.render('regpc3', result);

});
/*获取2微码*/
router.get("/getQrcode", function(req, res, next) {
    var user = req.session.user;
    var QRUrl = "https://promo.i-niuwa.com/reg/";
    if (user && user.custId) {
        QRUrl = "https://promo.i-niuwa.com/reg/" + user.custId;
    }
    var info = {};
    var result = {};
    info.QRUrl = QRUrl;
    wsclient.customerQrcode(info, function(wsresult) {
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


router.get("/getQrcode2", function(req, res, next) {
    var user = req.session.user;
    var QRUrl = config.base.h5domain + "user/reg/";
    if (user && user.custId) {
        QRUrl = config.base.h5domain + "user/reg/" + user.custId;
    }
    var info = {};
    var result = {};
    info.QRUrl = QRUrl;
    wsclient.customerQrcode(info, function(wsresult) {
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


//提交注册
router.post("/regpc2", function(req, res, next) {
    var user = req.session.user;
    if (!user) {
        res.send(utils.getFailResult("用户未登录"));
        return;
    }
    var newAmount = req.body.newAmount || 0; //新客专享
    var planAmount = req.body.planAmount || 0; //优选
    var directAmount = req.body.directAmount || 0; //精选
    //invoke webservice
    wsclient.appointmentInvest({
        custId: user.custId,
        newAmount: newAmount,
        planAmount: planAmount,
        directAmount: directAmount
    }, function(wsresult) {
        res.send(wsresult);
    });
});

/*
 *获取IMG
 */
router.get("/getimg/:imgid", function(req, res, next) {
    if (!req.params.imgid) {
        res.send("无此图片");
    }
    var imgid = req.params.imgid;
    var imgidPrefix = imgid.substring(0, 2);
    if (imgidPrefix == "pr" && !req.session.user.custId) {
        res.send("无权限访问");
    }

    var newPath = "";
    if (imgid.indexOf("-") >= 0) {
        //进行截取日期
        if (imgid.split("-")[1].split(".")[0].indexOf("_") > -1) {
            newPath = imgid.split("-")[1].split(".")[0].split("_")[0] + "/";
        } else {
            newPath = imgid.split("-")[1].split(".")[0] + "/";
        }
    }

    var accessPath = imgidPrefix == "pr" ? config.base.privateFilePath : config.base.publicFilePath;
    var fs = require("fs");
    fs.readFile(accessPath + newPath + imgid, function(err, data) {
        if (data) {
            res.write(data, "binary");
            res.end();
        } else {
            res.send("图片不存在");
        }
    });
});

//获取图片
router.get("/getimgdef/:imgid", function(req, res, next) {

    var imgid = req.params.imgid;
    var imgidPrefix = imgid.substring(0, 2);

    var newPath = "";
    if (imgid.indexOf("-") >= 0) {
        //进行截取日期
        if (imgid.split("-")[1].split(".")[0].indexOf("_") > -1) {
            newPath = imgid.split("-")[1].split(".")[0].split("_")[0] + "/";
        } else {
            newPath = imgid.split("-")[1].split(".")[0] + "/";
        }
    }

    var accessPath = imgidPrefix == "pr" ? config.base.privateFilePath : config.base.publicFilePath;
    var fs = require("fs");
    fs.readFile(accessPath + newPath + imgid, function(err, data) {
        if (data) {
            res.write(data, "binary");
            res.end();
        } else {
            fs.readFile(config.base.publicFilePath + "pl_niubei_default_head.png", function(err, data) {
                if (data) {
                    res.write(data, "binary");
                    res.end();
                } else {
                    res.send("图片不存在");
                }
            });
        }
    });
});


/*
 *获取一日ceo IMG
 */
router.get("/getceoimg/:imgid", function(req, res, next) {
    if (!req.params.imgid) {
        res.send("无此图片");
    }
    var imgid = req.params.imgid;
    var imgidPrefix = imgid.substring(0, 2);
    if (imgidPrefix == "pr" && !req.session.user.custId) {
        res.send("无权限访问");
    }
    var accessPath = imgidPrefix == "pr" ? config.base.privateFilePath : config.base.publicFilePath;
    var fs = require("fs");
    fs.readFile(accessPath + 'ceo/' + imgid, function(err, data) {
        if (data) {
            res.write(data, "binary");
            res.end();
        } else {
            res.send("图片不存在");
        }
    });

});
/*关于我们*/
router.get("/aboutus", function(req, res, next) {
    res.render('aboutus');
});
//协议
router.get("/getDeal", function(req, res, next) {
    res.render('deal');
});

/*
 *判定用户是否已经登录
 */
router.get("/promo/islogin", function(req, res, next) {
    var islogin = req.session.user != null;
    res.send(islogin);
});

var promo = function(req, res, promopath) {
    var result = {};
    if (req.params.custId) {
        wsclient.selectRecomInfoById({
            id: req.params.custId
        }, function(wsresult) {
            if (wsresult.success) {
                wsclient.getLotteryList({}, function(result) {
                    if (result.success) {
                        result.lotterylist = result.data;
                        result.user = req.session.user;
                        result.domain = config.base.domain;
                        result.loginName = wsresult.data.loginName;
                        res.render(promopath, result);
                    } else {
                        res.send("调用getLotteryList失败");
                    }
                });
            }
        });
    } else {
        wsclient.getLotteryList({}, function(result) {
            if (result.success) {
                result.lotterylist = result.data;
                result.user = req.session.user;
                result.domain = config.base.domain;
                result.loginName = "";
                res.render(promopath, result);

            } else {
                res.send("调用getLotteryList失败");
            }
        });
    }
};

router.get("/index02/success", function(req, res, next) {
    if (req.session.user && req.headers['referer'] && req.headers['referer'].indexOf("https://promo.i-niuwa.com/index02") >= 0) {
        promo(req, res, "promot");
        return;
    } else {
        res.redirect("/index02");
    }

});

/*
 **推广
 */
router.get("/index01/:custId?", function(req, res, next) {
    /*var t = new Date("2015-06-16");
     req.session.inviteCode = req.params.custId;
     if (new Date().getTime() >= t) {
     res.redirect("/games/duanwu");
     }*/
    promo(req, res, "promo");
});

router.get("/index02/:custId?", function(req, res, next) {
    var t = new Date("2015-06-16");
    req.session.inviteCode = req.params.custId;
    if (new Date().getTime() >= t) {
        res.redirect("/games/duanwu");
    }
    promo(req, res, "promot");
});

/*
 抽奖-转盘
 */
router.get("/pra/promp/prizedraw1", function(req, res, next) {

    var custId = req.session.user.custId;
    if (!req.session.user.phoneNumber) {
        res.send({
            "success": false,
            "msg": "手机号未认证",
            "msgType": "info",
            "global": false
        });
    };
    wsclient.getLotteryResult({
        custId: custId,
        mobile: req.session.user.phoneNumber
    }, function(result) {
        res.send(result);
    });
});

/*
 抽奖-砸金蛋
 */
router.get("/pra/promp/prizedraw2", function(req, res, next) {

    var custId = req.session.user.custId;
    if (!req.session.user.phoneNumber) {
        res.send({
            "success": false,
            "msg": "手机号未认证",
            "msgType": "info",
            "global": false
        });
    };
    wsclient.getSmashEggResult({
        custId: custId,
        mobile: req.session.user.phoneNumber
    }, function(result) {
        res.send(result);
    });
});

/*
 抽奖-砸金蛋剩余次数
 */
router.get("/pra/promp/getSmashEggChances", function(req, res, next) {
    if (!req.session.user) {
        return res.send({
            data: 0,
            success: true
        });
    }
    var custId = req.session.user.custId;
    wsclient.getSmashEggChances({
        custId: custId,
        mobile: req.session.user.mobile
    }, function(result) {
        res.send(result);
    });
});


//牛呗着陆页
router.get("/mapp/niubei", function(req, res, next) {
    /*var downloadurl = '';

     if (utils.platSource(req) != "MO") {

     res.render("m/niubeipc");
     } else {

     if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
     downloadurl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android&g_f=991653";
     } else {
     if (utils.delectOS(req) == "IOS") {
     downloadurl = "https://itunes.apple.com/cn/app/niu-bei/id998444014?mt=8";
     } else {
     downloadurl = "https://ms.i-niuwa.com/file/downLoad?path=pl_niubei.apk";
     }
     }
     res.render("m/niubeiapp", {
     downloadurl: downloadurl
     });
     }*/
    if (req.session.app == 1) {
        var redirurl = config.base.promodomain + 'ceo';
        res.redirect(redirurl);
    }
    if (utils.platSource(req) != "MO") {
        res.render("m3/niubeiNew");
    } else {
        var derectUrl = {
            url: "",
            os: ""
        }
        var url = "";
        if (utils.delectOS(req) == "IOS") {
            derectUrl.url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android&g_f=991653";
            derectUrl.os = "ios"
        } else if (utils.delectOS(req) == "ANDROID") {
            if (req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
                //derectUrl.url = "http://android.myapp.com/myapp/detail.htm?apkName=com.niuwa.niubei.android";
                derectUrl.url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android&g_f=991653";
                derectUrl.os = "android";
            } else {
                derectUrl.url = "https://ms.i-niuwa.com/file/downLoad?path=pl_niubei.apk";
                derectUrl.os = "android";
            }

        } else {
            derectUrl.androidurl = "http://www.i-niuwa.com/getfile/niuwaniubei/niubei.apk";
            derectUrl.iosurl = "https://itunes.apple.com/cn/app/niu-bei/id998444014?mt=8";
            derectUrl.os = "else";
        }
        res.render("m4/niubeidescNew", derectUrl);
    }

});
/*pc推广 着陆页*/
router.get("/marketReg", function(req, res, next) {
    var result = {
        dom: config.base.domain
    }
    res.render("m/pcregformarket", result)
});
/*pc推广 着陆页2*/
router.get("/regformarket", function(req, res, next) {
    var result = {
        dom: config.base.domain
    }
    res.render("m/regformarket", result)
});

/*新推推广页面*/
router.get("/market1", function(req, res, next) {
    var result = {
        dom: config.base.domain
    }
    res.render("m/p20151105", result)
});
/*新推推广页面2*/
router.get("/market2", function(req, res, next) {
    var result = {
        dom: config.base.domain
    }
    res.render("m/p201511052", result)
});


/*pc推广 着陆页3*/
router.get("/regmarket3", function(req, res, next) {
    var result = {
        dom: config.base.domain
    }
    res.render("m/regmarket3", result)
});

/*牛呗懒牛计划*/
router.get("/niubeiplan", function(req, res, next) {
    res.render("m/niubeplan")
});
/**h5推广页**/
//router.get("/h5reg", function(req, res, next) {
//    var result = {
//        dom: config.base.domain,
//        h5domain: config.base.h5domain,
//    }
//    res.render("m/h5reg", result)
//});


router.get("/h5reg/:custId?", function(req, res, next) {
    var resobj = {
        loginName: "",
        signature: "",
        timespan: "",
        noncestr: "",
        dom: config.base.domain,
        h5domain: config.base.h5domain
    }
    if(!req.query.sid){
        res.redirect("/notfound");
        return;
    }
    var imgid = "/imgs/headb-02-04.jpg";

    if (req.params.custId) {
        wsclient.selectRecomInfoById({
            id: req.params.custId
        }, function(wsresult) {
            if (wsresult.success) {
                wsclient.WeiXinjsapi_ticket(function(result) {
                    var crypto = require('crypto');
                    var timespan = new Date().getTime();
                    var noncestr = Math.random().toString(36).substr(2);
                    var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.url
                    var shasum = crypto.createHash('sha1');
                    shasum.update(content);
                    resobj.loginName = wsresult.data.loginName;
                    resobj.signature = shasum.digest('hex');
                    resobj.timespan = timespan;
                    resobj.noncestr = noncestr;
                    resobj.custId = req.params.custId;
                    resobj.imgid = imgid;
                    res.render('m/h5reg_new', resobj);
                });
                /*resobj.loginName = wsresult.data.loginName;
                 res.render('reg', {loginName:wsresult.data.loginName,custId:req.params.custId});*/
            }
        });
    } else {
        wsclient.WeiXinjsapi_ticket(function(result) {
            var crypto = require('crypto');
            var timespan = new Date().getTime();
            var noncestr = Math.random().toString(36).substr(2);
            var content = "jsapi_ticket=" + result.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.url
            var shasum = crypto.createHash('sha1');
            shasum.update(content);
            resobj.loginName = "";
            resobj.signature = shasum.digest('hex');
            resobj.timespan = timespan;
            resobj.noncestr = noncestr;
            resobj.custId = "";
            resobj.imgid = imgid;
            res.render('m/h5reg_new', resobj);
        });
        /*res.render('reg', {loginName:"",custId:""});*/
    }
});
/*h5推广着陆页*/
router.get("/zhuolu", function(req, res, next) {
    weixin('m/zhuolu', req, res)
});
/*h5推广着陆页*/
router.get("/uc", function(req, res, next) {
    req.session.regSource = "2002";
    var urlAndroid;
    var urlIOS;
    urlAndroid = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android';// UC
    urlIOS = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.niuwa.niubei.android';

    res.render("m3/niubeiLoan",{
        urlAndroid:urlAndroid,
        urlIOS:urlIOS
    });
});
/*h5推广注册页*/
router.get("/toh5reg", function(req, res, next) {
    weixin('m/toh5reg', req, res, { imgid: req.query.id || '1123' });
});
/*h5推广注册成功*/
router.get("/regsuccess", function(req, res, next) {
    weixin('m/regsuccess', req, res)
});

//发送手机注册验证码
router.post("/sendregvaildcode", function(req, res) {
    user.senduserRegVaildCode(req, function(result, err) {
        if (err) {
            return res.send(utils.getFailResult(err.msg));
        }
        res.send(utils.getSuccessResult(result));
    });
});

//验证手机验证码
router.post("/vaildregcode", function(req, res) {
    var phone = req.body.phone;
    var vaildcode = req.body.verifycode;

    async.series({
        vaildregcode: function(phone, callback) {
            user.vaildregcode(callback);
        }
    }, function(err, results) {
        if (err) {
            res.redirect(page.errurl);
        }
        var render = utils.getSuccessResult(results.vaildregcode);

        res.send({
            success: true
        });
    });
});

var validateCaptcha = function(req, res, next) {
    //暂时不验证，只返回成功结果。
    //return true;
    var vcode = req.body.vcode;
    if (utils.isNull(vcode)) {
        res.send(utils.getFailResult('验证码不能为空'));
        return false;
    } else if (req.session.captcha == null || new Date().getTime() - new Number(req.session.captcha.time) > 300 * 1000) { //5分钟
        res.send(utils.getFailResult('无效的验证码，请重新获取验证码'));
        return false;
    }
    //与session中保存的验证码对比
    else if (req.session.captcha.code.toLowerCase() != vcode.toLowerCase()) {
        res.send(utils.getFailResult('图形验证码不正确'));
        return false;
    } else {
        res.send({
            success: true
        });
        return true;
    }
};

/*验证图片验证码是否正确*/

router.post('/pla/generatecaptchareg', function(req, res, next) {
    res.send({
        success: true
    });
    // validateCaptcha(req, res, next);
});


/*
 获取图片验证码
 */
router.get('/pla/generatecaptchareg', function(req, res, next) {
    var uinfo = {
        sessionid: req.session.id
    };
    //将验证码保存在session中
    var captcha = {
        code: 'cdde',
        time: new Date().getTime()
    }
    async.series({
            generateCaptcha: function(callback) {
                wsclient.generateCaptcha(uinfo, callback);
            }
        },
        function(err, results) {
            if (results.generateCaptcha.success) {
                //将验证码保存在session中
                var captcha = {
                    code: results.generateCaptcha.data.radomStr,
                    time: new Date().getTime()
                }
                req.session.captchareg = captcha;
                //将图片返回给页面
                var buffer = new Buffer(results.generateCaptcha.data.base64String, 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': buffer.length
                });
                res.end(buffer);
            } else {
                res.send(utils.getFailResult(results.generateCaptcha.msg));
            }
        })
});

/*h5提交注册*/
router.post('/posttoh5reg', function(req, res, next) {
    user.userReg(req, function(result, err) {
        if (err) {
            return res.send(utils.getFailResult(err.msg));
        }
        res.send(utils.getSuccessResult(result));
    });

});

/*h5提交注册*/
router.post('/posth5reg', function(req, res, next) {
    var queryString = req.session.queryString || '';
    var regSource = req.session.regSource || "";
    var pswd = req.body.pswd,
        vcode = req.body.vcode,
        mobile = req.body.mobile;
    pcode = req.body.pcode ? req.body.pcode : null;
    var belongPlatform = req.body.belongPlatform || "P2P";
    var jkArr = [],jkSid = 2000,tzArr = ['0000'],tzSid = 3001;
    while( jkSid <= 2100 ){
        jkArr.push(jkSid+'');
        jkSid++;
    }
    while( tzSid <= 3010 ){
        tzArr.push(tzSid+'');
        tzSid++;
    }
    if (jkArr.indexOf(regSource) >= 0) {
        belongPlatform = "jk_h5"
    } else if (tzArr.indexOf(regSource)>=0) {
        belongPlatform = "tz_h5"
    }
    var uinfo = {
        loginPassword: pswd,
        recommendCode: pcode, //邀请码
        mobile: mobile, //手机号码
        regType: req.body.regType || "4",
        regOs: utils.delectOS(req),
        regDevice: utils.platSource(req),
        belongPlatform: belongPlatform,
        loginIp: utils.getClientIp(req).replace('::ffff:',''),
        regSource: regSource,
        queryString: queryString,
        APP_AID:req.body.APP_AID,
        smsCode:vcode
    };
    if( !vcode ){
        return res.send(utils.getFailResult("请输入验证码", "", "", "vcode"));
    }
    if (req.session.captcha == null || req.body.icode == null || req.session.captcha.code.toLowerCase() != req.body.icode.toLowerCase()) {
        return res.send(utils.getFailResult("图形验证码不正确", "", "", "icode"));
    }
    if (!req.session.mobileCode) {
        return res.send(utils.getFailResult("手机验证码过期请重新获取", "", "", "vcode"));
    }
    if (utils.isNull(uinfo.loginIp)) {
        logger.info('Invalid login ip : ', uinfo);
        res.send(utils.getFailResult('异常请求，请联系客服。', '', '', "xieyi"));
    } else if (req.session.mobileCode.pnumber != mobile) {
        return res.send(utils.getFailResult("手机号有更改请重新获取手机验证码", "", "", "moble"));
    } else if (utils.isNull(pswd)) {
        res.send(utils.getFailResult(messages.passwordIsNull, "", "", "psd"));
    } else if ( req.session.mobileCode.code && req.session.mobileCode.code != vcode) {
        return res.send(utils.getFailResult(messages.vcodeNotCorrect, "", "", "vcode"));
    } else {
        //invoke webservice
        wsclient.createCustomer(uinfo, function(wsresult) {
            if (wsresult.success) {
                //创建并保存session
                if(wsresult.data){
                    utils.createSession({
                        loginname: wsresult.data.loginName,
                        custId: wsresult.data.id,
                        mobile: mobile
                    }, req, res);
                }
                req.session.mobileCode = null;
                req.session.captcha = null;
                req.session.uservalidphonetime = new Date().getTime();
                res.send(utils.getSuccessResult(null, ''));
            } else {
                res.send(utils.getFailResult(wsresult.msg, '', '', 'xieyi'));
            }
        });
    }
});

/*一日ceo提交注册接口*/
router.post('/h5ceoreg', function(req, res, next) {
    var queryString = req.session.queryString || '';
    var pswd = req.body.pswd,
        vcode = req.body.vcode,
        mobile = req.body.mobile;
    pcode = req.session.ploginName;
    var uinfo = {
        loginPassword: pswd,
        pswdagn: pswd,
        recommendCode: pcode, //邀请码
        mobile: mobile, //手机号码
        regType: "3",
        regOs: utils.delectOS(req),
        regDevice: utils.platSource(req),
        belongPlatform: "P2P",
        smsCode: vcode,
        loginIp: utils.getClientIp(req),
        regSource: req.session.regSource || "",
        queryString: queryString,
        activitySrc: "一日CEO助理活动"
    };
    if (req.session.captcha == null || req.body.icode == null || req.session.captcha.code.toLowerCase() != req.body.icode.toLowerCase()) {
        return res.send(utils.getFailResult("图形验证码不正确", "", "", "icode"));
    }
    if (utils.isNull(uinfo.loginIp)) {
        logger.info('Invalid login ip : ', uinfo);
        res.send(utils.getFailResult('异常请求，请联系客服。', '', '', "xieyi"));
    } else if (utils.isNull(pswd)) {
        res.send(utils.getFailResult(messages.passwordIsNull, "", "", "psd"));
    } else {
        //invoke webservice
        wsclient.createCustomer(uinfo, function(wsresult) {
            if (wsresult.success) {
                //创建并保存session
                utils.createSession({
                    loginname: wsresult.data.loginName,
                    custId: wsresult.data.id,
                    mobile: mobile
                }, req, res);
                req.session.mobileCode = null;
                req.session.captcha = null;
                req.session.uservalidphonetime = new Date().getTime();
                res.send(utils.getSuccessResult(null, ''));
            } else {
                res.send(utils.getFailResult(wsresult.msg, '', '', 'xieyi'));
            }
        });
    }
});



/*h5提交注册_haihai铁路注册*/
router.post('/posth5reg_wifi', function(req, res, next) {
    var queryString = req.session.queryString || '';
    var pswd = req.body.pswd,
        vcode = req.body.vcode,
        mobile = req.body.mobile;
    pcode = req.body.pcode ? req.body.pcode : null;
    var uinfo = {
        loginPassword: pswd,
        recommendCode: pcode, //邀请码
        mobile: mobile, //手机号码
        regType: "4",
        regOs: utils.delectOS(req),
        regDevice: utils.platSource(req),
        belongPlatform: "P2P",
        loginIp: utils.getClientIp(req),
        regSource: "1108",
        queryString: queryString
    };
    if (req.session.captcha == null || req.body.icode == null || req.session.captcha.code.toLowerCase() != req.body.icode.toLowerCase()) {
        return res.send(utils.getFailResult("图形验证码不正确", "", "", "icode"));
    }
    if (!req.session.mobileCode) {
        return res.send(utils.getFailResult("手机验证码过期请重新获取", "", "", "vcode"));
    }
    if (utils.isNull(uinfo.loginIp)) {
        logger.info('Invalid login ip : ', uinfo);
        res.send(utils.getFailResult('异常请求，请联系客服。', '', '', "xieyi"));
    } else if (req.session.mobileCode.pnumber != mobile) {
        return res.send(utils.getFailResult("手机号有更改请重新获取手机验证码", "", "", "moble"));
    } else if (utils.isNull(pswd)) {
        res.send(utils.getFailResult(messages.passwordIsNull, "", "", "psd"));
    } else if (req.session.mobileCode.code != vcode) {
        return res.send(utils.getFailResult(messages.vcodeNotCorrect, "", "", "vcode"));
    } else {
        //invoke webservice
        wsclient.createCustomer(uinfo, function(wsresult) {
            if (wsresult.success) {
                //创建并保存session
                utils.createSession({
                    loginname: wsresult.data.loginName,
                    custId: wsresult.data.id,
                    mobile: mobile
                }, req, res);
                req.session.mobileCode = null;
                req.session.captcha = null;
                req.session.uservalidphonetime = new Date().getTime();
                res.send(utils.getSuccessResult(null, ''));
            } else {
                res.send(utils.getFailResult(wsresult.msg, '', '', 'xieyi'));
            }
        });
    }
});


/*
 * 发送手机验证码  h5去4次限制。
 */
router.post('/pla/generatemobilecode2', function(req, res, next) {
    var pnumber = req.body.pnumber;
    /*if (req.session.uservalidphonetime && req.session.uservalidphonetime + 60000 >= new Date().getTime()) {
     res.send(utils.getFailResult("一分钟内只允许发送一次验证码","","","1"));
     return;
     }*/
    if (req.session.captcha == null || req.body.icode == null || req.session.captcha.code.toLowerCase() != req.body.icode.toLowerCase()) {
        return res.send(utils.getFailResult("图形验证码不正确", "", "", "icode"));
    }
    req.session.uservalidphonetime = new Date().getTime();

    var uinf1 = {
        pnumber: pnumber,
        ptype: 2,
        custId: null
    };
    //invoke webservice
    wsclient.validateBindPhoneNo(uinf1, function(wsresult) {
        if (wsresult.success) {
            req.session.markphoneNum = pnumber;
            var uinfo = {
                pnumber: pnumber,
                ptype: 'mcode',
                custId: null,
                actType: 2 // 固定值 ： 2代表绑定，3代表验证原始手机号，4代表验证新手机号
            };
            if (utils.isNull(pnumber)) {
                logger.error('Invalid input parameter : ', uinfo);
                res.send(utils.getFailResult(messages.phoneNoIsNull), '', '', "2");
            } else {
                //invoke webservice
                wsclient.generateMobileCode(uinfo, function(wsresult) {
                    if (wsresult.success) {
                        //将验证码保存在session中
                        var mobileCode = {
                            code: wsresult.data,
                            pnumber: pnumber,
                            time: new Date().getTime()
                        }
                        req.session.mobileCode = mobileCode;
                        req.session.uservalidphonetime = new Date().getTime();
                        res.send(utils.getSuccessResult(null, null, wsresult.msg));
                    } else {
                        res.send(utils.getFailResult(wsresult.msg));
                    }
                });
            }
        } else {
            res.send(utils.getFailResult(wsresult.msg, '', '', "2"));
        }
    });
});
router.post('/niubeiceo', function(req, res, next) {
    res.redirect('http://mp.weixin.qq.com/s?__biz=MzAwODUzMDQyNA==&mid=210118952&idx=1&sn=d1a7dab67401ad431cb977303fc48cd7&scene=0#rd');
});
router.get('/niubeiceo', function(req, res, next) {
    res.redirect('http://mp.weixin.qq.com/s?__biz=MzAwODUzMDQyNA==&mid=210118952&idx=1&sn=d1a7dab67401ad431cb977303fc48cd7&scene=0#rd');
});



/*SEO着落页 "/article/:id?"*/
router.get(/^\/article\/?(\d{0,})\/?(\d{0,})\/?$/, function(req, res, next) {
    var dir = req.params[0];
    var fileId = req.params[1];
    var url = config.base.cmsFilePath + 'seo/';
    var ejsvar = {};
    ejsvar.utils = utils;
    ejsvar.domain = config.base.domain;
    ejsvar.version = config.base.version;
    console.log(url + dir + '/' + fileId);
    if (utils.isNull(dir) || utils.isNull(fileId)) {
        res.redirect(config.base.domain);
    } else {
        url += dir + '/' + fileId + '.json';
        utils.cmsReadFile(url, function(data) {
            if (data) {
                ejsvar.seo = data;
                utils.cmsReadFile(config.base.cmsFilePath + 'images/catalog/seo_adv.json', function(data) {
                    ejsvar.seo_adv = data;
                    res.render('article', ejsvar);
                });

            } else {
                res.redirect(config.base.domain);
            }

        });
    }
});


function weixin(url, req, res, othJson) {
    wsclient.WeiXinjsapi_ticket(function(ress) {
        var result = {};
        result.promodomain = config.base.promodomain;
        var crypto = require('crypto');
        var timespan = new Date().getTime();
        var noncestr = Math.random().toString(36).substr(2);
        var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.originalUrl
        var shasum = crypto.createHash('sha1');
        shasum.update(content);
        result.signature = shasum.digest('hex');
        result.timespan = timespan;
        result.noncestr = noncestr;
        console.log('signature=' + result.signature + "===========" + 'timespan=' + result.timespan + "===========")
        console.log('noncestr=' + result.noncestr + "===========")
        if (req.session.user) {
            result.cusid = req.session.user.custId;
        } else {
            result.cusid = req.session.ceopcode;
        }
        if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
            result.iswxOS = true
        } else {
            result.iswxOS = false
        }
        if (utils.delectOS(req) == "IOS") {
            result.delectOS = 'ios'
        } else {
            result.delectOS = 'else'
        }
        result = utils.getConcatJson(result, othJson);
        return res.render(url, result);
    });
}
/*牛呗3.1全新升级*/
router.get('/publicity', function(req, res, next) {
    res.render('niubei/publicity.html')
});
/*牛呗我要借款*/
router.get('/borrowwing', function(req, res, next) {
    //weixin('niubei/borrow.html', req, res);
    weixin('niubei/borrow_new.html', req, res);
    /*wsclient.WeiXinjsapi_ticket(function(ress) {
     var crypto = require('crypto');
     var timespan = new Date().getTime();
     var noncestr = Math.random().toString(36).substr(2);
     var content = "jsapi_ticket=" + ress.ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=https://promo.i-niuwa.com" + req.originalUrl
     var shasum = crypto.createHash('sha1');
     shasum.update(content);
     result.signature = shasum.digest('hex');
     result.timespan = timespan;
     result.noncestr = noncestr;
     console.log('signature=' + result.signature + "===========" + 'timespan=' + result.timespan + "===========")
     console.log('noncestr=' + result.noncestr + "===========")
     if (req.session.user) {
     result.cusid = req.session.user.custId;
     } else {
     result.cusid = req.session.ceopcode;
     }
     if (req.headers['user-agent'] && req.headers['user-agent'].indexOf("MicroMessenger") >= 0) {
     result.iswxOS = true
     } else {
     result.iswxOS = false
     }
     return res.render("niubei/borrow.html", result);*/
});
/*牛呗我要投资*/
router.get('/nbinvest', function(req, res, next) {
    //res.render('niubei/invest.html');
    //weixin('niubei/invest.html', req, res);
    weixin('niubei/invest_new.html', req, res);
});
/*牛呗我要注册*/
router.get('/nbreg', function(req, res, next) {
    //res.render('niubei/niubreg.html')
    //weixin('niubei/niubreg.html', req, res)
    weixin('niubei/niubreg_new.html', req, res);
});
/*验证1*/
router.post('/pla/nbBindPhoneNo', function(req, res, next) {
    var pnumber = req.body.mobile;
    //req.session.uservalidphonetime = new Date().getTime();
    if (!(/^0?(13|15|18|14|17)[0-9]{9}$/).test(pnumber)) {
        res.send(utils.getFailResult("请输入您的有效手机号", "", "", "1"));
        return
    }
    var uinfo = {
        pnumber: pnumber,
        ptype: 2,
        custId: null
    };
    //invoke webservice
    wsclient.validateBindPhoneNo(uinfo, function(wsresult) {
        if (wsresult.success) {
            req.session.markphoneNum = pnumber;
            if (req.session.captcha == null || req.body.icode == null || req.session.captcha.code.toLowerCase() != req.body.icode.toLowerCase()) {
                return res.send(utils.getFailResult("图形验证码不正确", "", "", "captchacode"));
            }
            //user.uservalidphonetime = new Date().getTime();
            res.send(utils.getSuccessResult());
        } else {
            res.send(utils.getFailResult(wsresult.msg));
        }
    });
});
/*验证2*/
router.get('/pla/vphone', function(req, res, next) {
    //res.render('niubei/vphone.html')
    res.render('niubei/vphone_new.html');
});

/*牛呗提交注册接口*/
router.post('/h5ceoreg1', function(req, res, next) {
    var queryString = req.session.queryString || '';
    var pswd = req.body.pswd,
        vcode = req.body.vcode,
        mobile = req.body.mobile;
    pcode = req.session.ploginName;
    var uinfo = {
        loginPassword: pswd,
        pswdagn: pswd,
        recommendCode: pcode, //邀请码
        mobile: mobile, //手机号码
        regType: "3",
        regOs: utils.delectOS(req),
        regDevice: utils.platSource(req),
        belongPlatform: "P2P",
        smsCode: vcode,
        loginIp: utils.getClientIp(req),
        regSource: req.session.regSource || "",
        queryString: queryString
    };
    if (utils.isNull(uinfo.loginIp)) {
        logger.info('Invalid login ip : ', uinfo);
        res.send(utils.getFailResult('异常请求，请联系客服。', '', '', "xieyi"));
    } else if (utils.isNull(pswd)) {
        res.send(utils.getFailResult(messages.passwordIsNull, "", "", "psd"));
    } else {
        //invoke webservice
        wsclient.createCustomer(uinfo, function(wsresult) {
            if (wsresult.success) {
                //创建并保存session
                utils.createSession({
                    loginname: wsresult.data.loginName,
                    custId: wsresult.data.id,
                    mobile: mobile
                }, req, res);
                req.session.mobileCode = null;
                req.session.captcha = null;
                req.session.uservalidphonetime = new Date().getTime();
                res.send(utils.getSuccessResult(null, ''));
            } else {
                res.send(utils.getFailResult(wsresult.msg, '', '', 'xieyi'));
            }
        });
    }
});

/*时间格式*/
Date.prototype.Format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    //isBirsthday: wsurls.userURL + "conditionCheck"判断用户是否可以领取生日礼包
router.get("/pla/isBirsthday", function(req, res, next) {
        var user = req.session.user;
        if (typeof(user) == "undefined") {
            return res.send({
                "success": false,
                "msg": "",
                "data": "0"
            });
        }
        var tel = user.phoneNumber ? user.phoneNumber.toString() : "";
        var custId = user.custId ? user.custId.toString() : "";
        wsclient.isBirsthday({
            custId: custId,
            type: "birthday"
        }, function(wsresult) {
            if (wsresult.success) {
                if (wsresult.data == "0") {
                    return res.send({
                        "success": false,
                        "msg": "",
                        "data": "0"
                    });
                }
                if (wsresult.data == "1") {
                    return res.send({
                        "success": true,
                        "msg": "",
                        "data": "1",
                        'date': new Date().Format("yyyy/MM/dd")
                    });
                }

            } else {
                return res.send({
                    "success": false,
                    "msg": "",
                    "data": "0"
                });
            }
        });
    })
    //getBirthdayGift: wsurls.summerLotteryURL + "sendPrize"领取生日礼包
router.get("/pra/getBirthdayGift", function(req, res, next) {
    var user = req.session.user;
    if (typeof(user) == "undefined") {
        return res.send({
            "success": false,
            "msg": "",
            "data": "0" //session 丢失
        });
    }
    var tel = user.phoneNumber ? user.phoneNumber.toString() : "";
    var custId = user.custId ? user.custId.toString() : "";
    wsclient.getBirthdayGift({
        custId: custId,
        type: "birthday",
        tel: tel
    }, function(wsresult) {
        if (wsresult.success) {
            if (wsresult.data == "0") {
                return res.send({
                    "success": false,
                    "msg": "",
                    "data": "2" //领取失败
                });
            } else {
                return res.send({
                    "success": true,
                    "msg": "",
                    "data": "1"
                });
            }
        } else {
            return res.send({
                "success": false,
                "msg": "",
                "data": "1" //再等等，稍后再试
            });
        }

    });
});

/*一日ceo pc版*/
router.get('/pcceo', function(req, res, next) {
    utils.gameTime('2015-10-20', '2015-11-30', res);
    var user = req.session.user || null;
    var result = {};
    result.user = user;
    result.domain = config.base.domain;
    res.render('pcceo.html', result)
});
/*
 * 退出。
 */
router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect(config.base.domain);
});
//网站维护升级
router.get('/upgrade', function(req, res) {
    res.render('upgrade', {
        "title": '网站升级中，稍候更精彩',
    });
});
// 易宝迁移汇付公告通知
router.get('/migration/notice', function(req, res) {
    res.render("migration/index_h5")
});

/**新网callback**/
router.post("/xwcg/callback", function(req, res, next) {
    var body = req.body;
    var respData = JSON.parse(body.respData || '{"errorMessage":"未知错误"}');
    var user = req.session.userinfo;
    var title = messages.xwcgMessage[body.serviceName] || "未知"
    var ejsvar = utils.getMenuArg("牛娃金融|" + title, user, '', req, res);

    if (respData && respData.code == "0") {
        ejsvar.code = "000"
        ejsvar.message = title + "成功"
    } else {
        ejsvar.code = "001"
        ejsvar.message = respData.errorMessage || "未知错误"
    }
    ejsvar.defaultUrl = req.session.callbackSourceUrl;
    console.log('*************************');
    console.log(req.session.callbackSourceUrl);
    console.log('*************************');
    res.render("account/h5callback", ejsvar);
});

/**汇付callback页面 h5用*/
router.post("/hftg/h5callback", function(req, res, next) {
    var body = req.body;
    var user = req.session.user;
    var title = messages.hftgMessage[body.CmdId] || "未知"
    var ejsvar = utils.getMenuArg("牛娃金融|" + title, user, '', req, res);
    if (body && body.RespCode == "000") {
        ejsvar.code = "000"
        ejsvar.message = title + "成功"
    } else {
        ejsvar.code = "001"
        ejsvar.message = body.RespDesc || "未知错误"
        if (body.SecRespCode) {
            ejsvar.message = ejsvar.message + "，" + body.SecRespDesc
        }
    }
    ejsvar.defaultUrl = config.base.domain + 'invest';
    res.render("account/h5callback", ejsvar)
});


// 牛呗4.0全新升级
router.get("/updateNotice", function(req, res) {
    res.render("niubeiUpdate")
})

module.exports = router;