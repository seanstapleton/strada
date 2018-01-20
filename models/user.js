var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id_: String,
    dmg: Object,
    address: String
});

module.exports = mongoose.model('User', userSchema);
