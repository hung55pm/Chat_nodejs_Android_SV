/**
 * Created by MR_HUNG on 2/23/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mesRecentSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    list: [{room_id:String,person_id:String, name: String, message:String, date: Date}]
});
module.exports = mongoose.model('MessageRecent', mesRecentSchema);