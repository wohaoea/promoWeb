var config = require('../config');
var mongoose = require('mongoose');
mongoose.connect(config.base.mongodbpath+'wxtoken');
exports.mongoose = mongoose;
