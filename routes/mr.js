var wxinfo = require('../common/wxinfo');
/*将 微信opendid access_token refresh_token 存入mongodb中 */
exports.doAdd = function(req, res,json,callback) {
 
   // var json = req.body.content;
    // //var json = JSON.parse(req.body.content);


        wxinfo.save(json, function(err){
            if(err) {
               callback({'success':false,'err':err});
            } else {
                callback({'success':true});
            }
        }); 
};

/*通过openid 查找 access_token refresh_token*/
exports.findJSON = function(req, res,openid,callback) {
    wxinfo.findByName(openid,function(err, obj){
        callback(obj);
    });
}


