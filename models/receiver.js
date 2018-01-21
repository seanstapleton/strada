var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var receiverSchema = new Schema({
    address: String,
    timestamp: Date
});

module.exports = mongoose.model('receiver', receiverSchema);
