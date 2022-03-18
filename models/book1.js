// 이미지 첨부하기
// npm i mongoose --save
var mongoose = require('mongoose');

// 시퀀스 사용(자동 증가)
// npm i --save mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);

// 몽구스 스키마
// 몽고 디비에는 테이블이 아닌 스키마를 사용
// 데이터를 검증 후 데이터베이스에 넣음
var Schema = mongoose.Schema;

// entity 저장소 만들기(스키마 사용)
// 책코드, 책제목, 가격, 저자, 등록일 
var bookSchema = new Schema({
    _id     : Number,
    title   : {type: String, default: ''},

    // 이미지 첨부
    filedata: {type: Buffer, default: null},
    filesize: {type: Number, default: 0},
    filetype: {type: String, default: ''},
    filename: {type: String, default: ''},

    regdate : {type: Date, default: Date.now}
});

// 시퀀스 사용 설정
// _id를 기본키로 사용
bookSchema.plugin(AutoIncrement, {id:'SEQ_BOOK10_ID', inc_field : '_id'})

// return 시켜줌
// collection -> book8 에 저장
module.exports = mongoose.model('book10', bookSchema);