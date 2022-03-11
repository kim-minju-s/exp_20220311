// db 연동
// npm i mongoose --save
var mongoose = require('mongoose');

// 시퀀스 사용(자동 증가)
// npm i --save mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);

var Schema = mongoose.Schema;

// entity 만들기
// 책코드, 책제목, 가격, 저자, 등록일 
var bookSchema = new Schema({
    _id     : Number,
    title   : {type: String, default: ''},
    price   : {type: Number, default: 0},
    author  : {type: String, default: ''},
    regdate : {type: Date, default: Date.now}
});

// 시퀀스 사용 설정
// _id를 기본키로 사용
bookSchema.plugin(AutoIncrement, {id:'SEQ_BOOK8_ID', inc_field : '_id'})

// return 시켜줌
// collection -> book8 에 저장
module.exports = mongoose.model('book8', bookSchema);