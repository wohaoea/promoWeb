var express = require('express')
var router = express.Router()
var wsclient = require('../common/wsclient')
var utils = require('../common/utils')
var config = require('../config')
var messages = require('../common/messages')
var path = require('path')
var logger = require('../common/logger')
var appdb = require('../common/appdb');

/**
 *  weixin user sign
 */
router.get('/wxuserSign',function(req,res){
    var version = req.query.version;
    var session = req.session;
    if( session.user ){
        wsclient.getSignInfo({
            custId: session.user.custId
        },function(result){
            result.dayArr = [3,7,15,28];
            result.awardArr = ['rateCouponA','redEnevlopeA','rateCouponB','redEnevlopeB']
            result.isTodaySign = result.data.isTodaySign;
            result.signCount = result.data.signCount;
            result.data = {
                "rateCouponA": result.data.rateCouponA,
                "redEnevlopeA": result.data.redEnevlopeA,
                "rateCouponB": result.data.rateCouponB,
                "redEnevlopeB": result.data.redEnevlopeB
            }
            result.url = '';
            res.render('nwusersign',result)
        })
    }else{
        var result = {}
        result.dayArr = [3,7,15,28];
        result.awardArr = ['rateCouponA','redEnevlopeA','rateCouponB','redEnevlopeB']
        result.isTodaySign = false
        result.signCount = 0;
        result.data = {
            "rateCouponA": 'NO_AWARD',
            "redEnevlopeA": 'NO_AWARD',
            "rateCouponB": 'NO_AWARD',
            "redEnevlopeB": 'NO_AWARD'
        }
        result.url = '/account/login';
        res.render('nwusersign',result)
    }
})

/**
 *  niuwaApp user sign
 */
router.get('/userSign',function(req,res){
    var version = req.query.version;
    var token = req.query.sign;
    var session = req.session;
    if( token ){
        if( session.user && session.user.token == token ){
            wsclient.getSignInfo({
                custId: session.user.custId
            },function(result){
                result.dayArr = [3,7,15,28];
                result.awardArr = ['rateCouponA','redEnevlopeA','rateCouponB','redEnevlopeB']
                result.isTodaySign = result.data.isTodaySign;
                result.signCount = result.data.signCount;
                result.data = {
                    "rateCouponA": result.data.rateCouponA,
                    "redEnevlopeA": result.data.redEnevlopeA,
                    "rateCouponB": result.data.rateCouponB,
                    "redEnevlopeB": result.data.redEnevlopeB
                }
                result.url = '';
                res.render('nwusersign',result)
            })
        }else{
            appdb.findUserBySign(token, function(result){
                if(result){
                    session.user = {
                        custId:result.CUST_ID,
                        token:token
                    };
                    wsclient.getSignInfo({
                        custId: session.user.custId
                    },function(result){
                        result.dayArr = [3,7,15,28];
                        result.awardArr = ['rateCouponA','redEnevlopeA','rateCouponB','redEnevlopeB']
                        result.isTodaySign = result.data.isTodaySign;
                        result.signCount = result.data.signCount;
                        result.data = {
                            "rateCouponA": result.data.rateCouponA,
                            "redEnevlopeA": result.data.redEnevlopeA,
                            "rateCouponB": result.data.rateCouponB,
                            "redEnevlopeB": result.data.redEnevlopeB
                        }
                        result.url = '';
                        res.render('nwusersign',result)
                    })
                }else{
                    var result = {}
                    result.dayArr = [3,7,15,28];
                    result.awardArr = ['rateCouponA','redEnevlopeA','rateCouponB','redEnevlopeB']
                    result.isTodaySign = false
                    result.signCount = 0;
                    result.data = {
                        "rateCouponA": 'NO_AWARD',
                        "redEnevlopeA": 'NO_AWARD',
                        "rateCouponB": 'NO_AWARD',
                        "redEnevlopeB": 'NO_AWARD'
                    }
                    if(version){
                        result.url = "toapp://login"
                    }else{
                        result.url = "toast"
                    }
                    res.render('nwusersign',result)
                }
            });
        }
    }else{
        var result = {}
        result.dayArr = [3,7,15,28];
        result.awardArr = ['rateCouponA','redEnevlopeA','rateCouponB','redEnevlopeB']
        result.isTodaySign = false
        result.signCount = 0;
        result.data = {
            "rateCouponA": 'NO_AWARD',
            "redEnevlopeA": 'NO_AWARD',
            "rateCouponB": 'NO_AWARD',
            "redEnevlopeB": 'NO_AWARD'
        }
        if(version){
            result.url = "toapp://login"
        }else{
            result.url = "toast"
        }
        res.render('nwusersign',result)
    }
})

router.get('/sign4InvestApp',function(req,res){
    wsclient.sign4InvestApp({
        "custId" : req.session.user.custId
    },function(result){
        res.send(result)
    })
})

router.post('/getAward',function(req,res){
    wsclient.getAward({
        "custId": req.session.user.custId,
        "awardType": req.body.awardType
    },function(result){
        res.send(result)
    })
})

router.get('/restartAtivity',function(req,res){
    wsclient.restartAtivity({
        "custId": req.session.user.custId
    },function (result) {
        res.send(result)
    })
})

module.exports = router