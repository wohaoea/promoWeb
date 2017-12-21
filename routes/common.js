var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');
var config = require('../config');
/*
 *获取IMG
 */
router.get("/getimg/:imgid", function(req, res, next) {
	if (!req.params.imgid) {
		res.send("无此图片");
	}
	var imgid = req.params.imgid;
	var imgidPrefix = imgid.substring(0, 2);
	if (imgidPrefix == "pr" && !req.session.user.custId) {
		res.send("无权限访问");
	}
	var newPath = "";
	if (imgid.indexOf("-") >= 0) {
		//进行截取日期
		if (imgid.split("-")[1].split(".")[0].indexOf("_") > -1) {
			newPath = imgid.split("-")[1].split(".")[0].split("_")[0] + "/";
		} else {
			newPath = imgid.split("-")[1].split(".")[0] + "/";
		}
	}
	var accessPath = imgidPrefix == "pr" ? config.base.privateFilePath : config.base.publicFilePath;
	var fs = require("fs");
	fs.readFile(accessPath + newPath + imgid, function(err, data) {
		if (data) {
			/*res.write(data, "binary");
			res.end();*/
			res.writeHead(200, {
				'Content-Type': 'image/jpeg'
			});
			res.end(data);
		} else {
			res.send("图片不存在");
		}
	});

});

router.get("/niubei",function(req, res){
	res.render("index_app")
})

router.get("/testweixin", function(req, res){
	var token = "xztestweinxin";
	var signature = req.query.signature;
	var echostr = req.query.echostr;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var arry = [token, timestamp, nonce];
	var content = arry.sort().join("");
	var crypto = require('crypto');
	var shasum = crypto.createHash('sha1');
	shasum.update(content);
	var newsign = shasum.digest('hex');
	if(newsign==signature){
		res.send(echostr);
	}else{
		res.send("error")
	}

})

/**
 * 添加心跳，检查是否宕机
 */
router.post('/heartbeat', function (req, res) {
	var p = req.body.p;
	if(p=='hearttest'){
		res.send("1");
	}else{
		console.log("hostile attack");
		res.send("0");
	}
})

// 新版
router.post("/p/post", function(req, res, next) {
	var body = req.body;
	var tourl = body.tourl;

	delete body.tourl;
	var wsresult = {};
	wsresult.postData = body;
	wsresult.tourl = tourl;
	res.render("post", wsresult);
});
module.exports = router;