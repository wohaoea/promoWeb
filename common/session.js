//设置session
exports.get = function(req) {
	var session = req.session;
	if (!session) return null;
	return session;
};

//用户信息
exports.setUser = function(req,obj) {
	var session = req.session;
	if (!session) return null;
	req.session.user=obj;
};

