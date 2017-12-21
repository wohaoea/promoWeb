var express = require('express');
var router = express.Router();
var config = require('../config');
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var messages = require('../common/messages');
var nwsessionConfig = require('../common/nwsession');


router.get('/qianbao',function(req,res){
    res.render('qianbao/qianbao',{})
})
module.exports = router;