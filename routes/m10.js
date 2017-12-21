var express = require('express');
var router = express.Router();
var config = require('../config');
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var messages = require('../common/messages');

var Shop = {
    "ygjb_p1": {
        prodType: "ygjb_p1",
        shopImg: "/imgs/m9/shop1.jpg",
        shopName: "易换机屏安服务套餐",
        shopDesc: "<br><br>*本服务仅支持在线下商铺申请",
        shopContent: "<p>1、屏安服务套餐由“易换机”平台提供；</p>"
                    +"<p>2、套餐中单个屏安服务的零售价为199元/个，购买200个屏安服务原价需要39800元（199元/个×200个），购买本套餐则可享受超低优惠价12000元（60元/个×200个）</p>"
                    +"<p>3、本套餐购买成功后一共分12期偿还，每期只需还款1000元；</p>"
                    +"<p>4、套餐中的屏安服务如被激活，自激活之日起有效期为1年，过期无效；</p>"
                    +"<p>5、申请本套餐前需在牛呗完成注册，以及基础修炼术中的“验明正身”；  </p>"
                    +"<p>6、每位用户在申请一笔易换机屏安服务套餐分期成功后，需还清所有款项后方能再次申请；</p>"
                    +"<p>7、商铺代码及服务代码请咨询“易换机”线下工作人员；</p>"
                    +"<p>8、本商品分期服务最终解释权归上海牛娃互联网金融信息服务有限公司所有，如需帮助请致电400-8846-898。</p>",
        shopPrice: "￥12000"
    },
    "ygjs_p2": {
        prodType: "ygjs_p2",
        shopImg: "/imgs/m9/shop-08.jpg",
        shopName: "易换机爱萝卜手机分期",
        shopDesc: "<br><br>*本服务仅支持爱萝卜用户使用",
        shopContent: "<p>1、本分期服务仅向爱萝卜用户提供；</p>"
                     +"<p>2、申请分期服务前需注册牛呗，并完成所有的基础修炼术以及通信认证；</p>"
                     +"<p>3、上述所有认证通过后，请返回牛呗订阅号，点击“牛呗分期”菜单，进入“易换机”子菜单中的“易换机爱萝卜手机分期”详情页，输入申请的金额、备注商品型号，且选择还款期限；</p>"
                     +"<p>4、分期服务申请通过后，牛呗将为您向易换机先行支付相应款项，您在之后按照约定的金额和分期时间还款即可；</p>"
                     +"<p>5、商铺代码及服务代码请咨询“爱萝卜”或“易换机”工作人员；</p>"
                     +"<p>6、每个用户在申请一笔易换机爱萝卜手机分期成功后，需还清所有款项后可再次申请；</p>"
                     +"<p>7、本商品分期服务最终解释权归上海牛娃互联网金融信息服务有限公司所有，如需帮助请致电400-8846-898。</p>"   ,
        shopPrice: "￥960-3950"
    }
}


router.get('/fenqifuwu-list-app', function(req, res) {
    var token = req.query.sign;
    var custId = req.query.id;

    if (!token || !custId) {
        res.render('m9/fenqifuwu-list', {
            "shopList": [{
                prodType: "ygjb_p1",
                shopImg: "/imgs/m9/shop1.jpg",
                shopName: "易换机屏安服务套餐",
                shopDesc: "*本服务仅支持在线下商铺使用",
                shopTag: "移动配件"
            }, {
                prodType: "ygjs_p2",
                shopImg: "/imgs/m9/shop-08.jpg",
                shopName: "易换机爱萝卜手机分期",
                shopDesc: "*本服务仅支持爱萝卜用户申请",
                shopTag: "移动配件"
            }],
            "config": config,
            "user": {},
            "title": '分期服务',
            "goback": ''
        });
        req.session.user = null;
        return flase;

    }
    wsclient.findBaseCustomer({

        "head": {
            "sign": token
        },
        "con": {
            "id": custId
        },
        CUST_ID: custId
    }, function(json) {

        if (json.success) {
            var user = {};
            user.custId = json.data.custId;
            user.loginname = json.data.loginName;
            user.phoneNumber = json.data.mobile;
            req.session.user = user;
            req.session.from = app;
            res.render('m9/fenqifuwu-list', {
                "shopList": [{
                    prodType: "ygjb_p1",
                    shopImg: "/imgs/m9/shop1.jpg",
                    shopName: "易换机屏安服务套餐",
                    shopDesc: "*本服务仅支持在线下商铺使用",
                    shopTag: "移动配件"
                }, {
                    prodType: "ygjs_p2",
                    shopImg: "/imgs/m9/shop-08.jpg",
                    shopName: "易换机爱萝卜手机分期",
                    shopDesc: "*本服务仅支持爱萝卜用户申请",
                    shopTag: "移动配件"
                }],
                "config": config,
                "user": user,
                "title": '分期服务',
                "goback": '',
                comes_from:'app'
            });
        } else {
            res.render('m9/fenqifuwu-list', {
                "shopList": [{
                    prodType: "ygjb_p1",
                    shopImg: "/imgs/m9/shop1.jpg",
                    shopName: "易换机屏安服务套餐",
                    shopDesc: "*本服务仅支持在线下商铺使用",
                    shopTag: "移动配件"
                }, {
                    prodType: "ygjs_p2",
                    shopImg: "/imgs/m9/shop-08.jpg",
                    shopName: "易换机爱萝卜手机分期",
                    shopDesc: "*本服务仅支持爱萝卜用户申请",
                    shopTag: "移动配件"
                }],
                "config": config,
                "user": {},
                "title": '分期服务',
                "goback": ''
            });
            req.session.user = null;
        }

    });

});

router.get('/fenqifuwu-detail-app/:prodType', function(req, res) {

    // if (!req.params.prodType || !Shop[req.params.prodType]) return next();

    res.render('m10/fenqifuwu-detail-app', {

        "config": config,
        "title": '分期服务',
        "goback": "/m10/fenqifuwu-list-app",
        shop: Shop[req.params.prodType],

    });
});

















router.get('/fenqifuwu-list', function(req, res) {
    res.render('m9/fenqifuwu-list', {
        "shopList": [{
            prodType: "ygjb_p1",
            shopImg: "/imgs/m9/shop1.jpg",
            shopName: "易换机屏安服务套餐",
            shopDesc: "*本服务仅支持在线下商铺使用",
            shopTag: "移动配件"
        }
     , {
         prodType: "ygjs_p2",
         shopImg: "/imgs/m9/shop-08.jpg",
         shopName: "易换机爱萝卜手机分期",
         shopDesc: "*本服务仅支持爱萝卜用户申请",
         shopTag: "移动配件"
     }
        ],
        "config": config,
        "user": req.session.user || {},
        "title": '分期服务',
        "goback": true
    });
});

router.get('/fenqifuwu-detail/:prodType', function(req, res) {
   console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
   console.log(Shop[req.params.prodType])
    if (!req.params.prodType || !Shop[req.params.prodType]) 
        // return next();
    if (!req.session.user) return res.redirect(config.base.h5domain + 'user/login?tourl=' + config.base.promodomain + 'm9/fenqifuwu-detail/' + req.params.prodType);
    res.render('m9/fenqifuwu-detail', {

        "config": config,
        "title": '分期服务',
        "goback": "/m9/fenqifuwu-list",
        shop: Shop[req.params.prodType]
    });
});

router.get('/shoujirenzheng-status/:status', function(req, res, next) {
    if (!req.session.user) return res.redirect(config.base.h5domain + 'user/login?tourl=' + config.base.promodomain + 'm9/tongxinrenzheng');
    var statusMap = {
        '1': '不支持认证',
        '2': '认证成功',
        '3': '手机认证失败',
        '4': '认证中',
    }
    if (!statusMap[req.params.status]) return next();
    var phone = (req.session.user.phoneNumber && req.session.user.phoneNumber.length === 11 ? req.session.user.phoneNumber : "***********");
    phone = phone.substr(0, 3) + "****" + phone.substr(7, 4);
    res.render('m9/shoujirenzheng-status', {
        "config": config,
        "title": statusMap[req.params.status],
        "goback": true,
        "status": req.params.status || "",
        "phone": phone
    });
});

//爱萝卜获取还款计划
router.post('/repayPlan',function(req,res){
    wsclient.repayPlan4ALB({
        productPrice: req.body.totalPrice,
        loanTerm: req.body.term,
        custId:req.session.user.custId
    }, function(json) {
        var totradeListOrigin = json.data;  
        var totradeList = [];
        for (var i = 0; i < totradeListOrigin.length; i++) {
            var totrade = totradeListOrigin[i];
            totradeList.push({
                term: totrade.repayDate + "/" + totradeListOrigin.length + "期",
                repayamount: parseFloat(totrade.repaySum).toFixed(2) + "元",
                repaydate: totrade.repayTime
            });
        }
        res.send({repayamount:totradeList[0].repayamount});
    });
});

router.get('/fenqifuwu-confirm-apply/:amount/:term/:prodType/', function(req, res) {
    if (!req.session.user) return res.redirect(config.base.h5domain + 'user/login?tourl=' + config.base.promodomain + 'm9/fenqifuwu-confirm-apply/' + req.params.amount + '/' + req.params.term + '/' + req.params.prodType);
   
    
    
    var prodType_final 
            if (req.params.prodType == 'ygjb_p1') {
                prodType_final = 'ECEI'
                wsclient.repayDetailList({
                    returnPoint: 16.67,
                    productPrice: 12000,
                    loanRate: 10.8,
                    loanTerm: 12,
                    repayMethod: prodType_final,
                   
                }, function(json) {
                     console.log('pppppppppppppppppppssssssssssssssssssssssssss')
                    console.log(json);
                    var totradeListOrigin = json.data
            
                    var totradeList = [];
                    for (var i = 0; i < totradeListOrigin.length; i++) {
                        var totrade = totradeListOrigin[i];
                        totradeList.push({
                            term: totrade.repayDate + "/" + totradeListOrigin.length + "期",
                            repayamount: parseFloat(totrade.repaySum).toFixed(2) + "元",
                            repaydate: totrade.repayTime
                        });
                    }
        
                res.render('m9/fenqifuwu-confirm-apply', {
                    'totradeList1': totradeList,
                    "config": config,
                    "title": '还款计划',
                    "goback": true,
                     projectName: '',
                    "utils": require("../common/utils"),
                    shop: Shop[req.params.prodType] || {},
                });
            });
                
                
                
            } else if(req.params.prodType == 'ygjs_p2'){
                prodType_final = 'LCI'
                wsclient.repayPlan4ALB({
                     // returnPoint: 16.67,
                    productPrice: req.params.amount,
                     // loanRate: 10.8,
                    loanTerm: req.params.term,
                     // repayMethod: prodType_final,
                    custId:req.session.user.custId
                }, function(json) {
                    var totradeListOrigin = json.data
            
                    var totradeList = [];
                    for (var i = 0; i < totradeListOrigin.length; i++) {
                        var totrade = totradeListOrigin[i];
                        totradeList.push({
                            term: totrade.repayDate + "/" + totradeListOrigin.length + "期",
                            repayamount: parseFloat(totrade.repaySum).toFixed(2) + "元",
                            repaydate: totrade.repayTime
                        });
                    }
        
                res.render('m9/fenqifuwu-confirm-apply', {
                    'totradeList1': totradeList,
                    "config": config,
                    "title": '还款计划',
                    "goback": true,
                    "utils": require("../common/utils"),
                    shop: Shop[req.params.prodType] || {},
                });
            });
                
                
                
                
                
                
                
                
                
              
                
            }                          

   


})



function buildPhone(phone) {
    return phone.substr(0, 3) + "****" + phone.substr(7, 4);
}
router.get('/tongxinrenzheng', function(req, res) {
    if (!req.session.user || !req.session.user.phoneNumber) return res.redirect(config.base.h5domain + 'user/login?tourl=' + config.base.promodomain + 'm9/tongxinrenzheng');
    // if (test) {
    //     var json = {
    //         "success": true,
    //         "msg": null,
    //         "data": {
    //             "mobileOperator": "中国联通",
    //             "jxlMobileAuthNum": " 3",
    //             "jxlMobileAuthStatus": "AS",
    //             "failAffirmFlag": "Y",
    //             "guangdongCMCC": "N"
    //         },
    //         "msgType": "info",
    //         "global": false,
    //         "msgCode": null
    //     };
    //     res.render('m9/tongxinrenzheng', {
    //         "config": config,
    //         "user": req.session.user,
    //         "phone": buildPhone(req.session.user.phoneNumber) + "(" + (json.data.mobileOperator || "未知电话") + ")",
    //         "juxinli": json.data,
    //         "title": '通信认证',
    //         "goback": true
    //     });
    //     return;
    // }
    wsclient.findJxlAuth({
        CUST_ID: req.session.user.custId
    }, function(json) {
        if (json.data.jxlMobileAuthStatus == "AS"){

            return res.redirect('/m9/fenqifuwu-detail/ygjs_p2'); //success
        } 
        if (json.data.jxlMobileAuthStatus == "AD") return res.redirect('/m9/shoujirenzheng-status/4'); //during
        if (json.data.jxlMobileAuthStatus == "AF") {}
        console.log(json.data.jxlMobileAuthStatus+'----------------------------------------------');
        res.render('m9/tongxinrenzheng', {
            "config": config,
            "user": req.session.user,
            "phone": buildPhone(req.session.user.phoneNumber) + "(" + (json.data.mobileOperator || "未知电话") + ")",
            "juxinli": json.data,
            "title": '通信认证',
            "goback": true,
            "jxlMobileAuthStatus":json.data.jxlMobileAuthStatus||''
            
        });
    })
});

router.get('/chongzhifuwumima', function(req, res) {
    res.render('m9/chongzhifuwumima', {
        "config": config,
        "title": '重置服务密码',
        "goback": true
    });
});

router.get('/shenmeshitongxinrenzheng', function(req, res) {
    res.render('m9/shenmeshitongxinrenzheng', {
        "config": config,
        "title": '什么是通信认证？',
        "goback": true
    });
});

router.post('/jxlMobileAuth', function(req, res) {
    if (!req.session.user) return res.send({
        nologin: true
    });
    wsclient.jxlMobileAuth({
        CUST_ID: req.session.user.custId,
        password: req.body.password,
        resendSmsCode: req.body.resendSmsCode,
        smsCode:req.body.smsCode,
        type:req.body.type,
        mod:'H5',
        // requiredSmsCode:req.body.requiredSmsCode
    }, function(json) {
        console.log(json);
        res.send(json);
    });
});

router.post('/findJxlAuth', function(req, res) {
    if (!req.session.user) return res.send({
        nologin: true
    });
    wsclient.findJxlAuth({
        CUST_ID: req.session.user.custId
    }, function(json) {
        console.log(json);
        res.send(json);
    })
});

router.post('/checkToGoDetail', function(req, res) {
    if (!req.session.user) return res.send({
        a: true
    });
    wsclient.getLatestLoan({
        CUST_ID: req.session.user.custId,
        "prodType": req.body.prodType
    }, function(json) {
        console.log(json);
        if(!json || !json.data){
            json={
                data:{}
            }
        }
        wsclient.getProdPackCustInfo({
            CUST_ID: req.session.user.custId,
            "prodType": req.body.prodType
        }, function(json2) {
            console.log("-----------"+JSON.stringify(json2.data));
            var sendObj = {
                a: '',
                b: '',
                c: '',
                d: '',
                e: '',
                a2: ''
            };
            var repayStatus = json.data.repayStatus;
            var auditStatus = json.data.auditStatus;
            if (repayStatus && "EARLY_REPAY" != repayStatus && "SETTLED" != repayStatus) {
                sendObj.b = '1';
            } else if (auditStatus == "AUDITING") {
                sendObj.d = '1';
            } else if (auditStatus == "PASS") {
                
                sendObj.e = '/m9/fengkong-status/3/' + req.body.prodType;
            } else if (false === checkCustInfo(json2.data)) {
                sendObj.c = '1';
            } else if (-1 === checkCustInfo(json2.data)) { /*juxinli need and failed auth*/
                sendObj.a2 = '1';
            }
            res.send(sendObj);
        });
    });
});

function checkCustInfo(checkJson) {
    var itemCfgVal = checkJson.itemCfgVal;
    var creditAuth = checkJson.creditAuth;
    if (!checkJson) return false;
    if (!itemCfgVal || !creditAuth) return false;
    var validate = true;
    var otherValidate = true;
    var lastJuxinliIndex = 9;
    var lastIndex = 0; /*from left to right*/
    while (itemCfgVal > 0) {
        lastIndex++;
        console.log(itemCfgVal % 2, creditAuth % 2, itemCfgVal % 2 > creditAuth % 2)
        if (itemCfgVal % 2 > creditAuth % 2) {
            validate = false;
            if (lastJuxinliIndex != lastIndex) {
                otherValidate = false;
            }
        }
        itemCfgVal = itemCfgVal >> 1;
        creditAuth = creditAuth >> 1;
    }
    if (!otherValidate) return false;
    if (!validate) return -1; //other has passed without juxinli
    return validate;
}

router.get('/fengkong-status/:status/:prodType/:repayamount?', function(req, res) {
    if (!req.session.user) return res.redirect(config.base.h5domain + 'user/login?tourl=' + config.base.promodomain + 'm9/fengkong-status/' + req.params.status + (req.params.prodType ? '/' + req.params.prodType : ''));
    /*1成功2失败3支付中*/
    var status = req.params.status;
    var prodType = req.params.prodType || "";
    var repayamount = req.params.repayamount || "";
    wsclient.getLatestLoan({
        CUST_ID: req.session.user.custId,
        prodType: prodType
    }, function(json) {
        var prodType_final 
            if (req.params.prodType == 'ygjb_p1') {
                prodType_final = 'ECEI'
            } else if(req.params.prodType == 'ygjs_p2'){
                prodType_final = 'LCI'
            }           
        console.log(json);
        if (!json.data.productPrice) return res.send('没有借款记录');
        if(req.params.prodType == 'ygjb_p1'){
            wsclient.repayDetailList({
                returnPoint: 16.67,
                productPrice: json.data.productPrice,
                loanRate: 10.8,
                loanTerm: json.data.loanTerm,
                repayMethod: prodType_final,
            }, function(json2) {
                console.log(json2);
                var totradeListOrigin = json2.data;
                var totradeList = [];
                for (var i = 0; i < totradeListOrigin.length; i++) {
                    var totrade = totradeListOrigin[i];
                    totradeList.push({
                        term: totrade.repayDate + "/" + totradeListOrigin.length + "期",
                        repayamount: parseFloat(totrade.repaySum).toFixed(2) + "元",
                        repaydate: totrade.repayTime
                    });
                }
                res.render('m9/fengkong-status', {
                    status: status,
                    title: status == 3 ? '分期支付中' : (status == 1 ? '确认申请' : '确认申请'),
                    goback: false,
                    shop: {
                        prodName: Shop[req.params.prodType].shopName,
                        price: json.data.productPrice,
                        totradeList: totradeList
                    },
                    prodType: prodType || ""
                });
            })
        }else if(req.params.prodType == 'ygjs_p2'){
            wsclient.repayPlan4ALB({                     
                    productPrice: json.data.productPrice, 
                    loanTerm: json.data.loanTerm,
                    custId:req.session.user.custId
                }, function(json2) {
                    var totradeListOrigin = json2.data
                    var totradeList = [];
                    for (var i = 0; i < totradeListOrigin.length; i++) {
                        var totrade = totradeListOrigin[i];
                        totradeList.push({
                            term: totrade.repayDate + "/" + totradeListOrigin.length + "期",
                            repayamount: parseFloat(totrade.repaySum).toFixed(2) + "元",
                            repaydate: totrade.repayTime
                        });
                    }
                    totradeList[0].repayamount = repayamount;
                    res.render('m9/fengkong-status', {
                        status: status,
                        title: status == 3 ? '分期支付中' : (status == 1 ? '确认申请' : '确认申请'),
                        goback: false,
                        shop: {
                            prodName: Shop[req.params.prodType].shopName,
                            price: json.data.productPrice,
                            totradeList: totradeList
                        },
                        prodType: prodType || ""
                    });
            });

        }
    });
});

router.post('/validateShopCode', function(req, res) {
    if (!req.session.user) return ses.send({
        nologin: true
    })
    wsclient.validateShopCode({
        CUST_ID: req.session.user.custId,
        "prodType": req.body.prodType,
        "code": req.body.code
    }, function(json) {
        console.log(json);
        res.send(json);
    });
});

router.get('/fenqifuwu-confirm/:prodType/:shopCode?', function(req, res) {

    wsclient.showProtocol({
        CUST_ID:req.session.user.custId,
        type:'intermediary',
      
        bdfPrjType:req.params.bdfPrjType,
    }, function(json) {
        res.render('m9/fenqifuwu-confirm', {
            "shopCode": req.params.shopCode || "",
            "config": config,
            "title": '确认申请',
            "utils": require("../common/utils"),
            "shop": Shop[req.params.prodType],
            "intermediary":json.data.isSign==1?true:false
        });
    });
    
});

router.post('/appLoan4Channel', function(req, res) {
    var projectName2;
    if(req.body.prodType=='ygjb_p1'){
        projectName2='易换机屏安服务套餐'
    }else if(req.body.prodType=='ygjs_p2'){
        projectName2='易换机爱萝卜手机分期'
    }

    if (!req.session.user) return res.send({
        nologin: true
    });
    if (!req.body.prodType || !req.body.appAmount || !req.body.appTerm || !req.body.code) {
        return res.send({
            msg: '参数缺失'
        });
    }
    wsclient.appLoan4Channel({
        "CUST_ID": req.session.user.custId, //用户ID
        "prodType": req.body.prodType, //借款产品类型
        "appAmount": req.body.appAmount, //申请金额
        "projectName": projectName2,
        "appTerm": req.body.appTerm, //申请期限
        "code": req.body.code //服务代码（店员）
    }, function(json) {
        console.log(json);
        res.send(json);
    });
});


router.post('/requestLoanStatus', function(req, res) {
    if (!req.session.user) return res.send({
        nologin: true
    });
    wsclient.getLatestLoan({
        CUST_ID: req.session.user.custId,
        "prodType": req.body.prodType
    }, function(json) {
        console.log(json);
        if (!json.success) {
            return res.send(json);
        }
        var auditStatus = json.data.auditStatus;
        return res.send({
            status: (auditStatus == "RETURN" ? 1 : (auditStatus == "LOANED" || auditStatus == "NO_COLLECT" ? 2 : (auditStatus == "PASS" || auditStatus == "VIEW_PREPARE" ? 3 : 4)))
        });
        /*the same as fllow*/
        if (auditStatus == "RETURN") { //sheng qing mei you tong guo
            res.send({
                status: 1
            });
        } else if (auditStatus == "LOANED" || auditStatus == "NO_COLLECT") { //sheng qing yi jing tong guo
            res.send({
                status: 2
            })
        } else if (auditStatus == "PASS" || auditStatus == "VIEW_PREPARE") { //zhifuzhong
            res.send({
                status: 3
            })
        } else {
            console.log('=============================================')
            console.log(auditStatus)
                //+exception其他状态，+
            res.send({
                status: 4
            });
        }
    });
});

router.post('/repayDetailList', function(req, res) {
    wsclient.repayDetailList(req.body, function(json) {
        return res.send(json);
    });
});


router.post('/repay_success', function(req, res) { 
    res.render('m9/repay_success', {
        "config": config,
        "title": '还款成功',
        "goback": true,       
    });
            
})
       



//点击右箭头详情页
router.get('/repayment_details/:id/:change/:actRepayAmount/:capital/:interest/:actOverdueFee/:term/:loanTerm/:repayDate/:projectName/:platformFee/:earlyRepayProcedureFee', function(req, res) {
         
    res.render('m9/repayment_details', {
        "title": "还款详情",
        "id": req.params.id,
        "change": req.params.change,
        "amount": req.params.actRepayAmount,
        "capital": req.params.capital,
        "interest": req.params.interest,
        "overdueFee": req.params.actOverdueFee,
        "term": req.params.term,
        "loanTerm": req.params.loanTerm,
        "repayDate": req.params.repayDate,
        'text':req.params.text,
        'projectName':req.params.projectName,
        "platformFee":req.params.platformFee,
        "earlyRepayProcedureFee":req.params.earlyRepayProcedureFee,
      
        "config": config,
        "goback": true
    })
});


router.get("/repay_list/:id?", function(req, res) {
    if (!req.session.user){
        // res.redirect(config.base.h5domain+"user/login?tourl="+config.base.promodomain+"m9/repay_list/r2");
        res.redirect('toapp//login')
    }
    var active_tab = req.params.id;
    var filterRepayStatus = active_tab == "r2"?"SETTLED,WAIT_PAYOFF,EARLY_REPAY":"SETTLED,EARLY_REPAY,NORMAL,OVERDUE_REPAID";
    if (req.params.id == 'r2') {
        wsclient.repay_list_early({
            "CUST_ID": req.session.user.custId //用户ID
                ,
            "prodType": "ygjb_p1" //借款产品类型
                ,
            "fullRepay": active_tab=="r2"?"Y":"N" //是否全部结清;String(Y/N)
        }, function(json) {
           
            var repayList = [];
            var temp;
            var repayStatus;
           
            
            for(var i=0;i<json.data.recordList.length;i++ ){
                
                temp = json.data.recordList[i];
                repayStatus = temp.repayStatus;
                if (filterRepayStatus.indexOf(repayStatus)<0) {
                    temp.repayAmount=parseFloat(temp.repayAmount).toFixed(2);
                    temp.repayCapital=parseFloat(temp.repayCapital).toFixed(2);
                    temp.repayInterest=parseFloat(temp.repayInterest).toFixed(2);
                    temp.overdueFee=parseFloat(temp.overdueFee).toFixed(2);
                    repayList.push(temp);
                }
            }     
            //如果是按期还款,按照还款日期排序             
             repayList.sort(function(a, b) {
                 return Date.parse(a.repayDate) - Date.parse(b.repayDate);
             });
                                         
            wsclient.customerAccount({
                custId: req.session.user.custId
            }, function(json) {             
                var am = json.data.availableamount;
                res.render('m9/repay_list', {
                    'projectName':'易换机：易换机屏安服务套餐详情',
                    'active_tab': req.params.id,
                    'repayList': repayList,
                    'remaining': am,
                    'h5domain': config.base.h5domain,                  
                    "title": '提前还款'
                   
                });
            });
        })
    } else if (req.params.id == 'r3') {
        wsclient.repay_list({
            "CUST_ID": req.session.user.custId //用户ID
                ,
            "prodType": "all" //借款产品类型
                ,
            "fullRepay": "N" //是否全部结清;String(Y/N)
        }, function(json) {
            console.log(json.data.recordList)
            json.data.recordList.sort(function(a, b) {
                return a.actualPayTime < b.actualPayTime
            })
            wsclient.customerAccount({
                custId: req.session.user.custId
            }, function(result) {
                var am = result.data.availableamount;
                res.render('m9/repay_list', {
                    'projectName':'易换机：易换机屏安服务套餐详情',
                    'active_tab': req.params.id,
                    'remaining': am,
                    'h5domain': config.base.h5domain,                    
                    "title": '还款记录',
                    "time_count": json.data.recordList
                    
                });
            });
        })
    }else if(req.params.id == 'r1'){  
        wsclient.repay_list_early({ 
            "CUST_ID": req.session.user.custId, //用户ID
        "prodType": "all", //借款产品类型               
            "fullRepay": "N" //是否全部结清;String(Y/N)
        },function(json){
            var repayList = json.data.recordList;
            var serverTime = json.data.serverTime;
             //如果是按期还款,按照还款日期排序             
            repayList.sort(function(a, b) {
                return Date.parse(a.repayDate) - Date.parse(b.repayDate);
            }); 
            var tempObj = null;           
            var loanId = "" ;
            for(var i = 0;i<repayList.length;i++){
                tempObj = repayList[i];
                tempObj.repayAmount=parseFloat(tempObj.repayAmount).toFixed(2);
                tempObj.repayCapital=parseFloat(tempObj.repayCapital).toFixed(2);
                tempObj.repayInterest=parseFloat(tempObj.repayInterest).toFixed(2);
                tempObj.overdueFee=parseFloat(tempObj.overdueFee).toFixed(2);
                if(Date.parse(serverTime.substring(0,10))>Date.parse(tempObj.lastRepayDate.substring(0,10))){
                    tempObj.allowcheck = 1;
                }else{
                    tempObj.allowcheck = tempObj.term == 1 ? 1 : 0 ; 
                }
                if(loanId.indexOf(tempObj.loanId)<0){
                    loanId = i==0?loanId+tempObj.loanId:loanId+","+tempObj.loanId;
                    tempObj.allowpay = 1;
                }else{
                    tempObj.allowpay = 0;
                }
            }

            


            wsclient.customerAccount({
                custId: req.session.user.custId
            }, function(json) {             
                var am = json.data.availableamount;
                res.render('m9/repay_list', {
                    'active_tab': req.params.id,
                    'repayList': repayList,
                    'remaining': am,
                    'h5domain': config.base.h5domain,                  
                    "title": '按期还款'               
                });
            });
        });    
    }

});
router.post('/repay', function(req, res) {
    wsclient.repay_togo({
        loanId: req.body.loanId,
        redPurseId: '', //红包ID
        repayPlanList: req.body.repayPlanList,
        fullRepay: req.body.repayType == "r2" ? "Y" : "N",
        CUST_ID: req.session.user.custId
    }, function(json) {
        res.send(json);
    });
})








/*
 *分组函数
 *@param list需要进行分组的数组
 *@param property 按照 传入的property进行分组  
*/
function group(list,property){
    var resultList = [];
    var group = [];
    for(var i=0;i<list.length;i++){
        var temp = list[i];
        if(group.indexOf(temp[property])==-1){
            group.push(temp[property]);
        }
    }
    for(var j=0;j<group.length;j++){
        var currentGroup = group[i];
        var tempArr =[];
        for(var k=0;k<list.length;k++){
            if(list[k][property]==group[j]){
                tempArr.push(list[k]);
            }
        }
        resultList.push(tempArr);
    }
    return resultList;
}
/*
 *组织提前还款数据
 *  
*/
function disposeRepayEarlyList(list){
    var resultList = [];
    var tempObj;
    var temp;
    for(var i=0;i<list.length;i++){
        tempObj = {
            loanId:"",
            repayPlanList:"",
            repayAmount:0,   //还款金额
            projectName:"",
            loanTerm:0,
            repayCapital:0,  //应还本金
            repayInterest:0, //应收利息
            repayCapital:0,  //应还本金


        };
        for(var j=0;j<list[i].length;j++){
            temp = list[i][j];
            tempObj.loanId = temp.loanId;
            tempObj.repayPlanList = j==0?tempObj.repayPlanList+temp.term:tempObj.repayPlanList+","+temp.term;
            tempObj.repayAmount+=temp.repayAmount;
            tempObj.projectName=temp.projectName;
            tempObj.loanTerm=temp.loanTerm;
        }
        resultList.push(tempObj);
    }
    return resultList;
}

module.exports = router;