var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    id_: String,
    dmg: Object,
    seed: String,
    credit: Number
});

module.exports = mongoose.model('User', userSchema);
