var mongoose = require('mongoose');

var url = 'mongodb://'+process.env.db_user+':'+process.env.db_pass+'@ds263837.mlab.com:63837/strada';
mongoose.connect(url);

module.exports = mongoose.connection;
