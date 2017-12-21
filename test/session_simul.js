var session = require("../common/session");

//设置session
session.get = function(req) {
	var session = req.session;
	if (this.islogin) {
		session.user = {
			custId: 1000
		};
	} else {
		session.user = null;
	}

	return session;
};
exports.get = session.get;

exports.setlogin=function(sess){
	sess.islogin=true;
};

//用户信息
/*exports.setUser = session.setUser = function(req, obj) {
	var session = req.session;
	if (!session) return null;
	req.session.user = obj;
};*/