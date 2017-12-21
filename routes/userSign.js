var express = require('express')
var router = express.Router()
var wsclient = require('../common/wsclient')
var utils = require('../common/utils')
var config = require('../config')
var messages = require('../common/messages')
var path = require('path')
var logger = require('../common/logger')

router.get('/userSign', function(req, res) {
    var arr = [];
    var pointArr = [];
    var sign = req.query.sign;
    if (!sign) {
        sign = ''
    }
    wsclient.findOneBySign({
        "head": {
            "sign": sign
        },
        "con": {

        }
    }, function(result) {
        if (result.body && result.body.custId) {
            var custId = result.body.custId;
            req.session.custId = custId;
            wsclient.getSignAward({
                custId: custId
            }, function(result) {
                if (result.success) {
                    var signPrize = result.data.config.signPrize;
                    var signCount = result.data.signCount;
                    var start = result.data.config.signStartTime.replace(/-/g, '.').substring(0, 10);
                    var end = result.data.config.signEndTime.replace(/-/g, '.').substring(0, 10);
                    for (key in signPrize) {
                        pointArr.push(signPrize[key].integral)
                    }

                    if (result.data.isTodaySign) {
                        today = signCount;
                    } else {
                        today = signCount + 1;
                    }
                    for (var i = 0; i < signCount; i++) {
                        arr.push(i);
                    }

                    var dayArr = ['一', '二', '三', '四', '五', '六', '七'];
                    res.render('userSign', {
                        today: today,
                        arr: arr,
                        pointArr: pointArr, // 签到获得的积分奖励
                        dayArr: dayArr, // 将数字转换为中文
                        startTime: start, //活动开始时间
                        endTime: end //活动结束时间
                    })
                }
            })
        } else {
            res.send(result.head.msg);
        }
    })
})

router.post('/userSignStatus', function(req, res) {
    wsclient.signGetAward({
        custId: req.session.custId,
        integral: req.body.integral
    }, function(result) {
        res.send(result);
    })
})

module.exports = router