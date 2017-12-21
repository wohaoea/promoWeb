/**
 *  感恩节摇一摇活动
 */
var express = require('express')
var router = express.Router()
var wsclient = require('../common/wsclient')
var utils = require('../common/utils')
var config = require('../config')
var messages = require('../common/messages')
var path = require('path')
var logger = require('../common/logger')
var appdb = require('../common/appdb')
var winnerInfo = require('../common/winnerInfo')

router.get('/shake',function(req,res){
    var sign = req.query.sign;
    if (!sign) {
        sign = ''
    }
    appdb.findUserBySign(sign, function(result) {
        if(result&&result.CUST_ID){
            req.session.user = {
                custId: result.CUST_ID
            }
            wsclient.getActivityInfo({
                custId: req.session.user.custId
            },function(result){
                if(result.success){
                    res.render('thanksGiving_active',{
                        activityInfo: result.data,
                        "isLogin": 1
                    })
                }else{
                    res.send(result.msg)
                }
            })
        }else{
            var custId = undefined;
            req.session.user = {
                custId: custId
            };
            res.render('thanksGiving_active',{
                activityInfo: {
                    "ingotsCount": 8888,
                    "awardDrawTimes": 888,
                    "freeDrawTimes": 3
                },
                "isLogin": 0
            })
        }
    })
})

/**
 *  查询获奖名单
 */
router.get('/winnerList',function(req,res){
    wsclient.winnerList({

    },function(result){
        if(result.success){
            var winnerList = result.data;
            if(winnerList.length < 30){
                winnerInfo.splice(30-winnerList.length,winnerList.length)
                winnerList.push.apply( winnerList, winnerInfo );
            }
            res.send(winnerList) 
        }else{
            res.send(result.msg) 
        }
        
    })
})

/**
 *  摇一摇
 */
router.post('/userdraw',function(req,res){
    if(req.session.user&&req.session.user.custId){
        var shakeType = req.body.shakeType;
        wsclient.shake({
            custId: req.session.user.custId,
            shakeType: shakeType
        },function(result){
            result.isLogin = true;
            res.send(result)
        })
    }else{
        res.send({
            success: false,
            msgCode: '000000',
            msg: '请登录后参与活动',
            isLogin: false
        })
    }
})

router.get('/conversion',function(req,res){
    var arr = [5,10,20,50,100,500];
    var prizeCodeEnum1 = ['redEnevlopeA','redEnevlopeB','redEnevlopeC','redEnevlopeD','redEnevlopeE','redEnevlopeF'];
    var prizeCodeEnum2 = ['rateCouponA','rateCouponB','rateCouponC','rateCouponD','rateCouponE','rateCouponF']
    var rates = [0.7,0.8,0.9,1.0,1.1,1.2];
    var arr2 = [500,600,700,800,900,1000];
    if(req.session.user&&req.session.user.custId){
        wsclient.getActivityInfo({
            custId: req.session.user.custId
        },function(result){
            if(result.success){
                res.render('shake_conversion',{
                    arr: arr,
                    rates: rates,
                    arr2: arr2,
                    prizeCodeEnum1: prizeCodeEnum1,
                    prizeCodeEnum2: prizeCodeEnum2,
                    ingotsCount: result.data.ingotsCount,
                    isLogin: true
                })
            }else{
                res.send(result.msg)
            }
        })
    }else{
        res.render('shake_conversion',{
            arr: arr,
            rates: rates,
            arr2: arr2,
            prizeCodeEnum1: prizeCodeEnum1,
            prizeCodeEnum2: prizeCodeEnum2,
            ingotsCount: 8888,
            isLogin: false
        })
    }
})

/**
 *  兑换奖励
 */
router.post('/exchangeThanksGivingAward',function(req,res){
    if(req.session.user&&req.session.user.custId){
        var awardType = req.body.awardType;
        wsclient.exchangeThanksGivingAward({
            custId: req.session.user.custId,
            awardType: awardType
        },function(result){
            result.isLogin = true;
            res.send(result)
        })
    }else{
        res.send({
            isLogin: false
        })
    }
})

/**
 *  用户抽奖信息
 */
router.get('/getActivityInfo',function(req,res){
    if(req.session.user&&req.session.user.custId){
        wsclient.getActivityInfo({
            custId: req.session.user.custId
        },function(result){
            if(result.success){
                result.data.isLogin = true;
                result.data.success = true;
                res.send(result.data)
            }else{
                res.send(result.msg)
            }
        })
    }else{
        res.send('请登录后参与活动')
    }
})

router.post('/insertShareData',function(req,res){
    var custId;
    if(req.session.user&&req.session.user.custId){
        custId = req.session.user.custId
    }
    wsclient.insertShareData({
        "CUST_ID": custId,
        "activityNo":"HD171123"
    },function(result){
        res.send(result)
    })
})
module.exports = router;