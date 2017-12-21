var express = require('express');
var router = express.Router();
var config = require('../config');
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var messages = require('../common/messages');
var enumeration = require('../common/enumeration');
var Cookies = require("cookies")
var nwsessionConfig = require('../common/nwsession')
var nwsession = new nwsessionConfig(router, {
    dbName: 'nweversession',
    cookieName: 'nwEv_id'
})

router.post("/tobind", function(req, res, next) {
    var user = req.body || {};
    // var cookieId = req.locals.cookieId;
    // flag -->BIND_ALL   BIND_TEL     BIND_CARD
    user.starTel = utils.telTosen(user.tel)
    user.starPhone = utils.telTosen(user.niuwaPhone)
    user.starCardNo = utils.cartNoTosen(user.cardNo)
    if (!user || !user.token || !user.tel || !user.cardNo) {
        res.send("<div style='text-align: center;margin-top: 50px;'>这是一个错误</div>")
        return
    }
    nwsession.set(req, user)
    res.render("m11/tobind", user);
}).get("/tobind", function(req, res, next) {
    var user = req.locals.session;
    if (!user || !user.token || !user.tel || !user.cardNo) {
        res.send("<div style='text-align: center;margin-top: 50px;'>这是一个错误</div>")
        return
    }
    res.render("m11/tobind", user);
})

router.post("/userBind", function(req, res, next) {
    var captcha = req.session.captcha
    if (!captcha || captcha.code == null || req.body.icode == null || captcha.code.toLowerCase() != req.body.icode.toLowerCase()) {
        res.send(utils.getFailResult({ msg: "图片验证码有误" }))
    } else {
        var user = req.locals.session || {};
        user.password = req.body.userpwd
        wsclient.bindAccount(user, function(results) {
            if (!results.success) {
                res.send(utils.getFailResult(results));
            } else {
                res.send(utils.getSuccessResult(results));
            }
        })
    }
})
router.get("/findpsd", function(req, res, next) {
    var user = req.locals.session;
    if (!user) {
        return res.redirect("m11/tobind");
    }
    wsclient.safeProblemLoad({
        custId: user.custId
    }, function(results) {
        if (!results.success) {
            return res.send(results.data);
        }
        var safeProbleKey;
        if (results.data.safeProblem == "Y") {
            //有安全问题
            var safeProblemList = results.data.safeProblemList;
            safeProbleKey = safeProblemList[Math.floor(Math.random() * safeProblemList.length)];
        }
        res.render("m11/findpsd", {
            starTel: user.starPhone,
            certAuth: results.data.certAuth,
            safeProblem: results.data.safeProblem,
            safeProblemObj: enumeration.getsafeProblem(safeProbleKey)
        });
    });
});
//忘记密码发送短信
router.post("/sendShortMsg", function(req, res, next) {
    var user = req.locals.session;
    var sendMobileCodeTime = req.session.sendMobileCodeTime;
    var count = req.body.ptype == "mcode" ? 60 : 120;
    var second = sendMobileCodeTime ? (count - (new Date().getTime() - new Date(sendMobileCodeTime).getTime()) / 1000) : null;
    second = parseInt(second);
    if (sendMobileCodeTime && second > 0) {
        res.send({
            success: false,
            msg: "一分钟内只允许发送一次验证码",
            second: second
        });
    } else {
        req.session.sendMobileCodeTime = new Date();
        wsclient.sendRegVaildNo({
            pnumber: user.niuwaPhone,
            ptype: req.body.ptype,
            custId: user.custId,
            actType: "3"
        }, function(results) {
            delete results.data;
            res.send(results);
        });
    }
});
router.post("/pwdProblemCheck", function(req, res, next) {
    var user = req.locals.session;
    wsclient.pwdProblemCheck({
        custId: user.custId,
        mobile: user.niuwaPhone,
        certNo: req.body.certNo,
        mobileCode: req.body.msgCode,
        dictCode: req.body.dictCode,
        answer: req.body.answer
    }, function(results) {
        res.send(results);
    });
});

router.get("/findpsd3", function(req, res, next) {
    res.render("m11/findpsd3", {});
});
router.post("/passwordreset", function(req, res, next) {
    var user = req.locals.session;
    wsclient.passwordreset({
        custId: user.custId,
        newPassword: req.body.newPassword,
        newPassword2: req.body.newPassword2
    }, function(results) {
        res.send(results);
    });

});

router.get("/modify_success", function(req, res, next) {
    res.render("m11/modifysuccess");
});
//易宝支付追加银行认证
router.get("/yibao_bankcard", function(req, res) {
    var token = req.query.sign;
    wsclient.findOneBySign({
        "head": {
            "sign": token
        },
        "con": {

        }
    }, function(json) {
        if (json.head && json.head.st == '0') {
            nwsession.set(req, {
                custId: json.body.custId
            });
            wsclient.bindAndauthCardsGet({
                custId: json.body.custId,
            }, function(results) {
                if (results.success) {
                    var card1, card2;
                    if (!!(results.data.authCards[0] || {}).status) {
                        if ((results.data.authCards[0].status != 2) && (results.data.authCards[0].status != 5)) {
                            card1 = true;
                            cardNo1 = results.data.authCards[0].cardNo
                        } else {
                            card1 = false
                        }
                    } else {
                        card1 = false
                    };
                    if (!!(results.data.authCards[1] || {}).status) {
                        if ((results.data.authCards[1].status != 2) && (results.data.authCards[1].status != 5)) {
                            card2 = true;
                            cardNo2 = results.data.authCards[1].cardNo
                        } else {
                            card2 = false
                        }
                    } else {
                        card2 = false
                    };
                    res.render("m11/yibao_bankcard", {
                        "title": '易宝支付追加银行认证',
                        "card1": card1,
                        "card2": card2,
                        "bindCards": results.data.bindCards.cardNo
                    });
                } else {
                    res.send(results.msg)
                }
            });
        } else {
            res.send('登入异常')
        }
    })

});
//保存验证卡
router.post("/authCardsPut", function(req, res) {
    var cardNos = req.body.cardNos;
    wsclient.authCardsPut({
        custId: req.locals.session.custId,
        cardNos: cardNos
    }, function(results) {
        res.send(results)
    });
});
//查询验证卡
router.post("/authCardsGet", function(req, res) {
    var cardNos = req.body.cardNos;
    wsclient.authCardsGet({
        custId: req.locals.session.custId,
        cardNos: cardNos
    }, function(results) {
        res.send(results)
    });
});
//触宝公告
router.get('/announcement', function(req, res) {
    // var reqInfo='eyJwbGF0Zm9ybVVzZXJObyI6ICIxMTljMjBiYjUyZGIzZDkwMDJhMTc2ZDYyN2Q1NTVhN2FjYjM2ODgxIiwgCiAic2VydmljZSI6ICJBQ1RJVkVBQ0NPVU5UIiwgCiAicGxhdGZvcm1ObyI6ICJkY2JhMDY0MDM2MTc0NmU1YWM1ZGQxMDI5MWViY2M1MSIsCiAicmVxdWVzdE5vIjogIjIzMTcyZjk5LTc1MzktNDI4Ny1hODY2LTAwMDAwMDUzIiwgCiJjYWxsYmFja1VybCI6Imh0dHA6Ly8xOTIuMTY4LjEwMS4xNjE6NTAwMC9tMTEvYW5ub3VuY2VtZW50IiwKIm5vdGlmeVVybCI6Imh0dHA6Ly8xOTIuMTY4LjEwMS4xNjE6NTAwMC9tMTEvYW5ub3VuY2VtZW50Igp9'
    // var token='MIIDDgYJKoZIhvcNAQcCoIIC/zCCAvsCAQExCzAJBgUrDgMCGgUAMC8GCSqGSIb3DQEHAaAiBCAwMTBiNDg3MjUzOGEzMTlhZWEyODA4YjRkM2U4NzJlNaCCAeswggHnMIIBUKADAgECAhCocQRYqgOMsUzZk2etQ9LfMA0GCSqGSIb3DQEBBAUAMA8xDTALBgNVBAMTBHRlc3QwHhcNMTExMjMxMTYwMDAwWhcNMTkxMjMxMTYwMDAwWjAPMQ0wCwYDVQQDEwR0ZXN0MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgAovx5JAWuif9UhrL/AR+pagb5aaU5uFzOjurkXoHNQSjvkEVsyC+sUWcgDGJ2bI6tUtrHlbFYDXFNNZDziX3Hq6zpdKKPvuHgKKic8ti4L5snATFffpI+O6IX0gg/P638vAhhfSnYeISDC2prshQK8PNoglPZl/I70YkYAWh9QIDAQABo0QwQjBABgNVHQEEOTA3gBDuYiRSZR5w2vzjDYDmS90UoREwDzENMAsGA1UEAxMEdGVzdIIQqHEEWKoDjLFM2ZNnrUPS3zANBgkqhkiG9w0BAQQFAAOBgQCdQhEQJsyLapnSRDE7yxUefv1E7H04t7nbzuT2p1VW4JjSYlEGhhTyJMYi9WZxKVkkzH1y6LLdFJZLjQGxbicGP9plPgolQsbHJToaROA1OYzYhMPwMWiaghn/wkmnWF+5Z3zJUN+T3EFJfMcfP8g/Mem5s8S5wnjiVtu/tIne8DGByDCBxQIBATAjMA8xDTALBgNVBAMTBHRlc3QCEKhxBFiqA4yxTNmTZ61D0t8wCQYFKw4DAhoFADANBgkqhkiG9w0BAQEFAASBgDagVOoIJGvQuDCfGLxXcBVb7IMNbiuvmoBIMtADNo7MFmOe57UqXbXqPRUzOp1zCRjB5GNyZO1aU+EAzhNwF/68egD+aV9P4CxDnSHNwUNEURymEyhLJdqJYItPN9iI+rvM1fofu3IRehT3uG8J13ahUfd6aZD/jLJyLaSEzh5E'
    var message = req.query.message;
    var usrId = req.query.usrId;
    var needSkip = req.query.needSkip;
    var url = unescape(req.query.url);

    var hexToDec = function(str) {
        str = str.replace(/\\/g, "%");
        return unescape(str);
    }

    // wsclient.business({
    //     'req':reqInfo,
    //     'token':token
    // },function(json){
    //     if (json.success) {

    var reso = function(data) {
        var json = data.split("&");
        var obj = {};
        for (var i = 0; i < json.length; i++) {
            var temp = json[i].split("=");
            obj[temp[0].trim()] = temp[1].trim();
        }
        return obj;
    }


    // var arr = reso();
    message = utils.Base64.decode(message)

    message = decodeURIComponent(message);
    var arr = utils.dataConvert(message);


    res.render('m11/announcement', {
        'usrId': usrId,
        'arr': arr,
        'needSkip': needSkip,
        'url': url
    });
    //     }
    // })
});

module.exports = router;