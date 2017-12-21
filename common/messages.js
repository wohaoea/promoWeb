var messages = {
	//需要进行图形验证码、手机短信验证码和语音验证码的页面。
	validateCodeNotNull : '验证码不能为空',
	
	//需要进行图形验证码、手机短信验证码和语音验证码的页面。
	invalidVCode : '无效的验证码，请重新获取验证码',
	
	//需要进行图形验证码、手机短信验证码和语音验证码的页面。
	vcodeNotCorrect : '验证码错误',
	
	//用户注册、登录页面。
    loginNameIsNull : '用户登录名必须填写',
    
    //用户注册、登录页面。
    passwordIsNull : '用户登录密码必须填写',
    
    //用户注册页面。
    passwordDifference : '两次输入的密码不一致',
    
    //用户未登录或登录超时的提示。
    notLogin : '用户没有登录，或登录已超时，请重新登录',
    
    //手机验证页面。
    phoneNoIsNull : '手机号码必须填写',
    
    //手机号码与验证码不匹配。
    phoneNoNotMatchVCode : '手机号码与验证码不匹配',
    
    //调用后台核心系统的服务失败。
    invokeWSFail : '调用Web Service失败',
    
    //调用后台核心系统的服务失败。
    invokeWSFailWithColon : '调用Web Service失败：',

    userCardCode :"未满18周岁不允许开通资金帐户",

    // 汇付接口类型
    hftgMessage:{
        UserRegister:"用户开户",
        UserBindCard:"用户绑卡",
        UserLogin:"用户登录",
        AcctModify:"账户信息修改",
        CorpRegister:"企业开户",
        DelCard:"删除银行卡",
        NetSave:"充值",
        UsrFreezeBg:"资金（货款）冻结",
        UsrUnFreeze:"资金（货款）解冻",
        InitiativeTender:"主动投标",
        AutoTender:"自动投标",
        TenderCancle:"投标撤销",
        AutoTenderPlan:"自动投标计划",
        AutoTenderPlanClose:"自动投标计划关闭",
        Loans:"自动扣款（放款）",
        Repayment:"自动扣款（还款）",
        Transfer:"转账（商户用）",
        Cash:"取现",
        CashAudit:"取现复核",
        UsrAcctPay:"用户账户支付",
        MerCash:"商户代取现",
        UsrTransfer:"前台用户间转账",
        CreditAssign:"债权转让",
        AutoCreditAssign:"自动债权转让",
        AddBidInfo:"标的信息录入",
        QueryBalance:"余额查询",
        QueryBalanceBg:"余额查询（后台）",
        QueryAccts:"商户子账户信息查询",
        QueryTransStat:"交易状态查询",
        QueryTenderPlan:"自动投标计划状态查询",
        Reconciliation:"放还款对账",
        TrfReconciliation:"商户扣款对账",
        CashReconciliation:"取现对账",
        saveReconciliation:"充值对账",
        QueryCardInfo:"银行卡查询",
        CorpRegisterQuery:"企业开户状态查询",
        CreditAssignReconciliation:"债权查询",
        QueryUsrInfo:"用户信息查询",
        QueryTransDetail:"交易明细查询",
        QueryBidInfo:"标的审核状态查询",
        QueryCashBalanceBg:"可取现金额查询（后台）",
        QueryBidInfoDetail:"标的投标信息查询",
        QueryPayQuota:"快捷充值限额信息查询",
        QueryRetQuota:"订单剩余可还款金额",
        BgRegister:"后台用户开户",
        BgBindCard:"用户后台绑卡",
        ImpOrd:"后台订单补入",
        DirecTrfAuth:"定向转账授权",
        DirecTrf:"定向转账",
        QueryDirecTrfAuth:"定向转账授权查询",
    },

    // 新网存管接口类映射
    xwcgMessage: {
        "PERSONAL_REGISTER_EXPAND": "个人绑卡注册",
        "ENTERPRISE_REGISTER": "企业绑卡注册",
        "PERSONAL_BIND_BANKCARD_EXPAND": "个人绑卡",
        "ENTERPRISE_BIND_BANKCARD": "企业绑卡",
        "UNBIND_BANKCARD": "解绑银行卡",
        "RESET_PASSWORD": "修改密码",
        "CHECK_PASSWORD": "验证密码",
        "MODIFY_MOBILE_EXPAND": "预留手机号更新",
        "ENTERPRISE_INFORMATION_UPDATE": "企业信息修改",
        "ACTIVATE_STOCKED_USER": "会员激活",
        "CHANGE_USER_BANKCARD": "未激活换卡",
        "RECHARGE": "充值",
        "DIRECT_RECHARGE": "自动充值",
        "WITHDRAW": "提现",
        "CONFIRM_WITHDRAW": "提现确认",
        "CANCEL_WITHDRAW": "取消提现",
        "AUTO_WITHDRAW": "自动提现",
        "INTERCEPT_WITHDRAW": "提现拦截",
        "ESTABLISH_PROJECT": "创建标的",
        "MODIFY_PROJECT": "变更标的",
        //"USER_PRE_TRANSACTION": "用户预处理",
        "USER_PRE_TRANSACTION": "还款",
        "CANCEL_PRE_TRANSACTION": "预处理取消",
        "SYNC_TRANSACTION": "单笔交易",
        "ASYNC_TRANSACTION": "批量交易",
        "DEBENTURE_SALE": "单笔债权出让",
        "INTELLIGENT_PROJECT_DEBENTURE_SALE": "批量债权出让",
        "CANCEL_DEBENTURE_SALE": "取消债权出让",
        "USER_AUTHORIZATION": "用户授权",
        "CANCEL_USER_AUTHORIZATION": "取消用户授权",
        "USER_AUTO_PRE_TRANSACTION": "授权预处理",
        "ESTABLISH_INTELLIGENT_PROJECT": "创建批量投标计划",
        "PURCHASE_INTELLIGENT_PROJECT": "创建批量投标请求",
        "INTELLIGENT_PROJECT_UNFREEZE": "批量投标请求解冻",
        "VERIFY_DEDUCT": "验密扣费",
        "FREEZE": "资金冻结",
        "UNFREEZE": "资金解冻",
        "DOWNLOAD_CHECKFILE": "对账文件下载",
        "CONFIRM_CHECKFILE": "对账文件确认",
        "UNFREEZE_TRADE_PASSWORD": "交易密码解冻",
        "QUERY_USER_INFORMATION": "用户信息查询",
        "QUERY_TRANSACTION": "单笔交易查询",
        "QUERY_PROJECT_INFORMATION": "标的信息查询",
        "QUERY_INTELLIGENT_PROJECT_ORDER": "批量投标请求流水查询"
    }
};

module.exports = messages;
