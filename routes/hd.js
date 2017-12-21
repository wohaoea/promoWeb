var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var messages = require('../common/messages');
var logger = require('../common/logger');
var config = require('../config');
var constants = require('../common/constants');

/*福袋活动-验证是否已领取过福袋*/
router.get('/pra/authfudai', function(req, res, next) {
    var user = req.session.user;
    var ejsvar = utils.getMenuArg("福袋活动", user, 'fudai', req, res);
    if(!user) res.send(utils.getFailResult('','','login'));
    if(1==1){

      wsclient.checkNewYearPrizeStatus({
                custId: user.custId
            },
            function(wsresult) {
                if(wsresult.data=="0"){
                    wsresult.fudaiList = '<ul class="fudai-list"><li class="redpack">8元红包</li><li class="redpack">58元红包</li><li class="jxq">0.5%</li><li class="jxq">1%</li></ul>';
                }else{
                    wsresult.fudaiList="";
                }  
                res.send(utils.getSuccessResult(wsresult));  
        });

    }else{

        var wsresult={
          "success": true, //服务器异常为false
          "msg": "成功",
          "data": "1",    //"1"：未领取,"0"：已领取
          "msgType": "info",
          "global": false
        }
        wsresult.fudaiList = '<ul class="fudai-list"><li class="redpack">8元红包</li><li class="redpack">58元红包</li><li class="jxq">0.5%</li><li class="jxq">1%</li></ul>';

        res.send(utils.getSuccessResult(wsresult)); 
    }         
});

/*福袋活动-获取福袋*/
router.get('/pra/getfudai', function(req, res, next) {
    var user = req.session.user;
    var ejsvar = utils.getMenuArg("福袋活动", user, 'fudai', req, res);
    if(!user) res.send(utils.getFailResult('','','login'));

    if(1==1){

        wsclient.sendPrize({
                custId: user.custId,
                type:"luckbag"
            },
            function(wsresult) {
                if(wsresult.success){
                    wsresult.fudaiList = '<ul class="fudai-list"><li class="redpack">8元红包</li><li class="redpack">58元红包</li><li class="jxq">0.5%</li><li class="jxq">1%</li></ul>';
                }else{
                    res.send(utils.getFailResult(wsresult.msg,'','err'));
                }
                
                res.send(utils.getSuccessResult(wsresult));  
        });

    }else{

        var wsresult={
          "success": true, //服务器异常为false
          "msg": "失败",
          "data": "1",    //"1"：未领取,"0"：已领取
          "msgType": "info",
          "global": false
        }
        wsresult.fudaiList = '<ul class="fudai-list"><li class="redpack">8元红包</li><li class="redpack">58元红包</li><li class="jxq">0.5%</li><li class="jxq">1%</li></ul>';
       if(!wsresult.success){
            res.send(utils.getFailResult('系统繁忙，请稍候再试！')); 
       }else{
           res.send(utils.getSuccessResult(wsresult)); 
       }

        
    }

});

/*福袋活动-设置状态*/
router.get('/pra/setfudaion', function(req, res, next) {
    var s = req.query.s ? req.query.s : 0;
    req.session.fudai.closebtnon = s;
    res.send('{"success":true}');
});
//国庆加息券
router.get('/guoqing', function(req, res, next) {
    var user = req.session.user;

    wsclient.guoqing_jiaxiquan({
                custId: user.custId,
             
            },
            function(wsresult) {
              if(wsresult.success){
                  req.session.guoqing.guoqing_jiaxiquan_lingqu=2
              }
              res.send(wsresult);
          });
});
router.get('/guoqing2', function(req, res, next) {
    var user = req.session.user;
    req.session.user.addCouponFlag='2'
    wsclient.guoqing_jiaxiquan({
                custId: user.custId,
                
            },
            function(wsresult) {
              
              res.send(wsresult)
          });
});
module.exports = router;