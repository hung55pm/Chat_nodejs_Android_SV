/**
 * Created by NGOCHUNG on 2/15/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var friendsSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    list: [{friend_id: String,status:Number, name: String}]
});
module.exports = mongoose.model('Friends', friendsSchema);
