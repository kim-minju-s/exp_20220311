// db 연동
// npm i mongoose --save
var mongoose = require('mongoose');

// 시퀀스 사용(자동 증가)
// npm i --save mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);

// 몽구스 스키마
// 몽고 디비에는 테이블이 아닌 스키마를 사용
// 데이터를 검증 후 데이터베이스에 넣음
var Schema = mongoose.Schema;

// 번호, 물품코드 (100-001-111, 100-002-111)
// 물품명, 가격, 수량, 등록일
var itemSchema = new Schema({
    _id      : Number,
    code1    : {type: String, default: ''},
    code2    : {type: String, default: ''},
    code3    : {type: String, default: ''},
    name   : {type: String, default: ''},
    price  : {type: Number, default: 0},
    quantity : {type: Number, default: 0},
    regdate : {type: Date, default: Date.now}
});

// 시퀀스 사용 설정
// _id를 기본키로 사용
itemSchema.plugin(AutoIncrement, {id:'SEQ_ITEM8_ID', inc_field : '_id'})

// return 시켜줌
// collection -> item8 에 저장
module.exports = mongoose.model('item8', itemSchema);