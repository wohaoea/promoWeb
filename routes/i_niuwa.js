var express = require('express');
var router = express.Router();
var config = require('../config');
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var problem = require('../common/riskproblem');
var appdb = require('../common/appdb');



router.get('*',function(req,res,next){
    var token = req.query.sign;
    //var token = '20170817164355514588cdeb7848c58fadee9f3d990a07';
    var session = req.session;
    if( session.user && session.user.token == token ){
        next();
    }else if( token ){
        appdb.findUserBySign(token, function(result){
            if(result){
                session.user = {
                    custId:result.CUST_ID,
                    token:token
                };
            }
            next();
        });
    }else{
        next();
    }
});

/**安全保障页面导航**/
router.get('/securityNav',function(req,res,next){
    res.render('i_niuwa/security_nav');
});

/**安全保障页面**/
router.get('/security',function(req,res,next){
    res.render('i_niuwa/security');
});

/**安全保障对应详情页面**/
router.get('/security/:type',function(req,res,next){
    var type = req.params.type;
    var title = null;
    switch(type)
    {
    case 'socialAcceptance':
        title = '社会认可';
        break;
    case 'projectSafety':
        title = '项目安全保障';
        break;
    case 'niuDun':
        title = '牛盾服务保障';
        break;
    case 'moneySafe':
        title = '资金安全保障';
        break;
    }
    res.render('i_niuwa/security_detail',{
        type:type,
        title:title
    });
});

/**牛娃合伙人页面**/
router.get('/partner',function(req,res,next){
    res.render('i_niuwa/partner');
});

/**新手指引页面**/
router.get('/guide',function(req,res,next){
    res.render('i_niuwa/guide');
});

/**关于我们**/
router.get('/synopsisAboutUs',function(req,res,next){
    wsclient.getOprData({

    },function(json){
        res.render('i_niuwa/about_us',json.data);
    });
});

/**风险评测**/
router.get('/riskRating',function(req,res,next){
    if(!req.session.user)res.send('您尚未登录');
    var resultObj = {
        problemCollection:problem.Collection,
        again:req.query.again != undefined ? true : false,
        testScore:null,
        times:null
    };
    wsclient.getRiskTestResult({
        custId:req.session.user.custId
    },function( result ){
        if( result.success && result.data ){
            resultObj.testScore = result.data.testScore;
            resultObj.times = result.data.times;
        }
        res.render('i_niuwa/risk_rating',resultObj);
    });
});

/**风险评测结果保存**/
router.post('/saveRiskTestResult',function(req,res,next){
    if(!req.session.user)res.send('您尚未登录');
    wsclient.saveRiskTestResult({
        custId:req.session.user.custId,
        testScore:req.body.testScore,
        platform:'APP_INVEST',    //所属平台：APP_INVEST.投资app ；WEB.主站
        riskLevel:req.body.riskLevel
    },function(result){
        res.send(result);
    });
});


/**推荐管理**/
router.get('/recommendManage',function(req,res,next){
    if(!req.session.user)res.send('您尚未登录');
    var resultObj = {
        reward:{
            rewardAmt:0,        //奖励金额
            regCnt:0            //注册人数
        },
        frinedList:[]
    };
    wsclient.partnerStatus({
        custId:req.session.user.custId
    },function(json){
        if( json.success && json.data.aduitStatus == "PASS" && (json.data.qualifyStatus == "1" || json.data.qualifyStatus == "2") ){
            wsclient.getReward({
                custId:req.session.user.custId
            },function(json2){
                if( json2.success ){
                    resultObj.reward.rewardAmt = json2.data.rewardAmt;
                    resultObj.reward.regCnt = json2.data.regCnt;
                }
                wsclient.getRewardDtl({
                    pageIndex: 0,
                    pageSize: 10,
                    custId: req.session.user.custId
                },function(json3){
                    if( json3.success ){
                        resultObj.frinedList = json3.data.pageResult;
                    }else{
                        res.render('i_niuwa/recommend_manage',resultObj);
                    }
                });
            })
        }else{
            res.render('i_niuwa/recommend_manage',resultObj);
        }
    });
});

/**财富日历**/
router.get('/treasureCalendar',function(req,res,next){
    res.render('i_niuwa/treasure_calendar');
});

/**查询用户一个月每一天的收支信息**/
router.get('/queryPaymentMonth', function(req, res, next) {
    var user = req.session.user;
    if(!user)res.send('您尚未登录');
    wsclient.customerPaymentMonth({
        custId: user.custId,
        timeStr: req.query.timeStr
    },
    function(wsresult) {
        res.send(wsresult);
    });
});


module.exports = router;