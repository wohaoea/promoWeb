var config = require('../config');
var messages = require('./messages');
var logger = require('./logger');
var Client = require('node-rest-client').Client;
var path = require("path");
var fs = require('fs');
var weixinShare = require('./weixinshare');

client = new Client();
var args = {
    requesConfig: {
        timeout: 1000
    },
    responseConfig: {
        timeout: 1000
    }
};
// 触宝post回调url
var rest = {
    p2pRepaySuffix: config.wsDomains.domain1
}

var wsurls = {
    validateCodeURL: config.wsDomains.domain1 + "verifyCode/",
    protocolURL: config.wsDomains.domain1 + "protocol/",
    userURL: config.wsDomains.domain1 + "user/",
    investURL: config.wsDomains.domain1 + "index/",
    customerURL: config.wsDomains.domain1 + "customer/",
    lotteryUrl: config.wsDomains.domain1 + "lottery/",
    zongZiUrl: config.wsDomains.domain1 + "zongZi/",
    productURL: config.wsDomains.domain1 + "prod/",
    phoneuserURL: config.wsDomains.domain1 + "sms/", //调用牛呗注册接口
    authURL: config.wsDomains.domain1 + "auth/", //调用牛呗通讯认证
    repayURL: config.wsDomains.domain1 + "api/repay/", //调用还款相关
    creditLoanURL: config.wsDomains.domain1 + "creditLoan/", //调用牛呗分控相关
    summerLotteryURL: config.wsDomains.domain1 + "summerLottery/", //暑期欢乐送
    enjoyLifeURL: config.wsDomains.domain1 + "enjoyLife/",
    messageURL: config.wsDomains.domain1 + "message/",
    adsURL: config.wsDomains.domain1 + "ads/",
    partner: config.wsDomains.domain1 + "partner/",
    creditVip: config.wsDomains.domain1 + "creditVip/",
    journey: config.wsDomains.domain1 + "journey/",
    customerAccountURL: config.wsDomains.domain1 + 'customerAccount/',
    dataqueryUrl: config.wsDomains.domain1 + "dataquery/", //调用借款项目查询
    findOneBySign: config.wsDomains.domain3 + "h5user/",
    guoqing_activityURL: config.wsDomains.domain1 + 'activity/', //国庆活动
    apiRepayWSURL: config.wsDomains.domain1 + 'apiRepayWS/', //国庆活动
    loanUrl: config.wsDomains.domain1 + 'api/loan/', //触宝定向转账
    account: config.wsDomains.domain1 + 'account/', //易宝支付追加银行卡
    lottery: config.wsDomains.domain1 + 'lottery/', // 牛呗抽奖活动接口
    integral: config.wsDomains.domain1 + 'integral/', // 牛呗签到活动接口
    nwUserSign: config.wsDomains.domain1 + 'investAppSignActivity/', // 牛娃app签到活动
    thanksgiving: config.wsDomains.domain1 + 'thanksGiving/' //感恩节活动接口
};

var nwUserSign = {
    getSignInfo: wsurls.nwUserSign + 'getSignInfo',     //获取今日签到情况，签到次数，奖励领取情况
    sign4InvestApp: wsurls.nwUserSign + 'sign4InvestApp',   //签到
    getAward: wsurls.nwUserSign + 'getAward',       //领取奖励
    restartAtivity: wsurls.nwUserSign + 'restartAtivity'    //重启签到活动
}

var luckDrawMethods = {
    getLotteryNumber: wsurls.lottery + 'getLotteryNumber', //查询剩余抽奖次数
    listLotteryWinner: wsurls.lottery + 'listLotteryWinner', //查询抽奖名单
    listWinningRecord: wsurls.lottery + 'listWinningRecord', //查询获奖记录
    draw: wsurls.lottery + 'draw', //抽奖
    acceptPrize: wsurls.lottery + 'acceptPrize', //领取奖品
    acceptMitigate: wsurls.lottery + 'acceptMitigate' //领取免本金/利息
}

var thanksgiving = {
    winnerList: wsurls.thanksgiving + 'getThanksGivingActivityWinnerList',
    shake: wsurls.thanksgiving + 'shake',
    getActivityInfo: wsurls.thanksgiving + 'getActivityInfo',
    exchangeThanksGivingAward: wsurls.thanksgiving + 'exchangeThanksGivingAward',
    insertShareData: config.wsDomains.domain1 + 'nwAppActivity/insertShareData'
}

var integralMethods = {
    getSignAward: wsurls.integral + 'getSignAward', // 用户获取奖励信息接口
    signGetAward: wsurls.integral + 'signGetAward' // 签到领取积分接口
}

var m9Methods = {
    jxlMobileAuth: wsurls.authURL + "jxlMobileAuth",
    findJxlAuth: wsurls.authURL + "findJxlAuth",
    findOneBySign: wsurls.findOneBySign + "findOneBySign",
    getLatestLoan: wsurls.creditLoanURL + "getLatestLoan",
    getProdPackCustInfo: wsurls.creditLoanURL + "getProdPackCustInfo",
    validateShopCode: wsurls.creditLoanURL + "validateShopCode",
    appLoan4Channel: wsurls.creditLoanURL + "appLoan4Channel",
    repayDetailList: wsurls.repayURL + "repayPlan",
    repay_list: wsurls.creditLoanURL + 'getRepaymentRecords', //发起还款_还款list
    repay_list_early: wsurls.creditLoanURL + 'getRepayments',
    repay_togo: wsurls.creditLoanURL + 'repayLoan',
    repayment_details: wsurls.repayURL + 'repayment_details',
    repayPlan4ALB: wsurls.repayURL + 'repayPlan4ALB',
    customerAccount: wsurls.customerAccountURL + 'customerAmountInfoHX',
    showProtocol: wsurls.creditLoanURL + "showProtocol", //借款居间人协议
    findBaseCustomer: wsurls.userURL + 'findBaseCustomer',
    guoqing_jiaxiquan: wsurls.guoqing_activityURL + 'checkQualification',
    repayPlan4YHJ: wsurls.repayURL + 'repayPlan4YHJ', //易换机二期还款列表
    makeLoan: wsurls.creditLoanURL + 'makeLoan', //易换机二期确认借款
    saveUserConfirmLog: wsurls.creditLoanURL + 'saveUserConfirmLog', //保存用户行为
    //advance_repay: wsurls.repayURL + "advance_repay",
    //single_repay: wsurls.repayURL + "single_repay",
    checkDirecTrfAuth: wsurls.loanUrl + 'checkDirecTrfAuth', //触宝定向转账查询接口
    direcTrfAuth: wsurls.loanUrl + 'direcTrfAuth', //定向转账授权接口
    getRepayments4BDF: wsurls.creditLoanURL + 'getRepayments4BDF', //还款列表
    existNotEndLoanClaim: wsurls.creditLoanURL + 'existNotEndLoanClaim', //还款列表
    advance_repay:config.wsDomains.domain1 + "api/repay/advance_repay", // 一次还清
    single_repay: config.wsDomains.domain1 + "api/repay/single_repay", // 按期还款
    getRepaymentRecords4BDF: wsurls.creditLoanURL + "getRepaymentRecords4BDF", // 按期还款
};

var langDon = {
    getLatestLoan4BDF:config.wsDomains.domain1+'api/loan/getLatestLoan4BDF',//借款项目查询
    repayPlan4BDF:config.wsDomains.domain1+'api/repay/repayPlan4BDF',//预览还款计划接口
    getCustAuthInfo:config.wsDomains.domain1+'api/loan/getCustAuthInfo',//查询基础认证情况
};

var communicationMethods = {
    jxlRestMobilePwd: config.wsDomains.domain1 + 'auth/jxlRestMobilePwd', //聚信立重置密码
    tianjiAddr: config.wsDomains.domain2 + 'mobileAuth/tianjiAddr', // 获取天机手机认证H5地址
    tianjiH5Response: config.wsDomains.domain2 + 'mobileAuth/tianjiH5Response', // 获取天机手机认证结果回调
}


var hxnxMontheds = {
    checkHXNewCustomerRegRed: wsurls.summerLotteryURL + 'checkHXNewCustomerRegRed', //和讯验证成功页面校验接口
    //getHXNewCustomShareRedAmount: wsurls.summerLotteryURL + 'getHXNewCustomShareRedAmount',//pc获取分享红包
    sendHXNewCustomerRegRed: wsurls.summerLotteryURL + 'sendHXNewCustomerRegRed', //发和讯８元和２００元分享红包
    checkHXNewCustomerStatus: wsurls.summerLotteryURL + 'checkHXNewCustomerStatus', //检查用户状态
    getHXNewCustomShareRedResult: wsurls.summerLotteryURL + 'getHXNewCustomShareRedResult', //抢红包接口
    //getHXNewCustomShareRedAmount:wsurls.summerLotteryURL+'getHXNewCustomShareRedAmount',//获取分享金额
    getHXNewCustomShareRedShareHead: wsurls.summerLotteryURL + 'getHXNewCustomShareRedShareHead', //获取分享头像及领取状态
    getHXNewCustomShareRedList: wsurls.summerLotteryURL + 'getHXNewCustomShareRedList' //获取list
};

var wsActivitySmashingEggsMethods = {
    /*获取剩余可砸蛋次数相关信息*/
    smashingeggs_get_eggs_info: wsurls.summerLotteryURL + "getDoubleEggCounts",
    /*砸金蛋/银蛋请求*/
    smashingeggs_smashing_eggs: wsurls.summerLotteryURL + "getDoubleEggResult"
}

var wsUserMotheds = {
    selectRecomInfoById: wsurls.userURL + "selectRecomInfoById", //获取邀请码
    createCustomer: wsurls.userURL + "saveUser",
    checkLoginName: wsurls.userURL + "checkLoginName", //验证用户名是否存在
    getCustByPhone: wsurls.userURL + "getCustByPhone", //验证手机号是否存在
    isBirsthday: wsurls.userURL + "conditionCheck", //判断用户是否可以领取生日礼包
    userLogin: wsurls.userURL + "userLogin", //登录
    popularizeValidateTel: wsurls.userURL + 'popularizeValidateTel', //验证上级手机号
    getMyPopularizeInfo: wsurls.userURL + 'getMyPopularizeInfo', //获取主页信息
    savePopularizeUserInfo: wsurls.userURL + 'savePopularizeUserInfo', //保存申请信息
    getPopularizeSubRoleList: wsurls.userURL + 'getPopularizeSubRoleList', //获取角色下属列表
    getPopularizeAchievementList: wsurls.userURL + 'getPopularizeAchievementList', //获取业绩统计
    getPopularizePromoDetailList: wsurls.userURL + 'getPopularizePromoDetailList', //获取业绩明细
    removePopularizeRole: wsurls.userURL + 'removePopularizeRole' //删除指定角色

};

var m11Methoeds = {
    safeProblemLoad: config.wsDomains.domain2 + "api/user/safeProblemLoad", //安全问题加载
    pwdProblemCheck: config.wsDomains.domain2 + 'api/user/pwdProblemCheck', //密码问题验证
    passwordreset: config.wsDomains.domain2 + 'api/user/newPwdSet', //重置密码提交
    bindAccount: config.wsDomains.domain4 + 'net/bindAccount', // 绑定账户

    bindAndauthCardsGet: wsurls.account + "bindAndauthCardsGet", //获得绑定和验证卡
    authCardsPut: wsurls.account + "authCardsPut", //提交卡号
    authCardsGet: wsurls.account + "authCardsGet", //获得验证卡
    business: config.wsDomains.domain4 + "ws/direct/business"

}

var wsValidateCodeMotheds = {
    generateCaptcha: wsurls.validateCodeURL + "genVerifyCode",
    generateMobileCode: wsurls.userURL + "sendSms", //获取手机验证码
    validateBindPhoneNo: wsurls.userURL + "checkBindPhoneNo" //验证手机号是否绑定
};
var wsInvestMotheds = {
    appointmentInvest: wsurls.investURL + "appointmentInvest",
};

//合伙人
var wspartner = {
    savePartner: wsurls.partner + "savePartner",        //申请合伙人
    partnerStatus: wsurls.partner + "getStatus",        //获取合伙人状态
    getReward: wsurls.partner + "getReward",            //当月
    getRewardDtl: wsurls.partner + "getRewardDtl",      //好友
};

var wsCustomerMotheds = {
    customerQrcode: wsurls.customerURL + "getQRCode", //获取微信二维码id
    getLotteryList: wsurls.lotteryUrl + "getLotteryList", //转盘获奖名单
    getLotteryResult: wsurls.lotteryUrl + "getLotteryResult", //转盘结果
    getSmashEggResult: wsurls.lotteryUrl + "getSmashEggResult", //金蛋结果
    getSmashEggChances: wsurls.lotteryUrl + "getSmashEggChances", //金蛋次数
    savePeelZongZiResult: wsurls.zongZiUrl + "savePeelZongZiResult", //剥粽子
    getDWLotteryResultList: wsurls.zongZiUrl + "getDWLotteryResultList", //中奖列表
    getDWLotteryResult: wsurls.zongZiUrl + "getDWLotteryResult", //获取单次转盘结果
    getDWLotteryChances: wsurls.zongZiUrl + "getDWLotteryChances", //端午抽奖次数
    getSummerLotteryResult: wsurls.summerLotteryURL + "getSummerLotteryResult", //summerLottery/getSummerLotteryResult暑期欢乐送获取结果
    getSummerLotteryList: wsurls.summerLotteryURL + "getSummerLotteryList", //获取暑期欢乐颂中奖名单
    getSummerLotteryChances: wsurls.summerLotteryURL + "getSummerLotteryChances", //所剩抽奖机会
    ProductList: wsurls.productURL + "ProductList", //4类产品列表数据
    detailsProduct: wsurls.productURL + "detailsProduct", //产品信息
    getPopularizeList: wsurls.productURL + "getPopularizeList", //2345类产品列表数据
    getApLotteryChances: wsurls.summerLotteryURL + "getApLotteryChances", //爱拼才会赢 获取抽奖次数
    getApLotteryResult: wsurls.summerLotteryURL + "getApLotteryResult", //爱拼才会赢 获取抽奖结果
    getApExchargeResult: wsurls.summerLotteryURL + "getApExchargeResult", //爱拼才会赢 获取兑奖结果
    getApLotteryResultsByNotUse: wsurls.summerLotteryURL + "getApLotteryResultsByNotUse", //爱拼才会赢 获取还没有使用的字map
    getHotPopularizeList: wsurls.productURL + "getHotPopularizeList", //2345类产品列表数据2
    getSJPrizeChances: wsurls.summerLotteryURL + "getSJPrizeChances", //查询次数
    exchargeSJPrize: wsurls.summerLotteryURL + "exchargeSJPrize", //选择礼包接口
    exchargeSJKeyPrize: wsurls.summerLotteryURL + "exchargeSJKeyPrize", //使用钥匙接口
    getBirthdayGift: wsurls.summerLotteryURL + "sendPrize", //领取生日礼包
    getDoubleEggRedAmount: wsurls.summerLotteryURL + "getDoubleEggRedAmount", //获取用户分享现金券金额
    getDoubleEggRedResult: wsurls.summerLotteryURL + "getDoubleEggRedResult", //用户抢红包获取结果
    getDoubleEggRedShareHead: wsurls.summerLotteryURL + "getDoubleEggRedShareHead", //获取投资者头像
    getDoubleEggRedList: wsurls.summerLotteryURL + "getDoubleEggRedList", //获取得到红包用户列表
    /*帮加息活动接口*/
    getInvestPeopleHelpList: wsurls.summerLotteryURL + "getInvestPeopleHelpList", //取指定人此活动的投资记录列表（首页)
    getInvestRecordDetail: wsurls.summerLotteryURL + "getInvestRecordDetail", //取活动页面信息(分享页,帮助页)
    getPeopleHelpDetails: wsurls.summerLotteryURL + "getPeopleHelpDetails", //获取加息人列表（分享页 和 帮助页）
    setWechatInfo: wsurls.summerLotteryURL + "setWechatInfo", //写入微信信息（分享页）
    helpOtherAddRate: wsurls.summerLotteryURL + "helpOtherAddRate", //帮助加息（帮助页）
    getRedEnvelope: wsurls.summerLotteryURL + "getRedEnvelope", //领取红包（帮助页）
    updatePeopleHelpStatues: wsurls.summerLotteryURL + "updatePeopleHelpStatues", //加息结束去获取加息值
    checkNewYearPrizeStatus: wsurls.summerLotteryURL + "checkNewYearPrizeStatus", //校验是否可以领取福袋
    sendPrize: wsurls.summerLotteryURL + "sendPrize", //领取福袋
    queryLoanProject: wsurls.dataqueryUrl + "queryLoanProject" //借款项目查询
};
var wsPhoneCodeMotheds = {
    niuBeiGenerateMobileCode: wsurls.phoneuserURL + "sendSms" //牛呗注册获取手机验证码
}
var wsprotocolMotheds = {
    viewIICProtocol: wsurls.protocolURL + "viewIICProtocol", //预览投资人居间协议
    viewBuyerProtocol: wsurls.protocolURL + "viewBuyerProtocol", //预览认购人债权转让协议
    viewApplyTransProtocol: wsurls.protocolURL + "viewApplyTransProtocol", //预览转让人申请转让——债权转让协议
    viewICProtocol: wsurls.protocolURL + "viewICProtocol" //预览借款人协议

};
var wsadsMotheds = {
        adsQuery: wsurls.adsURL + "adsQuery",
    }
    //信用达人
var wscreditVipMotheds = {
    findOneRecord: wsurls.creditVip + "findOneRecord",
    findOneCreditVip: wsurls.creditVip + "findOneCreditVip",
    findList: wsurls.creditVip + "findList",
    saveApplyAmt: wsurls.creditVip + "saveApplyAmt",
    findApplyList: wsurls.creditVip + "findApplyList",
    findLoanList: wsurls.creditVip + "findLoanList",
    saveAgreeCredit: wsurls.creditVip + "saveAgreeCredit",
    saveRefuseCredit: wsurls.creditVip + "saveRefuseCredit",
    findBase: wsurls.creditVip + "findBase",
    saveCancelAll: wsurls.creditVip + "saveCancelAll"
};
var proxyMethods = {
        checkdata: config.wsDomains.domain4 + "ws/direct/checkdata"
    }
    /*活动产品*/
var wsProdMotheds = {
    productList: wsurls.productURL + 'ProductList', //活动产品列表
    //活动产品详情页
    instantInvest: wsurls.productURL + 'instantInvest' //立即投资
};


//借款项目查询
exports.getLatestLoan4BDF = function(jsondata, callback) {
    var url = langDon.getLatestLoan4BDF;
    invokeWebService(url, jsondata, callback);
};
//预览还款计划接口(朗顿)
exports.repayPlan4BDF = function(jsondata, callback) {
    var url = langDon.repayPlan4BDF;
    invokeWebService(url, jsondata, callback);
};
//查询基础认证情况(朗顿)
exports.getCustAuthInfo = function(jsondata, callback) {
    var url = langDon.getCustAuthInfo;
    invokeWebService(url, jsondata, callback);
};

//活动产品列表
exports.productList = function(jsondata, callback) {
    var url = wsProdMotheds.productList;
    invokeWebService(url, jsondata, callback);
};
//活动产品列表
exports.instantInvest = function(jsondata, callback) {
    var url = wsProdMotheds.instantInvest;
    invokeWebService(url, jsondata, callback);
};
/*活动产品*/
var wsProdMotheds = {
    productList: wsurls.productURL + 'ProductList', //活动产品列表
    //活动产品详情页
    instantInvest: wsurls.productURL + 'instantInvest' //立即投资
};
//活动产品列表
exports.productList = function(jsondata, callback) {
    var url = wsProdMotheds.productList;
    invokeWebService(url, jsondata, callback);
};
//活动产品列表
exports.instantInvest = function(jsondata, callback) {
    var url = wsProdMotheds.instantInvest;
    invokeWebService(url, jsondata, callback);
};

var wsjourney = {
    sign: wsurls.journey + "sign",
    custInfo: wsurls.journey + "custInfo",
    roll: wsurls.journey + "roll",
    journeyInfo: wsurls.journey + "journeyInfo"
};
/*
  大富豪-获取用户信息
*/
exports.dfh_userinfo = function(jsondata, callback) {
    var url = wsjourney.custInfo;
    invokeWebService(url, jsondata, callback);
};

/*
  大富豪-签到
*/
exports.dfh_sign = function(jsondata, callback) {
    var url = wsjourney.sign;
    invokeWebService(url, jsondata, callback);
};

/*
  大富豪-走步
*/
exports.dfh_zhuan = function(jsondata, callback) {
    var url = wsjourney.roll;
    invokeWebService(url, jsondata, callback);
};
/*
  大富豪-获取活动时间
*/
exports.journeyInfo = function(jsondata, callback) {
    var url = wsjourney.journeyInfo;
    invokeWebService(url, jsondata, callback);
};

//取消授信增额
exports.saveCancelAll = function(jsondata, callback) {
    var url = wscreditVipMotheds.saveCancelAll;
    invokeWebService(url, jsondata, callback);
};
//查找信用达人
exports.findOneRecord = function(jsondata, callback) {
    var url = wscreditVipMotheds.findOneRecord;
    invokeWebService(url, jsondata, callback);
};
//查找信用达人
exports.findBase = function(jsondata, callback) {
    var url = wscreditVipMotheds.findBase;
    invokeWebService(url, jsondata, callback);
};
//单个信用达人
exports.findOneCreditVip = function(jsondata, callback) {
    var url = wscreditVipMotheds.findOneCreditVip;
    invokeWebService(url, jsondata, callback);
};
//信用达人选择列表
exports.findList = function(jsondata, callback) {
    var url = wscreditVipMotheds.findList;
    invokeWebService(url, jsondata, callback);
};
//申请增额或增信
exports.saveApplyAmt = function(jsondata, callback) {
    var url = wscreditVipMotheds.saveApplyAmt;
    invokeWebService(url, jsondata, callback);
};
//申请查询列表
exports.findApplyList = function(jsondata, callback) {
    var url = wscreditVipMotheds.findApplyList;
    invokeWebService(url, jsondata, callback);
};
//查询借款记录
exports.findLoanList = function(jsondata, callback) {
    var url = wscreditVipMotheds.findLoanList;
    invokeWebService(url, jsondata, callback);
};
//同意授权
exports.saveAgreeCredit = function(jsondata, callback) {
    var url = wscreditVipMotheds.saveAgreeCredit;
    invokeWebService(url, jsondata, callback);
};
exports.saveRefuseCredit = function(jsondata, callback) {
    var url = wscreditVipMotheds.saveRefuseCredit;
    invokeWebService(url, jsondata, callback);
};

var wsMessageMotheds = {
    messageInfo: wsurls.messageURL + "info",
    updStatus: wsurls.messageURL + "updStatus",
    messagehaveSet: wsurls.messageURL + "haveSet", //获取消息列表设置
    messageinformSet: wsurls.messageURL + "informSet", //提交消息设置
    messageNoReadMsgCount: wsurls.messageURL + "noReadMsgCount" //获取未读信息条数
};
//加息结束去获取加息值
exports.updatePeopleHelpStatues = function(jsondata, callback) {
    var url = wsCustomerMotheds.updatePeopleHelpStatues;
    invokeWebService(url, jsondata, callback);
};

//取指定人此活动的投资记录列表（首页)
exports.getInvestPeopleHelpList = function(jsondata, callback) {
    var url = wsCustomerMotheds.getInvestPeopleHelpList;
    invokeWebService(url, jsondata, callback);
};
//取活动页面信息(分享页,帮助页)
exports.getInvestRecordDetail = function(jsondata, callback) {
    var url = wsCustomerMotheds.getInvestRecordDetail;
    invokeWebService(url, jsondata, callback);
};
//获取加息人列表（分享页 和 帮助页）
exports.getPeopleHelpDetails = function(jsondata, callback) {
    var url = wsCustomerMotheds.getPeopleHelpDetails;
    invokeWebService(url, jsondata, callback);
};
//写入微信信息（分享页）
exports.setWechatInfo = function(jsondata, callback) {
    var url = wsCustomerMotheds.setWechatInfo;
    invokeWebService(url, jsondata, callback);
};
//帮助加息（帮助页）
exports.helpOtherAddRate = function(jsondata, callback) {
    var url = wsCustomerMotheds.helpOtherAddRate;
    invokeWebService(url, jsondata, callback);
};
//领取红包（帮助页）
exports.getRedEnvelope = function(jsondata, callback) {
    var url = wsCustomerMotheds.getRedEnvelope;
    invokeWebService(url, jsondata, callback);
};

//获取用户分享现金券金额
exports.getDoubleEggRedAmount = function(jsondata, callback) {
    var url = wsCustomerMotheds.getDoubleEggRedAmount;
    invokeWebService(url, jsondata, callback);
};
//用户抢红包获取结果
exports.getDoubleEggRedResult = function(jsondata, callback) {
    var url = wsCustomerMotheds.getDoubleEggRedResult;
    invokeWebService(url, jsondata, callback);
};
//获取投资者头像
exports.getDoubleEggRedShareHead = function(jsondata, callback) {
    var url = wsCustomerMotheds.getDoubleEggRedShareHead;
    invokeWebService(url, jsondata, callback);
};
//获取得到红包用户列表
exports.getDoubleEggRedList = function(jsondata, callback) {
    var url = wsCustomerMotheds.getDoubleEggRedList;
    invokeWebService(url, jsondata, callback);
};
/*惠享生活*/
var wsHuiXiangShengHuoMethods = {
    getCommerceActivityListForHome: wsurls.enjoyLifeURL + "getCommerceActivityListForHome",
    getCommerceActivityListForPage: wsurls.enjoyLifeURL + "getCommerceActivityListForPage",
    getCommerceActivityLifeProduct: wsurls.enjoyLifeURL + "getCommerceActivityLifeProduct",
    getCommerceActivityChance: wsurls.enjoyLifeURL + "getCommerceActivityChance",
    getCommerceActivityResult: wsurls.enjoyLifeURL + "getCommerceActivityResult"
}

//isBirsthday: wsurls.userURL + "conditionCheck"判断用户是否可以领取生日礼包
exports.isBirsthday = function(jsondata, callback) {
    var url = wsUserMotheds.isBirsthday;
    invokeWebService(url, jsondata, callback);
};
//getBirthdayGift: wsurls.summerLotteryURL + "sendPrize"领取生日礼包
exports.getBirthdayGift = function(jsondata, callback) {
    var url = wsCustomerMotheds.getBirthdayGift;
    invokeWebService(url, jsondata, callback);
};

/*合伙人*/
Object.keys(wspartner).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(wspartner[key], jsondata, callback);
    };
});

/*一日ceo活动*/
var wceolist = config.wsDomains.domain1 + "summerLottery/getYRCEOCompeteList" //查询列表接口
var wvote = config.wsDomains.domain1 + "summerLottery/voteCompete" //点赞接口
var wceoreg = config.wsDomains.domain1 + "summerLottery/regParti" //参与注册接口
exports.wceolist = function(jsondata, callback) {
    var url = wceolist;
    invokeWebService(url, jsondata, callback);
}
exports.wvote = function(jsondata, callback) {
    var url = wvote;
    invokeWebService(url, jsondata, callback);
}
exports.wceoreg = function(jsondata, callback) {
    var url = wceoreg;
    invokeWebService(url, jsondata, callback);
}


exports.adsQuery = function(jsondata, callback) {
    var url = wsadsMotheds.adsQuery;
    invokeWebService(url, jsondata, callback);
}

/*牛呗注册获取手机验证码*/
exports.niuBeiGenerateMobileCode = function(jsondata, callback) {
    var url = wsPhoneCodeMotheds.niuBeiGenerateMobileCode;
    invokeWebService(url, jsondata, callback);
}

/*对外产品列表接口*/
exports.ProductList = function(jsondata, callback) {
    var url = wsCustomerMotheds.ProductList;
    invokeWebService(url, jsondata, callback);
};

/*对外产品详细接口*/
exports.detailsProduct = function(jsondata, callback) {
    var url = wsCustomerMotheds.detailsProduct;
    invokeWebService(url, jsondata, callback);
};

/*对外产品列表接口*/
exports.getPopularizeList = function(jsondata, callback) {
        var url = wsCustomerMotheds.getPopularizeList;
        invokeWebService(url, jsondata, callback);
    }
    /*2345对外产品列表接口2*/
exports.getHotPopularizeList = function(jsondata, callback) {
    var url = wsCustomerMotheds.getHotPopularizeList;
    invokeWebService(url, jsondata, callback);
}


/*对外借款项目查询接口*/
exports.queryLoanProject = function(jsondata, callback) {
    var url = wsCustomerMotheds.queryLoanProject;
    invokeWebService(url, jsondata, callback);
};


/*金蛋次数*/
exports.getSmashEggChances = function(jsondata, callback) {
    var url = wsCustomerMotheds.getSmashEggChances;
    invokeWebService(url, jsondata, callback);
};

/*剥粽子*/
exports.savePeelZongZiResult = function(jsondata, callback) {
    var url = wsCustomerMotheds.savePeelZongZiResult;
    invokeWebService(url, jsondata, callback);
};

/*获取未读信息条数*/
exports.messageNoReadMsgCount = function(jsondata, callback) {
    var url = wsMessageMotheds.messageNoReadMsgCount;
    invokeWebService(url, jsondata, callback);
};

/*中奖列表*/
exports.getDWLotteryResultList = function(jsondata, callback) {
    var url = wsCustomerMotheds.getDWLotteryResultList;
    invokeWebService(url, jsondata, callback);
};

/*获取单次转盘结果*/
exports.getDWLotteryResult = function(jsondata, callback) {
    var url = wsCustomerMotheds.getDWLotteryResult;
    invokeWebService(url, jsondata, callback);
};

/*端午抽奖次数*/
exports.getDWLotteryChances = function(jsondata, callback) {
    var url = wsCustomerMotheds.getDWLotteryChances;
    invokeWebService(url, jsondata, callback);
};

/*欢乐送
    getSummerLotteryResult:wsurls.summerLotteryURL+"getSummerLotteryResult",//summerLottery/getSummerLotteryResult暑期欢乐送获取结果
    getSummerLotteryList:wsurls.summerLotteryURL+"getSummerLotteryList",//获取暑期欢乐颂中奖名单
    getSummerLotteryChances:wsurls.summerLotteryURL+"getSummerLotteryChances",//所剩抽奖机会
*/
/*暑期欢乐送获取结果*/
exports.getSummerLotteryResult = function(jsondata, callback) {
    var url = wsCustomerMotheds.getSummerLotteryResult;
    invokeWebService(url, jsondata, callback);
};
/*获取暑期欢乐颂中奖名单*/
exports.getSummerLotteryList = function(jsondata, callback) {
    var url = wsCustomerMotheds.getSummerLotteryList;
    invokeWebService(url, jsondata, callback);
};
/*所剩抽奖机会*/
exports.getSummerLotteryChances = function(jsondata, callback) {
    var url = wsCustomerMotheds.getSummerLotteryChances;
    invokeWebService(url, jsondata, callback);
};
/*爱拼才会赢 获取抽奖次数*/
exports.getApLotteryChances = function(jsondata, callback) {
    var url = wsCustomerMotheds.getApLotteryChances;
    invokeWebService(url, jsondata, callback);
};
/*爱拼才会赢 获取抽奖结果*/
exports.getApLotteryResult = function(jsondata, callback) {
    var url = wsCustomerMotheds.getApLotteryResult;
    invokeWebService(url, jsondata, callback);
};
/*爱拼才会赢 获取兑奖结果*/
exports.getApExchargeResult = function(jsondata, callback) {
    var url = wsCustomerMotheds.getApExchargeResult;
    invokeWebService(url, jsondata, callback);
};
/*爱拼才会赢 获取还没有使用的字map*/
exports.getApLotteryResultsByNotUse = function(jsondata, callback) {
    var url = wsCustomerMotheds.getApLotteryResultsByNotUse;
    invokeWebService(url, jsondata, callback);
};
/*金蛋结果*/
exports.getSmashEggResult = function(jsondata, callback) {
    var url = wsCustomerMotheds.getSmashEggResult;
    invokeWebService(url, jsondata, callback);
};

/*转盘获奖名单*/
exports.getLotteryList = function(jsondata, callback) {
    var url = wsCustomerMotheds.getLotteryList;
    invokeWebService(url, jsondata, callback);
};

/*转盘结果*/
exports.getLotteryResult = function(jsondata, callback) {
    var url = wsCustomerMotheds.getLotteryResult;
    invokeWebService(url, jsondata, callback);
};

/*获取微信二维码id*/
exports.customerQrcode = function(jsondata, callback) {
    var url = wsCustomerMotheds.customerQrcode;
    invokeWebService(url, jsondata, callback);
};

/*早鸟计划报名*/
exports.appointmentInvest = function(jsondata, callback) {
    var url = wsInvestMotheds.appointmentInvest;
    invokeWebService(url, jsondata, callback);
};

/*验证手机号是否存在*/
exports.getCustByPhone = function(jsondata, callback) {
    var url = wsUserMotheds.getCustByPhone;
    invokeWebService(url, jsondata, callback);
};

/*验证用户名是否存在*/
exports.checkLoginName = function(jsondata, callback) {
    var url = wsUserMotheds.checkLoginName;
    invokeWebService(url, jsondata, callback);
};
/*
 * Generate captcha.
 */
exports.generateCaptcha = function(jsondata, callback) {
    //restful api post
    //callback
    var url = wsValidateCodeMotheds.generateCaptcha;
    invokeWebService(url, jsondata, callback);
};
/*
 *验证手机号是否绑定
 */
exports.validateBindPhoneNo = function(jsondata, callback) {
    //restful api post
    //callback
    var url = wsValidateCodeMotheds.validateBindPhoneNo;
    invokeWebService(url, jsondata, callback);
};

/*
 * Create new customer.
 */
exports.createCustomer = function(jsondata, callback) {
    //restful api post
    var url = wsUserMotheds.createCustomer;
    invokeWebService(url, jsondata, callback);
};

/*
 * 获取邀请码.
 */
exports.selectRecomInfoById = function(jsondata, callback) {
    var url = wsUserMotheds.selectRecomInfoById;
    invokeWebService(url, jsondata, callback);
};
/*获取手机验证码*/
exports.generateMobileCode = function(jsondata, callback) {
    //restful api post
    var url = wsValidateCodeMotheds.generateMobileCode;
    invokeWebService(url, jsondata, callback);
};

/*查询次数接口*/
exports.getSJPrizeChances = function(jsondata, callback) {
    //restful api post
    var url = wsCustomerMotheds.getSJPrizeChances;
    invokeWebService(url, jsondata, callback);
};

/*选择礼包接口*/
exports.exchargeSJPrize = function(jsondata, callback) {
    //restful api post
    var url = wsCustomerMotheds.exchargeSJPrize;
    invokeWebService(url, jsondata, callback);
};

/*使用钥匙接口*/
exports.exchargeSJKeyPrize = function(jsondata, callback) {
    //restful api post
    var url = wsCustomerMotheds.exchargeSJKeyPrize;
    invokeWebService(url, jsondata, callback);
};


/*推广登录*/
exports.userLogin = function(jsondata, callback) {
    var url = wsUserMotheds.userLogin;
    invokeWebService(url, jsondata, callback);
};

/*推广系统首页信息*/
exports.getMyPopularizeInfo = function(jsondata, callback) {
    var url = wsUserMotheds.getMyPopularizeInfo;
    invokeWebService(url, jsondata, callback);
};

/*查询上级手机号状态*/
exports.popularizeValidateTel = function(jsondata, callback) {
    var url = wsUserMotheds.popularizeValidateTel;
    invokeWebService(url, jsondata, callback);
};

/*保存申请信息*/
exports.savePopularizeUserInfo = function(jsondata, callback) {
    var url = wsUserMotheds.savePopularizeUserInfo;
    invokeWebService(url, jsondata, callback);
};
/*获取下属角色*/
exports.getPopularizeSubRoleList = function(jsondata, callback) {
    var url = wsUserMotheds.getPopularizeSubRoleList;
    invokeWebService(url, jsondata, callback);
};

/*业绩统计*/
exports.getPopularizeAchievementList = function(jsondata, callback) {
    var url = wsUserMotheds.getPopularizeAchievementList;
    invokeWebService(url, jsondata, callback);
};

/*业绩明细*/
exports.getPopularizePromoDetailList = function(jsondata, callback) {
    var url = wsUserMotheds.getPopularizePromoDetailList;
    invokeWebService(url, jsondata, callback);
};

/*删除角色*/
exports.removePopularizeRole = function(jsondata, callback) {
    var url = wsUserMotheds.removePopularizeRole;
    invokeWebService(url, jsondata, callback);
};

/*获取提现方式*/
exports.withdrawTypeGet = function(jsondata, callback) {
    var url = wsurls.account + 'withdrawTypeGet';
    invokeWebService(url, jsondata, callback);
};

/*新网用户激活接口*/
exports.xwactiveAccount = function(jsondata, callback){
    var url = config.wsDomains.domain1 + 'xwCustAccount/activeAccount';
    invokeWebService(url, jsondata, callback);
}

/*查询用户信息接口 */
exports.accountFund = function(jsondata,callback){
    var url = config.wsDomains.domain1 + 'account/fund';
    invokeWebService(url, jsondata, callback);
}

//查询用户一个月每一天的收支信息
exports.customerPaymentMonth = function(jsondata, callback) {
    var url = wsurls.customerAccountURL+ 'querymonthlyincome';
    invokeWebService(url, jsondata, callback);
};

//风险测评结果保存
exports.saveRiskTestResult = function(jsondata, callback) {
    var url = config.wsDomains.domain1+ 'user/saveRiskTestResult';
    invokeWebService(url, jsondata, callback);
};

//风险测评结果查询
exports.getRiskTestResult = function(jsondata, callback) {
    var url = config.wsDomains.domain1+ 'user/getRiskTestResult';
    invokeWebService(url, jsondata, callback);
};

//查询运营数据
exports.getOprData = function(jsondata, callback) {
    var url = wsurls.productURL + 'getOprData';
    invokeWebService(url, jsondata, callback);
};

//查询登录信息
exports.findOneBySign2 = function(jsondata, callback) {
    var url = config.wsDomains.domain5 + 'h5user/findOneBySign';
    invokeWebService(url, jsondata, callback);
};
//安全问题加载
// exports.safeProblemLoad = function(jsondata, callback) {
//     var url = m11Methoeds.safeProblemLoad;
//     invokeWebService(url, jsondata, callback);
// };
//密码问题验证
// exports.pwdProblemCheck = function(jsondata, callback) {
//     var url = m11Methoeds.pwdProblemCheck;
//     invokeWebService(url, jsondata, callback);
// };
//重置密码提交
// exports.passwordreset = function(jsondata, callback) {
//     var url = m11Methoeds.passwordreset;
//     invokeWebService(url, jsondata, callback);
// };
//绑定第三方账户
// exports.bindAccount = function(jsondata, callback) {
//     var url = m11Methoeds.bindAccount;
//     invokeWebService(url, jsondata, callback);
// };

Object.keys(wsActivitySmashingEggsMethods).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(wsActivitySmashingEggsMethods[key], jsondata, callback);
    };
})

var getTicket = function(callback) {
    var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.base.wxappid + "&secret=" + config.base.wxsecret;
    var resData = {};
    var fileName = config.base.publicFilePath + "/signature";

    client.get(url, function(result) {
        var res = JSON.parse(result);
        url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + res.access_token + "&type=jsapi";
        client.get(url, function(result) {
            res = JSON.parse(result);
            if (config.base.debugOn) {
                logger.debug("Start to invoke web service : ", res.ticket);
            }
            var curDate = new Date();
            resData.exprieDate = curDate.setHours(curDate.getHours() + 1);
            resData.ticket = res.ticket;
            fs.writeFile(fileName, JSON.stringify(resData), function(err) {
                logger.debug("-------------- : ", err);
                callback(res);
            });

        });
    });
};


//微信验证
exports.WeiXinjsapi_ticket = function(callback) {
    var fsPath = config.base.publicFilePath + "/signature";
    fs.stat(fsPath, function(err, stat) {
        if (err == null) {
            var str = fs.readFileSync(fsPath, 'utf-8');
            if (str) {
                var resdata = JSON.parse(str);
                var diffTime = resdata.exprieDate - new Date().getTime()
                if (diffTime>0 && diffTime <= 3600000) {
                    callback({
                        ticket: resdata.ticket
                    });
                } else {
                    getTicket(callback);
                }
            } else {
                getTicket(callback);
            }
        } else {
            getTicket(callback);
        }
    });

};


//最终生成签名
var gensignature = function(ticket, url) {

    var crypto = require('crypto');
    var timespan = new Date().getTime();
    var noncestr = Math.random().toString(36).substr(2);
    var content = "jsapi_ticket=" + ticket + "&noncestr=" + noncestr + "&timestamp=" + timespan + "&url=" + (config.base.wxshareurl + url)
    var shasum = crypto.createHash('sha1');
    shasum.update(content);
    var res = {};
    res = {}
    res.signature = shasum.digest('hex');
    res.timespan = timespan;
    res.noncestr = noncestr;
    return res;
};
//获取Ticket
var getShareTicket = function(callback) {
    var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.base.wxappid + "&secret=" + config.base.wxsecret;
    client.get(url, function(result) {
        var res = JSON.parse(result);
        url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + res.access_token + "&type=jsapi";
        client.get(url, function(result) {
            res = JSON.parse(result);
            callback(res);
        });
    });
};

//微信分享获取信息
exports.WeiXinShare = function(data, callback) {

    weixinShare.getJsapi_ticket(function(err, obj) {
        if (err != null) {
            callback(err);
        } else {
            if (obj) {
                var difDate = new Date();
                var diffTime = obj.exprieDate.getTime() - difDate.getTime();
                if (diffTime > 0 && diffTime < 7200 * 1000) { //未过期从缓存里面取
                    var result = gensignature(obj.ticket, data.url);
                    callback(result);
                } else {
                    //若过期重新访问保存ticket
                    getShareTicket(function(obj) {
                        if (obj.errmsg == "ok") {
                            var curDate = new Date();

                            weixinShare.saveJsapi_ticket({
                                ticket: obj.ticket,
                                exprieDate: curDate.setSeconds(curDate.getSeconds() + obj.expires_in)
                            }, function() {
                                var result = gensignature(obj.ticket, data.url);
                                callback(result);
                            });
                        } else {
                            logger.error("生成ticket失败", obj);
                        }
                    });
                }
            } else {
                getShareTicket(function(obj) {
                    if (obj.errmsg == "ok") {
                        var curDate = new Date();

                        weixinShare.saveJsapi_ticket({
                            ticket: obj.ticket,
                            exprieDate: curDate.setSeconds(curDate.getSeconds() + obj.expires_in),
                            id: "wxShare_Token"
                        }, function() {
                            var result = gensignature(obj.ticket, data.url);
                            callback(result);
                        });
                    } else {
                        logger.error("生成ticket失败", obj);
                    }
                });

            }
        }
    });
};

/*code 获取微信用户的token*/
exports.getWXUserToken = function(code, callback) {
    //  var appid='wxcdc7b24d7d1218bb',secret='0e08d956bd5f2ae129016bd619d6f80a ';
    //'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code'
    var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.base.wxappid + '&secret=' + config.base.wxsecret + '&code=' + code + '&grant_type=authorization_code';

    client.get(url, function(result) {
        result = JSON.parse(result);
        callback(result);
        //next();
    })
};
/*通过refresh_token获取access_token*/
exports.getWXUserRefreshToken = function(req, res, rtoken, callback) {
    var refreshurl = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' + config.base.wxappid + '&grant_type=refresh_token&refresh_token=' + rtoken;
    client.get(refreshurl, function(result) {
        result = JSON.parse(result);
        /*判断refresh_token 失效 重新获取授权*/
        if (result.errcode && result.errmsg) {
            req.cookies.wxopenid = null;
            var URI = encodeURIComponent(config.base.wxshareurl + req.originalUrl);
            var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + config.base.wxappid + '&redirect_uri=' + URI + '&response_type=code&scope=snsapi_userinfo&state=niuwap2p#wechat_redirect';
            res.redirect(url);
            return
        }
        callback(result)
    })
};

/*通过access_token 获取用户信息*/
exports.getWXUserInfo = function(token, callback) {
    var url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + token + '&openid=' + config.base.wxappid + '&lang=zh_CN';
    client.get(url, function(result) {
        result = JSON.parse(result);
        callback(result)
    })
}

/*和讯纳新begin*/
/*和讯验证成功页面校验接口*/
exports.checkHXNewCustomerRegRed = function(jsondata, callback) {
    var url = hxnxMontheds.checkHXNewCustomerRegRed;
    invokeWebService(url, jsondata, callback);
};

/*发和讯８元和２００元分享红包*/
exports.sendHXNewCustomerRegRed = function(jsondata, callback) {
    var url = hxnxMontheds.sendHXNewCustomerRegRed;
    invokeWebService(url, jsondata, callback);
};

/*检查用户状态*/
exports.checkHXNewCustomerStatus = function(jsondata, callback) {
    var url = hxnxMontheds.checkHXNewCustomerStatus;
    invokeWebService(url, jsondata, callback);
};

/*抢红包接口*/
exports.getHXNewCustomShareRedResult = function(jsondata, callback) {
    var url = hxnxMontheds.getHXNewCustomShareRedResult;
    invokeWebService(url, jsondata, callback);
};

/*获取分享金额*/
exports.getHXNewCustomShareRedAmount = function(jsondata, callback) {
    var url = hxnxMontheds.getHXNewCustomShareRedAmount;
    invokeWebService(url, jsondata, callback);
};

/*获取分享头像及领取状态*/
exports.checkHXNewCustomerStatus = function(jsondata, callback) {
    var url = hxnxMontheds.checkHXNewCustomerStatus;
    invokeWebService(url, jsondata, callback);
};

/*获取list*/
exports.getHXNewCustomShareRedList = function(jsondata, callback) {
    var url = hxnxMontheds.getHXNewCustomShareRedList;
    invokeWebService(url, jsondata, callback);
};
exports.getHXNewCustomShareRedShareHead = function(jsondata, callback) {
    var url = hxnxMontheds.getHXNewCustomShareRedShareHead;
    invokeWebService(url, jsondata, callback);
};
/*和讯纳新end*/
/*获取居间协议*/
exports.viewIICProtocol = function(jsondata, callback) {
        var url = wsprotocolMotheds.viewIICProtocol;
        invokeWebService(url, jsondata, callback);
    }
    /*福袋活动*/
exports.checkNewYearPrizeStatus = function(jsondata, callback) {
    var url = wsCustomerMotheds.checkNewYearPrizeStatus;
    invokeWebService(url, jsondata, callback);
};
exports.sendPrize = function(jsondata, callback) {
    var url = wsCustomerMotheds.sendPrize;
    invokeWebService(url, jsondata, callback);
};

var wsMethod = {
    userLogin: config.wsDomains.domain1 + "user/userLogin",
    checkBindPhoneNo: config.wsDomains.domain1 + "user/checkBindPhoneNo",
    sendRegVaildNo: config.wsDomains.domain1 + "user/sendSms",
    userReg: config.wsDomains.domain1 + "user/saveUser",
    userAuthInfo: config.wsDomains.domain1 + "customerAuth/info", // 判断是否开通自己账户
    userJiangli: config.wsDomains.domain1 + "prod/GiftDiscount",
    userInvest: config.wsDomains.domain1 + "prod/instantInvest",
    selectRecomInfoById: config.wsDomains.domain1 + "user/selectRecomInfoById",
    viewIICProtocol: config.wsDomains.domain1 + "protocol/viewIICProtocol",
    viewICProtocol: config.wsDomains.domain1 + "protocol/viewICProtocol",
    viewBuyerProtocol: config.wsDomains.domain1 + "protocol/viewBuyerProtocol",
    viewApplyTransProtocol: config.wsDomains.domain1 + "protocol/viewApplyTransProtocol",
    verificationCode: config.wsDomains.domain1 + "message/verificationCode",
    checkLoginNameWeb: config.wsDomains.domain1 + "user/checkLoginNameWeb", //忘记密码 验证用户名是否存在并获取custerId
    checkCustomerPage: config.wsDomains.domain1 + "user/checkCustomerPage", //忘记密码 获取用户安全设置信息
    checkCustomerH5: config.wsDomains.domain1 + "user/checkCustomerH5", //忘记密码 提交验证信息
    resetPasswordWeb: config.wsDomains.domain1 + "user/resetPasswordWeb", //密码重置提交
    generateCaptcha: config.wsDomains.domain1 + "verifyCode/genVerifyCode" //获取图片验证码
}

exports.verificationCode = function(jsondata, callback) {
    var url = wsMethod.verificationCode;
    invokeWebService(url, jsondata, callback);
};

exports.userReg = function(jsondata, callback) {
    var url = wsMethod.userReg;
    invokeWebService(url, jsondata, callback);
};
exports.checkBindPhoneNo = function(jsondata, callback) {
    var url = wsMethod.checkBindPhoneNo;
    invokeWebService(url, jsondata, callback);
};
exports.sendRegVaildNo = function(jsondata, callback) {
    var url = wsMethod.sendRegVaildNo;
    invokeWebService(url, jsondata, callback);
};
exports.checkCustomerPage = function(jsondata, callback) {
    var url = wsMethod.checkCustomerPage;
    invokeWebService(url, jsondata, callback);
};
exports.userAuthInfo = function(jsondata, callback) {
    var url = wsMethod.userAuthInfo;
    invokeWebService(url, jsondata, callback);
};
/*实名认证*/
exports.certAuth = function (jsondata, callback) {
    var url = wsurls.account + 'openAccount';
    invokeWebService(url, jsondata, callback);
}

/*
 * 获取邀请码.
 */
exports.selectRecomInfoById = function (jsondata, callback) {
    //restful api post
    var url = wsUserMotheds.selectRecomInfoById;
    invokeWebService(url, jsondata, callback);
};

/*惠享生活*/
Object.keys(wsHuiXiangShengHuoMethods).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(wsHuiXiangShengHuoMethods[key], jsondata, callback);
    };
});

/*m9手机认证+借还款*/
Object.keys(m9Methods).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(m9Methods[key], jsondata, callback);
    };
});
/*m11*/
Object.keys(m11Methoeds).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(m11Methoeds[key], jsondata, callback);
    };
});
/* 代理转发*/
Object.keys(proxyMethods).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(proxyMethods[key], jsondata, callback);
    };
});

/* 通讯认证*/
Object.keys(communicationMethods).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(communicationMethods[key], jsondata, callback);
    };
});

/* restFul转发*/
Object.keys(rest).forEach(function(key) {
    exports[key] = function(param, jsondata, callback) {
        invokeRestService(param, rest[key], jsondata, callback);
    };
});

// 牛呗幸运大抽奖
Object.keys(luckDrawMethods).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(luckDrawMethods[key], jsondata, callback);
    };
});

// 感恩节活动
Object.keys(thanksgiving).forEach(function(key){
    exports[key] = function(jsondata, callback) {
        invokeWebService(thanksgiving[key], jsondata, callback);
    };
})

// 牛呗每日签到
Object.keys(integralMethods).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(integralMethods[key], jsondata, callback);
    };
});

// 牛娃每日签到
Object.keys(nwUserSign).forEach(function(key) {
    exports[key] = function(jsondata, callback) {
        invokeWebService(nwUserSign[key], jsondata, callback);
    };
});

/*
 * Invoke web service. Web service result is json : {data : data, success : true|false, msg : msg}.
 */
function invokeWebService(url, jsondata, callback) {
    args.data = jsondata;
    if (config.base.debugOn) {
        logger.debug("Start to invoke web service : ", url);
        logger.debug("Invoke web service data is : ", args.data);
    }
    client.post(url, args, function(result, response) {
        if (config.base.debugOn) {
            logger.debug("Finish to invoke web service : ", url);
            logger.debug("Invoke web service result is : ", result);
        }
        //parsed response body as js object
        var jresult = result;
        //logger.debug(jresult.data + "=============="); 
        console.log("===" + JSON.stringify(result));
        try {
            if (!jresult.success) {
                if (config.base.debugOn) {
                    logger.debug("Invoke web service result is fail : ", jresult);
                }
            }
        } catch (err) {
            logger.error("Parse web service result to json error : ", err);
        }
        //print response
        if (jresult != null) {
            callback(jresult);
        } else {
            var msg = messages.invokeWSFail;
            callback({
                success: false,
                msg: msg
            });
        }
    }).on('error', function(err) {
        logger.error(messages.invokeWSFailWithColon, err);
    });
}

/*
 * Invoke web service. Web service result is json : {data : data, success : true|false, msg : msg}.
 */
function invokeRestService(param, url, jsondata, callback) {
    args.data = jsondata;
    var urlTotal = url + param
    if (config.base.debugOn) {
        logger.debug("Start to invoke web service : ", urlTotal);
        logger.debug("Invoke web service data is : ", args.data);
    }
    client.post(urlTotal, args, function(result, response) {
        if (config.base.debugOn) {
            logger.debug("Finish to invoke web service : ", urlTotal);
            logger.debug("Invoke web service result is : ", result);
        }
        //parsed response body as js object
        var jresult = result;
        //logger.debug(jresult.data + "=============="); 
        console.log("===" + JSON.stringify(result));
        try {
            if (!jresult.success) {
                if (config.base.debugOn) {
                    logger.debug("Invoke web service result is fail : ", jresult);
                }
            }
        } catch (err) {
            logger.error("Parse web service result to json error : ", err);
        }
        //print response
        if (jresult != null) {
            callback(jresult);
        } else {
            var msg = messages.invokeWSFail;
            callback({
                success: false,
                msg: msg
            });
        }
    }).on('error', function(err) {
        logger.error(messages.invokeWSFailWithColon, err);
    });
}