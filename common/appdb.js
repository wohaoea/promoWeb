/**
 * Created by Administrator on 2017/8/31.
 */
var config = require('../config');
var mongoose = require('mongoose');
var db = mongoose.createConnection(config.base.mongodbpath+'appdb_invest'); //创建一个数据库连接
var userSchema = new mongoose.Schema({
    LOGIN_NAME: String,
    SIGN: String,
    SESSION_ID: String,
    CUST_ID: String,
    SID: String,
    SYSTEM_TYPE: String
},{collection:"app_user_session"});
var userModel = db.model('app_user_session', userSchema);

function findUserBySign(sign,callback){
    userModel.findOne({SIGN:sign},function(err, json){
        if(json){
            callback.call("", json._doc);
        }else{
            callback.call("", null)
        }
    });
}
exports.findUserBySign = findUserBySign;
