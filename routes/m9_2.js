var express = require('express');
var router = express.Router();
var config = require('../config');
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var messages = require('../common/messages');
var nwsessionConfig = require('../common/nwsession');



var Cookies = require("cookies")
var nwsession = new nwsessionConfig(router, {
    dbName: 'nweversession',
    cookieName: 'nwEv_id'
})

var mongoose = require('mongoose');
var db = mongoose.createConnection(config.base.mongodbpath + "nwpromo"); //创建一个数据库连接
var counterSchema = new mongoose.Schema({
    expires: Date,
    createDate: String
}).index({
    "expires": 1
}, {
    expireAfterSeconds: 60 * 60 * 24 * 7 * 1000
});
var counterModel = db.model('yhjCounter', counterSchema);

// 第二期详情页
router.get('/fenqifuwu_second', function(req, res) {
    var token = req.query.sign;
    var version = req.query.version;
    // var token = '20170222095504932a1acc86c04f7687a36d014d6ecda1';
    if(!!token) {
        wsclient.findOneBySign({ //通过sign查询用户信息
            "head": {
                "sign": token
            },
            "con": {

            }
        }, function(json) { //通过cust_id查询用户状态
            if(json.head.msg == '操作成功') {
                var jbody = json.body;
                wsclient.getLatestLoan({
                    "CUST_ID": json.body.custId,
                    "prodType": "yhj2_p3"
                }, function(json2) {
                    var projiect_info = json2.data;
                    var projiect_info2 = (!projiect_info.length ? "" : projiect_info.projectNo)
                    nwsession.set(req, {
                        user: jbody,
                        projectNo: projiect_info2,
                        from: 'app',
                    });
                    var isSign;
                    if(json2.success) {
                        wsclient.showProtocol({
                            "custId": jbody.custId,
                            "protType": "BIC",
                            "projectNo": "",
                            "loanSubSrc": "YHJ2"
                        }, function(json3) {
                            if(json3.success) {
                                isSign = !projiect_info.length ? false : true;
                                var repayStatus;
                                var canApply = false;
                                var confirmFlag;
                                if(!projiect_info.projectNo) { //用户一次都没有借款
                                    repayStatus = false;
                                    canApply = false;
                                    confirmFlag = false
                                } else { //用户借款记录
                                    if((!!projiect_info.repayStatus) && (projiect_info.repayStatus != 'SETTLED' || projiect_info.repayStatus != 'EARLY_REPAY')) {
                                        repayStatus = true;
                                        canApply = true;
                                    }
                                    if((projiect_info.confirmFlag) == 1 && (!!projiect_info.repayStatus)) {
                                        confirmFlag = false; //重新申请
                                    } else if((projiect_info.confirmFlag) == 1 && (!projiect_info.repayStatus) && (projiect_info.auditStatus != 'RETURN')) {
                                        confirmFlag = true;
                                    } else if(projiect_info.confirmFlag == 0) {
                                        if((projiect_info.repayStatus == 'WAIT_REPAY') || (projiect_info.repayStatus == 'NORMAL')) {
                                            confirmFlag = false;

                                        } else if((projiect_info.repayStatus == 'EARLY_REPAY') || (projiect_info.repayStatus == 'SETTLED')) {
                                            confirmFlag = false;
                                        } else {
                                            confirmFlag = true;
                                        }

                                    }
                                }

                                res.render('m9/fenqifuwu_second', {
                                    "config": config,
                                    "title": '分期服务',
                                    "goback": "/m9/fenqifuwu-list",
                                    "isSign": json3.data.isSign,
                                    "repayStatus": repayStatus,
                                    "projiect_info": projiect_info,
                                    'canApply': canApply,
                                    "confirmFlag": confirmFlag,
                                    "token": token,
                                    "version": version,
                                    "logins": 'true'
                                });
                            } else {
                                res.send("参数异常")
                            }
                        })
                    } else {
                        res.send("参数异常")
                    }
                })
            } else {
                res.send("参数异常")
            }

        })
    } else { //!!token
        res.render('m9/fenqifuwu_second', {
            "config": config,
            "title": '分期服务',
            "goback": "/m9/fenqifuwu-list",
            "isSign": '1',
            "repayStatus": false,
            "projiect_info": false,
            'canApply': true,
            "confirmFlag": false,
            "token":'',
            "version":version,
            "logins": 'false'
        });
    }

});

// router.get("/*",function(req, res,netx){
//  var custId = (req.locals.session.user || {}).custId;
//  if(!custId) {
//      res.redirect('/m9_2/fenqifuwu_second?backBtnStatus:backToIndex')
//      return;
//  }
//  netx();
// })

//审核结果
router.get('/check_result/:status', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    var token=req.locals.session.token
    var status = req.params.status
    res.render('m9/check_result', {
        "repayStatus": '',
        "config": config,
        "title": '审核结果',
        "goback": "",
        "status": status,
        "token":token
    });

});

//服务审核
router.get('/fuwu_check', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    var token=req.locals.session.token
    wsclient.getLatestLoan({
        "CUST_ID": custId,
        "prodType": "yhj2_p3"
    }, function(json2) {
        var start_time = new Date(json2.data.loanDate);
        // var start_time=new Date().getTime()-60000
        var end_time = new Date();
        var rest_time = (end_time - start_time);
        var send_time
        if(Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000) < 10) {
            send_time = Math.floor(rest_time / (60 * 1000)) + ':' + '0' + Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000)
        } else {
            send_time = Math.floor(rest_time / (60 * 1000)) + ':' + Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000)
        }
        if(json2.success) {
            res.render('m9/fuwu_check', {
                "repayStatus": '',
                "config": config,
                "title": '服务审核',
                "goback": "",
                'rest_time': rest_time,
                'send_time': send_time,
                "token":token
            });
        }
    })

});

//等待放款
router.get('/wait_money', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    var token=req.locals.session.token
    wsclient.getLatestLoan({
        "CUST_ID": custId,
        "prodType": "yhj2_p3"
    }, function(json2) {
        var start_time = new Date(json2.data.fundMatchTime);
        // var start_time=new Date().getTime()-60000
        var end_time = new Date();
        var rest_time = (end_time - start_time);
        var send_time
        if(Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000) < 10) {
            send_time = Math.floor(rest_time / (60 * 1000)) + ':' + '0' + Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000)
        } else {
            send_time = Math.floor(rest_time / (60 * 1000)) + ':' + Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000)
        }
        if(json2.success) {
            res.render('m9/wait_money', {
                "repayStatus": '',
                "config": config,
                "title": '等待放款',
                "goback": "",
                'rest_time': rest_time,
                'send_time': send_time,
                "token":token
            });
        }
    })

});

//确认申请
router.get('/confirm_apply', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    var token=req.locals.session.token
    wsclient.repayPlan4YHJ({
        "loanAmount": "2775",
        "loanTerm": "3"
    }, function(json) {
        if(json.success) {
            wsclient.getLatestLoan({
                "CUST_ID": custId,
                "prodType": "yhj2_p3"
            }, function(json2) {
                var start_time = new Date(json2.data.loanDate);
                var pay_data = start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate()
                var end_time = new Date();
                var rest_time = 45* 60 * 1000 - (end_time - start_time);
                var send_time
                if(Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000) < 10) {
                    send_time = Math.floor(rest_time / (60 * 1000)) + ':' + '0' + Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000)
                } else {
                    send_time = Math.floor(rest_time / (60 * 1000)) + ':' + Math.floor((rest_time % (60 * 1000)) % (60 * 1000) / 1000)
                }
                res.render('m9/confirm_apply', {
                    "repayStatus": '',
                    "config": config,
                    "title": '确认申请',
                    "goback": '/m9/fenqifuwu-list',
                    "json": json.data,
                    "time": send_time,
                    'rest_time': rest_time,
                    'pay_data': pay_data,
                    "token":token
                });
            })
        }
    })
});

//服务成功
router.get('/service_success', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    var token=req.locals.session.token
    wsclient.repayPlan4YHJ({
        "loanAmount": "2775",
        "loanTerm": "3"
    }, function(json) {
        if(json.success) {
            res.render('m9/service_success', {
                "repayStatus": '',
                "config": config,
                "title": '服务成功',
                "goback": "",
                "json": json.data,
                "token":token
            });
        }
    })
});
// 居间协议
router.get('/jujianxieyi', function(req, res) {
    var user = req.locals.session.user;
    var custId = (user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.showProtocol({
        "custId": custId,
        "protType": "BIC",
        "projectNo": "",
        "loanSubSrc": "YHJ2"
    }, function(json) {
        res.send(json.data.content)
    })
});

// 借款协议
router.get('/jiekuanxieyi', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.getLatestLoan({
        "CUST_ID": custId,
        "prodType": "yhj2_p3"
    }, function(json2) {
        wsclient.showProtocol({
            "custId": custId,
            "protType": "FIC",
            "projectNo": json2.data.projectNo,
            "loanSubSrc": "YHJ2"
        }, function(json) {
            res.send(json.data.content)
        })
    })
});

// 资费说明
router.get('/zifeishuoming', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.getLatestLoan({
        "CUST_ID": custId,
        "prodType": "yhj2_p3"
    }, function(json2) {
        wsclient.showProtocol({
            "custId": custId,
            "protType": "ICES",
            "projectNo": json2.data.projectNo,
            "loanSubSrc": "YHJ2"
        }, function(json) {
            res.send(json.data.content)
        })
    })
});

// 申请借款
router.post('/appLoan4Channel', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    var mobileSign = req.locals.session.user.mobileSign;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.appLoan4Channel({
        "id": custId,
        "prodType": "yhj2_p3",
        "CUST_ID": custId,
        "appTerm": "3",
        "appAmount": 2775,
        "rebateRate": 8.1,
        "projectName": "易换机：S.D.Care贴膜套餐",
        "sid": mobileSign,
        "channel":'YHJ'
    }, function(json) {
        res.send(json)
    })
});

// 查询用户状态
router.post('/getLatestLoan', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.getLatestLoan({
        "CUST_ID": custId,
        "prodType": "yhj2_p3"
    }, function(json) {
        res.send(json.data)
    })
});

//审核结果点击确定，用户可以重新申请
router.post('/saveUserConfirmLog', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.getLatestLoan({
        "CUST_ID": custId,
        "prodType": "yhj2_p3"
    }, function(json2) {
        wsclient.saveUserConfirmLog({
            "projectNo": json2.data.projectNo,
            "remarks": "no_001"
        }, function(json) {
            res.send(json)
        })
    })
});

//审核通过，点击按钮放款
router.post('/makeLoan', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.getLatestLoan({
        "CUST_ID": custId,
        "prodType": "yhj2_p3"
    }, function(json2) {
        wsclient.makeLoan({
            "id": custId,
            "CUST_ID": custId,
            "loanId": json2.data.projectNo,
            "prodType": "yhj2_p3"
        }, function(json) {
            res.send(json)
        })
    })
});

router.post('/toPay', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    var fbody = req.body;
    console.log(fbody)
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    res.render('m9/post_pay', {
        "repayStatus": '',
        "config": config,
        "title": '易宝',
        "fbody": fbody,
        "goback": true
    });

});
router.get('/pay', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    res.render('m9/pay', {});
});
router.post('/checkDirecTrfAuth',function(req,res){
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.checkDirecTrfAuth({
        "custId": custId,
        "channel":"YHJ"
    },function(json){
        res.send(json)
    })
})
router.post('/direcTrfAuth',function(req,res){
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        res.redirect('/m9/fenqifuwu-list?sign=')
        return;
    }
    wsclient.direcTrfAuth({
        "custId": custId,
        "channel":"YHJ",
        "callbackUrl":"http://qingweb.tunnel.qydev.com/webdemo/index.html"
    },function(json){
        res.send(json)
    })
})
router.get('/yibaozhifu', function(req, res) {
    res.render('m9/yibaozhifu', {"title": '易宝追加银行卡认证公告'});
});
//易换机还款页面
router.get('/repayPage/:adequate/:usemoney/:repayType/:loanId/:repayPlanList/:id_send/:bdfPrjType', function(req, res) {
    var adequate=req.params.adequate;
    var usemoney=req.params.usemoney;
    var repayType=req.params.repayType;
    var repayPlanList=req.params.repayPlanList;
    var loanId=req.params.loanId;
    var id_send=req.params.id_send;
    var bdfPrjType=req.params.bdfPrjType
    

                    res.render('m9/repayPage', {
                        "title": '还款',
                        "goback": '',
                        "usemoney":usemoney,
                        "adequate":adequate,
                        "repayType":repayType,
                        "loanId":loanId,
                        "repayPlanList":repayPlanList,
                        "id_send":id_send,
                        "bdfPrjType":bdfPrjType
                    });   

});


// 触宝确认页
router.post('/chubaoConfirm', function(req, res) {
    var Data=req.body.data;
    var p2pRepaySuffix=req.body.p2pRepaySuffix;
    var repayAmount=req.body.repayAmount;
    var userBalance=req.body.userBalance;
    var callbackUrl=req.body.callbackUrl;
    var reqNo=req.body.reqNo;
    var platformNo=req.body.platformNo;
    var platformUserNo=req.body.platformUserNo;
    var service=req.body.service;
            res.render('m9/chubaoRepayPage', {
                "title": '还款',
                "goback": '',
                "repayAmount":repayAmount,
                "userBalance":userBalance,
                "url":config.wsDomains.domain1,
                "callbackUrl":callbackUrl,
                "Data":Data,
                "p2pRepaySuffix":p2pRepaySuffix,
                "service":service,
                "reqNo":reqNo,
                "platformNo":platformNo,
                "platformUserNo":platformUserNo,
                "utils": require("../common/utils")
            });
});

router.post('/p2pRepaySuffix',function(req,res){
    var Data=JSON.parse(req.body.data.replace(/&quot;/g,'"'));
    var p2pRepaySuffix=req.body.p2pRepaySuffix;
    wsclient.p2pRepaySuffix(p2pRepaySuffix, Data,function(json){
        res.send(json)
    })
})


//易换机还款页面
router.get('/change_mobile_explain', function(req, res) {
                    res.render('m9/change_mobile_explain', {});   

});

module.exports = router;
