var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var wxSchema = new Schema({
  openid: String,
  access_token: String,
  refresh_token: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});
var wxInfo = mongodb.mongoose.model("wxInfo", wxSchema);
var wxInfoDAO = function() {};
wxInfoDAO.prototype.save = function(myobj, callback) {
  var _this = this;
  _this.findByName(myobj.openid, function(err, obj) {
    if (obj == null) {
      var instance = new wxInfo(myobj);
      instance.save(function(err) {
        callback(err);
      });
    }else{
      if (obj.isNew) {
        var instance = new wxInfo(myobj);
        instance.save(function(err) {
          callback(err);
        });
      } else {
        _this.findByNameAndUpdate({
          openid: myobj.openid
        }, myobj, {
          upsert: true
        }, function() {
          callback();
        });
      }
    }
  })
};

wxInfoDAO.prototype.findByNameAndUpdate = function(obj, update, options, callback) {
  /* var openid = obj.openid;
   delete obj.openid;*/
  wxInfo.findOneAndUpdate(obj, update, options, function(err) {
    if (!err) {
      callback();
    }
  });
}

wxInfoDAO.prototype.findByName = function(openid, callback) {
  wxInfo.findOne({
    'openid': openid
  }, function(err, obj) {
    callback(err, obj);
  });
};


module.exports = new wxInfoDAO();