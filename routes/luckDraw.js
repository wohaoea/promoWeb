var express = require('express')
var router = express.Router()
var wsclient = require('../common/wsclient')
var utils = require('../common/utils')
var config = require('../config')
var messages = require('../common/messages')
var path = require('path')
var logger = require('../common/logger')


// 幸运抽奖活动
router.get('/luckDraw', function(req, res) {
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
        var getLotteryNumber;
        var point;
        if (result.head.st == "91") {
            var custId = undefined
            req.session.custId = custId;
            getLotteryNumber = 0;
            point = 0;
            res.render('luckDraw/index', {
                chance: getLotteryNumber,
                point: point,
                isEnd: req.session.luckDraw.isEnd,
                isLogin: false
            });
        } else {
            var custId = result.body.custId;
            // var custId = 25601554; // 测试用户
            req.session.custId = custId;
            wsclient.getLotteryNumber({ custId: custId }, function(result) {
                getLotteryNumber = result.data.number;
                point = result.data.integral;
                res.render('luckDraw/index', {
                    chance: getLotteryNumber,
                    point: point,
                    isEnd: req.session.luckDraw.isEnd,
                    isLogin: true
                });
            });
        }
    })
})

//所有获奖用户
router.get('/listLotteryWinner', function(req, res) {
    wsclient.listLotteryWinner({}, function(result) {
        var html = '';
        listLotteryWinner = result.data;
        if(listLotteryWinner){
            if (listLotteryWinner.length == 0) {
                html = '<li class="none">暂无中奖名单</li>';
            } else {
                for (var i = 0; i < 10; i++) {
                    html += '<li>' +
                        '<span class="userId fl">' +
                        listLotteryWinner[i].loginName +
                        '</span>' +
                        '<span class="awards fr">' +
                        listLotteryWinner[i].prizeName +
                        '</span>' +
                        '</li>'
                }
            }
        }else{
            html = '<li class="none">暂无中奖名单</li>';
        }
        
        res.send({
            html: html
        })
    })
})


//查询用户的获奖记录
router.get('/luckDrawAward', function(req, res) {
    if (req.session.custId) {
        wsclient.listWinningRecord({ custId: req.session.custId }, function(result) {
            var available = [];
            var disavailable = [];
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].available) {
                    available.push(result.data[i]);
                } else {
                    disavailable.push(result.data[i]);
                }
            }
            available.sort(function(a, b) {
                return Date.parse(b.winningTime) - Date.parse(a.winningTime);
            });
            disavailable.sort(function(a, b) {
                return Date.parse(b.winningTime) - Date.parse(a.winningTime);
            });

            var data = available.concat(disavailable);
            res.render('luckDraw/award', {
                data: data,
                isEnd: req.session.luckDraw.isEnd
            })
        })
    } else {
        res.send({ url: "toapp://login" })
    }
})

//获得剩余抽奖次数接口
router.get('/chance', function(req, res) {
    if (req.session.custId) {
        wsclient.getLotteryNumber({ custId: req.session.custId }, function(result) {
            res.send({ number: result.data.number, point: result.data.integral })
        })
    } else {
        res.send({ number: 0, point: 0, isLogin: false, url: "toapp://login " })
    }
})

//获取抽奖结果
router.get('/draw', function(req, res) {
    var position = {
        mitigateInterest30: 0,
        cash8: 1,
        mitigateLoanAmount50: 2,
        cash58: 3,
        mitigateLoanAmount25: 4,
        datastream10: 5,
        thanks: 6,
        datastream100: 7
    }
    wsclient.draw({ custId: req.session.custId }, function(result) {
        var key = result.data.prizeNo;
        var usercode;
        prizeNo = position[key];
        if(!req.session.luckDraw.isEnd && key == 'thanks'){
            wsclient.getCommerceCoupon({
                custId: req.session.custId
            },function(json){
                if(json.success){
                    usercode = json.data;
                    res.send({
                        prizeNo: prizeNo,
                        number: result.data.number,
                        point: result.data.integral,
                        arr: req.session.luckDraw.awardList,
                        isEnd: req.session.luckDraw.isEnd,
                        usercode: usercode,
                        isSuccess: true
                    })
                }else{
                    res.send({
                        prizeNo: prizeNo,
                        number: result.data.number,
                        point: result.data.integral,
                        arr: req.session.luckDraw.awardList,
                        isEnd: req.session.luckDraw.isEnd,
                        usercode: result.msg,
                        isSuccess: false
                    })
                }
            })
        }else{
            res.send({
                prizeNo: prizeNo,
                number: result.data.number,
                point: result.data.integral,
                arr: req.session.luckDraw.awardList,
                isEnd: req.session.luckDraw.isEnd,
                usercode: usercode,
                isSuccess: true
            })
        }
    })
})

//领取奖品
router.post('/acceptPrize', function(req, res) {
    var recordNo = req.body.recordNo;
    var projectNo = req.body.projectNo;
    wsclient.acceptPrize({
        custId: req.session.custId,
        recordNo: recordNo
    }, function(result) {
        res.send({ data: result.data });
    })
})

// 领取本金/利息
router.post('/acceptMitigate', function(req, res) {
    var recordNo = req.body.recordNo;
    var projectNo = req.body.projectNo;
    wsclient.acceptMitigate({
        custId: req.session.custId,
        recordNo: recordNo,
        projectNo: projectNo
    }, function(result) {
        res.send({ data: result });
    })
})

// 获取用户积分
router.get('/userPoint', function(req, res) {
    var point = 600;
    res.send({ point: point });
})

module.exports = router