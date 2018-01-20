var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({
    user_id: String,
    dmg: Object,
    location: String
});

module.exports = mongoose.model('Log', logSchema);
