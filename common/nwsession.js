/**
 * Created by Administrator on 2016/7/15.
 */
var config = require('../config');
var Cookies = require("cookies")
var uid = require('uid-safe').sync
var mongoose = require('mongoose');
function nwsession(router, nwconfig) {
    var _this = this;
    var db = mongoose.createConnection(config.base.mongodbpath+nwconfig.dbName); //创建一个数据库连接
    var sessionsSchema = new mongoose.Schema({
        _id:String,
        expires:Date,
        session:String   //定义一个属性name，类型为String
    }).index({"expires": 1},{expireAfterSeconds: 0});
    this.sessionsModel = db.model('sessions',sessionsSchema);
    router.all("*",function (req,res,next) {
        var times = new Date(Date.now()+60*60*24*30*1000)
        var ckConf = {
            expires: times
        }
        var cookie = new Cookies(req,res)
        cookie.maxage = 60*60*24*30*1000
        var nwId = cookie.get(nwconfig.cookieName);
        if(!nwId){
            nwId = uid(24)
            cookie.set(nwconfig.cookieName,nwId, {})
            new _this.sessionsModel({
                _id:nwId,
                expires:times
            }).save(function (err,resp) {
                req.locals = {cookieId:nwId}
                next()
            });
            return
        }
        _this.sessionsModel.findOne({_id:nwId},function (err,result) {
            if(!result){
                nwId = uid(24)
                cookie.set(nwconfig.cookieName,nwId)
                new _this.sessionsModel({
                    _id:nwId,
                    expires:times
                }).save(function (err,resp) {
                    req.locals = {cookieId:nwId}
                    next()
                });
            }else{
                _this.sessionsModel.update({_id:nwId},{$set:{expires:times}})
                req.locals = {cookieId:nwId,session:JSON.parse(result.session||null)}
                next()
            }
        })
    })
}

nwsession.prototype.set = function (req, obj ,callback) {
    this.sessionsModel.update({_id:req.locals.cookieId},{$set:{session:JSON.stringify(obj)}},function (err,response) {
        callback&&callback.call("",err,response)
    })
}

module.exports = nwsession;