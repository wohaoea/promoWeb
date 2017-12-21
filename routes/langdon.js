var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var nwsessionConfig = require('../common/nwsession');
var nwsession = new nwsessionConfig(router, {
    dbName: 'nweversession',
    cookieName: 'nwEv_id'
});
/**朗顿首页**/
router.get('/', function(req, res) {
    var token = req.query.sign;
    //var token = '2017100801440679c517c9c65b4ad0bad98a5ded928ad3';
    var version = req.query.version;
    var session = req.locals.session||{};
    session.from = 'app';
    nwsession.set(req,session);
    var resultObj = {
        isLogin:!!session.user,
        jumpUrl:null,
        isSettle:false
    };
    if( resultObj.isLogin ){
        getLatestLoan4BDF(session,resultObj,req,function(resultObj){
            res.render('langdon/langDon',resultObj);
        });
    }else if( token ){
        wsclient.findOneBySign({
            'head':{'sign':token},
            'con':{}
        },function(json){
            session.user = json.body;
            nwsession.set(req,session);
            if( json.head.msg == '操作成功' ) {
                resultObj.isLogin = true;
            }
            getLatestLoan4BDF(session,resultObj,req,function(resultObj){
                res.render('langdon/langDon',resultObj);
            });
        });
    }else{
        res.render('langdon/langDon',resultObj);
    }

});

function getLatestLoan4BDF(session,resultObj,req,callback){
    wsclient.getLatestLoan4BDF({
        "CUST_ID": session.user.custId,
        "prodType": "LD"
    },function(json2){
        if( !utils.isEmptyObject(json2.data) ){
            session.projectNo = json2.data.projectNo;
            session.term = json2.data.loanTerm;
            session.borrowTime = json2.data.loanDate;
            nwsession.set(req,session);
            if( json2.data.confirmFlag == 0 ){
                resultObj.isSettle = true;
                if( ['EDIT', 'AUDITING', 'PASS'].indexOf(json2.data.auditStatus) > -1 ){ //审核中页面
                    resultObj.jumpUrl='/langdon/auditing';
                }else if( ['RETURN'].indexOf(json2.data.auditStatus) > -1 ){ //审核不通过页面
                    resultObj.jumpUrl='/langdon/review/fail';
                }else if( ['VIEW_PREPARE'].indexOf(json2.data.auditStatus) > -1 ){ //确认借款页面
                    resultObj.jumpUrl='/langdon/auditSuccess';
                }else if( ['LOANING'].indexOf(json2.data.auditStatus) > -1 ){  //放款中页面
                    resultObj.jumpUrl='/langdon/waitLoan';
                }else if( ['LOANED'].indexOf(json2.data.auditStatus) > -1 ){  //借款成功页面
                    resultObj.jumpUrl='/langdon/loanSuccess';
                }else if( ['FLOWING','LOANED_FAIL'].indexOf(json2.data.auditStatus) > -1 ){ //借款失效页面
                    resultObj.jumpUrl='/langdon/review/unconfirmed';
                }
                callback(resultObj);
            }else{
                wsclient.existNotEndLoanClaim({
                    "custId":session.user.custId,
                    "loanSubSrc":"LD"
                },function(result){
                    if( result.success && result.data.notEndCount > 0 ){
                        resultObj.isSettle = true;
                    }
                    callback(resultObj);
                });
            }
        }else{
            session.projectNo = null;
            session.term = null;
            session.borrowTime = null;
            wsclient.existNotEndLoanClaim({
                "custId":session.user.custId,
                "loanSubSrc":"LD"
            },function(result){
                if( result.success && result.data.notEndCount > 0 ){
                    resultObj.isSettle = true;
                }
                callback(resultObj);
            });
        }
    });
}
/**检测商户代码**/
router.post('/checkShopCode',function(req,res){
    wsclient.getCustAuthInfo({
        "custId":req.locals.session.user.custId,
        "loanSubSrc":"LD_AIFM"
    },function(result){
        result.codeVerification = req.body.code.toUpperCase() != 'GJCWGLS' ? false : true ;
        res.send(result);
    });
});

/**申请借款页面**/
router.get('/apply/:term',function(req,res){
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        return res.send('请登录');
    }
    wsclient.showProtocol({
        "custId": custId,
        "protType": "BIC",
        "projectNo": "",
        "loanSubSrc": "LD"
    },function(result){
        if(result.success){
            res.render('langdon/apply',
                {
                    term:req.params.term,
                    isSign:result.data.isSign==0?false:true
                });
        }else{
            res.send(result.msg);
        }
    });
});

/**还款计划页面**/
router.get('/plan/:term',function(req,res){
    var term = req.params.term;
    wsclient.repayPlan4BDF({
        "loanAmount":"3580",
        "loanTerm":term,
        "timeType":"M",
        "subLoanType":"LD_AIFM"
    },function(result){
        if(result.success){
            var repayPlanList = result.data.repayPlanList;
            var year = repayPlanList[0].repayDate.substring(0,4);
            var arr1 = [];
            var arr2 = [];
            for( var i=0; i < repayPlanList.length; i++ ){
                var item = repayPlanList[i];
                if( year==item.repayDate.substring(0,4) ){
                    arr1.push(item);
                }else{
                    arr2.push(item);
                }
            }
            var resultArr = [arr1];
            if(arr2.length>0){resultArr.push(arr2)}
            res.render('langdon/plan',{
                totalRepayAmoun:result.data.totalRepayAmount,
                repayPlanList:resultArr,
                term:term
            })
        }else{
            res.send(result.msg);
        }
    });
});

/**查询最近一次借款**/
router.post('/getLatestLoan',function(req,res){
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        return res.send('请登录');
    }
    wsclient.getLatestLoan4BDF({
        CUST_ID: custId,
        prodType:"LD"
    },function(result){
        if( result.data.confirmFlag == 0 ){
            var session = req.locals.session;
            session.projectNo = result.data.projectNo;
            session.borrowTime = result.data.loanDate;
            session.term = result.data.loanTerm;
            nwsession.set(req, session);
        }
        res.send(result);
    });
});

/**申请借款**/
router.post('/apply',function(req,res){
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        return res.send('请登录');
    }
    var session = req.locals.session;
    session.borrowTime = new Date();
    session.term = req.body.term;
    nwsession.set(req, session);
    wsclient.appLoan4Channel({
        "CUST_ID":custId,
        "prodType":"LD_AIFM",
        "appAmount":"3580",
        "appTerm":req.body.term,
        "projectName":"助理国际财务管理师（AIFM）培训/证书"
    },function(result){
        if( result.success && ( result.data.status == 0 || result.data.status == 1 ) ){
            var session = req.locals.session;
            session.projectNo = result.data.projectNo;
            nwsession.set(req, session);
        }
        res.send(result);
    });
});

/**审核中页面**/
router.get('/auditing', function(req, res) {
    var second = (new Date() - new Date(req.locals.session.borrowTime));
    res.render('langdon/auditing',{
        second:second
    });
});

/**审核成功(即确认借款)**/
router.get('/auditSuccess',function(req,res){
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        return res.redirect('toapp//login');
    }
    wsclient.getLatestLoan4BDF({
        CUST_ID: custId,
        prodType:"LD"
    },function(result){
        if(result.success){
            var session = req.locals.session;
            session.projectNo = result.data.projectNo;
            session.term = result.data.loanTerm;
            session.borrowTime = result.data.loanDate;
            nwsession.set(req, session);

            var second = (new Date() - new Date(session.borrowTime))/1000;
            second = parseInt(45*60 - second);
            if(second<=0){//确认借款超时
                return res.redirect('/review/unconfirmed');
            }
            var minute = parseInt(second/60);
            second = second%60;
            res.render('langdon/success',{
                projectNo:session.projectNo,
                term:session.term,
                type:'audit',
                minute:minute<10?'0'+minute:minute,
                second:second<10?'0'+second:second,
                borrowTime:session.borrowTime
            });
        }else{
            res.send(result.msg);
        }
    });
});

/**确认借款**/
router.post('/confirmLoan',function(req,res){
    var session = req.locals.session;
    if( !session.user ){
        return res.redirect('toapp//login');
    }
    wsclient.makeLoan({
        "loanId":session.projectNo,
        "CUST_ID":session.user.custId,
        "prodType":"LD"
    },function(result){
        res.send(result);
    });
});


/***审核失败**/
router.get('/review/:type',function(req,res){
    var type = req.params.type;
    var result = {
        title:null,
        type:type
    };
    var session = req.locals.session;
    switch(type)
    {
        case 'fail':
            result.title = '审核失败';
            break;
        case 'timeOut':
            result.title = '审核超时';
            break;
        case 'unconfirmed':
            result.title = '未确认服务';
            break;
    }
    if(session.projectNo){
        wsclient.saveUserConfirmLog({
            projectNo:session.projectNo,
            remarks: result.title + '页面'
        },function(result){
            return res.render('langdon/review',result);
        });
    }
    return res.render('langdon/review',result);
});

/**成功借款页面**/
router.get('/loanSuccess',function(req,res){
    var session = req.locals.session;
    wsclient.saveUserConfirmLog({
        projectNo:session.projectNo,
        remarks:'成功借款页面'
    },function(result){
        return res.render('langdon/success',{
            projectNo:session.projectNo,
            term:session.term,
            borrowTime:session.borrowTime,
            type:'loan',
            minute:null,
            second:null
        });
    });
});

/**等待放款页面**/
router.get('/waitLoan', function(req, res) {
    var custId = (req.locals.session.user || {}).custId;
    if(!custId) {
        return res.redirect('toapp//login');
    }
    wsclient.getLatestLoan4BDF({
        CUST_ID: custId,
        prodType:"LD"
    },function(result){
        if(result.success){
            var second = (new Date() - new Date(result.data.fundMatchTime));
            res.render('langdon/waitLoan',{
                second:second
            });
        }else{
            res.send(result);
        }
    });
});

/**朗顿相关协议**/
router.get('/protocol',function(req,res){
    var session = req.locals.session;
    if(!session.user){
        return res.redirect('toapp//login');
    }
    wsclient.showProtocol({
        "custId": session.user.custId,
        "protType": req.query.type, //BIC居间人协议 FIC分期服务协议 ICES资费说明
        "projectNo": session.projectNo ? session.projectNo : '',
        "loanSubSrc": "LD"
    }, function(json) {
        if(json.success){
            res.send(json.data.content);
        }else{
            res.send(json.msg);
        }
    })
});



module.exports = router;