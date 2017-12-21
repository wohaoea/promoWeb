var express = require('express')
var router = express.Router()
var wsclient = require('../common/wsclient')
var utils = require('../common/utils')
var config = require('../config')
var messages = require('../common/messages')
var path = require('path')
var logger = require('../common/logger')

router.get('/iniuwa1111',function(req,res){
    res.render('iniuwa1111')
})

module.exports = router;