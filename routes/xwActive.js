var express = require('express')
var router = express.Router()
var wsclient = require('../common/wsclient')
var utils = require('../common/utils')
var config = require('../config')
var messages = require('../common/messages')
var path = require('path')
var logger = require('../common/logger')

// 新网银行存管资金账户激活页面
router.all("/active", function(req, res) {
    var custId = req.body.custId||req.query.custId;
    if(custId){
        req.session.userId = custId;
        res.render('accountActive');  
    }else{
        res.send('操作失败')
    }   
});

/**
 * 新网用户激活
 */
router.post('/xwCustAccount/activeAccount', function(req, res) {
    wsclient.xwactiveAccount({
        "custId": req.session.userId,
        "platform": "app",
        "userRole": req.body.userRole
    }, function(result) {
        // if (result.success) {
        //     result.data.message = decodeURIComponent(result.data.message);
        //     result.data.message = utils.dataConvert(result.data.message);
        // }
        res.send(result);
    })
})

module.exports = router