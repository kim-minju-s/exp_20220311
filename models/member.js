// db 연동
// npm i mongoose --save
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var memberSchema = new Schema({
    _id: {type: String, default:''},
    name: {type: String, default:''},
    password: {type: String, default:''},
    email: {type: String, default:''},
    age: {type: Number, default:0},
    regdate: {type: Date, default: Date.now}
});

// return 시켜줌
// collection -> member8 에 저장
module.exports = mongoose.model('member8', memberSchema);