/**
 * Created by NGOCHUNG on 2/21/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    room_id: {
        type: String,
        required: true,
        unique: true
    },
    list: [{user_id:String, name: String, message:String, date: Date}]
});
module.exports = mongoose.model('Message', messageSchema);
