var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

//access_token
var accessToken = new Schema({
	access_token: String,
	exprieDate: Date,
	id:String

});

//jsapi_ticket
var jsapiTicket = new Schema({
	ticket: String,
	exprieDate: Date,
	id:String
})


var wxShare_Token = mongodb.mongoose.model("accessToken", accessToken);

var wxShare_Ticket = mongodb.mongoose.model("jsapiTicket", jsapiTicket);

var wxShareDAO = function() {};

function save(model,obj, callback) {
	
	wxShare_Ticket.findOne({
		'id': "wxShare_Ticket"
	}, function(err,result) {
		if(result==null){
			var instance = new model(obj);
			instance.save(function(err) {
				callback(err);
			});
		}else{
			model.findOneAndUpdate(obj.id, obj, {
				upsert: true
			}, function(err) {
				callback(err);
			});
		}
	});

};

/*
//保存access_token
wxShareDAO.prototype.save = function(myobj, callback) {
	var instance = new wxInfo(myobj);

	if (myobj.id) {
		var instance = new wxInfo(myobj);
		instance.save(function(err) {
			callback(err);
		});
	} else {
		wxInfo.findOneAndUpdate(myobj.id, myobj, {
			upsert: true
		}, function(err) {
			callback(err);
		});
	}
	save(wxShare_Token,myobj, callback);
};*/

//获取Token
wxShareDAO.prototype.getAccessToken = function(callback) {
	wxShare_Ticket.findOne({
		'id': "wxShare_Token"
	}, function(err, obj) {
		callback(err, obj);
	});
};

//保存access_token
wxShareDAO.prototype.saveAccessToken = function(myobj, callback) {
	save(wxShare_Token,myobj, callback);
};

//获取Token
wxShareDAO.prototype.getJsapi_ticket = function(callback) {
	wxShare_Ticket.findOne({
		'id': "wxShare_Ticket"
	}, function(err, obj) {
		callback(err, obj);
	});

};

//保存jsapi_ticket
wxShareDAO.prototype.saveJsapi_ticket = function(myobj,callback) {
	myobj.id="wxShare_Ticket";
	save(wxShare_Ticket,myobj, callback);
};

module.exports = new wxShareDAO();