var express = require('express');
var router = express.Router();
var wsclient = require('../common/wsclient');
var utils = require('../common/utils');

/*
 *资费标准及说明	
 */
router.get("/getCost/:bdfPrjType", function(req, res, next) {
	wsclient.showProtocol({
        CUST_ID:req.session.user.custId,
        type:'cost',
        bdfPrjType:req.params.bdfPrjType,
    }, function(json) {
		res.send(utils.Base64.decode(json.data.html));
    });
});



/*
 *借款协议
 */
router.get("/getLoan/:bdfPrjType", function(req, res, next) {
	wsclient.showProtocol({
        CUST_ID:req.session.user.custId,
        type:'loan',
        bdfPrjType:req.params.bdfPrjType,
    }, function(json) {
		res.send(utils.Base64.decode(json.data.html));
    });
});



/*
 *借款居间协议
 */
router.get("/getIntermediary/:bdfPrjType", function(req, res, next) {
	wsclient.showProtocol({
        CUST_ID:req.session.user.custId,
        type:'intermediary',
        bdfPrjType:req.params.bdfPrjType,
    }, function(json) {
		res.send(utils.Base64.decode(json.data.html));
    });
});

module.exports = router;