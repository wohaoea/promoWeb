/**
 *  活动中心
 */
var express = require('express')
var router = express.Router()
var wsclient = require('../common/wsclient')
var utils = require('../common/utils')
var config = require('../config')
var messages = require('../common/messages')
var path = require('path')
var logger = require('../common/logger')

router.get('/active',function(req,res){
    utils.cmsReadFile(config.base.cmsFilePath + 'images/catalog/iniuwa_activity.json',function(data){
        if(data && data.list.length){
            var opening = [],
                closed = [],
                wait_open = [];
            for(var i = 0;i < data.list.length;i++){
                var list = data.list[i];
                var sysDate = list.sysDate;
                sysDate = new Date(Date.parse(sysDate.replace(/-/g, "/")));
                sysDate = sysDate.getTime();
                data.list[i].sysDate = sysDate;
                if(list.openStatus=='OPENING'){
                    opening.push(list)
                }else if(list.openStatus=='CLOSED'){
                    closed.push(list);
                }else if(list.openStatus=='WAIT_OPEN'){
                    wait_open.push(list);
                }
            }
            var newList = [];
            opening = sortByDate(opening);
            wait_open = sortByDate(wait_open);
            closed = sortByDate(closed);
            newList = opening.concat(wait_open).concat(closed);
            data.list = newList;
            function sortByDate(list){
                return list.sort(function(a,b){
                    return b.sysDate - a.sysDate
                })
            }
            res.render("niuwaAppactive",data)
        }else{
            res.render("niuwaAppactive",{
                list: []
            })
        }
    })
})

// 获取活动最新状态
router.post('/getActiveInfo',function(req,res){
    var activeId = req.body.activeId;
    var activeInfo = {};
    utils.cmsReadFile(config.base.cmsFilePath + 'images/catalog/iniuwa_activity.json',function(data){
        if(data && data.list.length){
            for(var i = 0;i < data.list.length;i++){
                if(data.list[i].id == activeId){
                    activeInfo = data.list[i] 
                }
            }
        }
        res.send(activeInfo);
    })
})

module.exports = router;