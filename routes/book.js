var express = require('express');
var router = express.Router();  // 라우터 레벨 미들웨어

// entity저장소에서 book스키마 모델 가져오기
var Book = require('../models/book');

// 127.0.0.1:3000/book/insert
// 도서 추가하기
// {'title':'통합구현', 'price':1200, 'author':'가나다'}
router.post('/insert', async function(req, res, next) {
    try {
        // 저장소에 있는 book 스키마 선언
        // book 객체 생성
        // var 객체명 = new 클래스명();
        var obj = new Book();
        obj.title = req.body.title;     // 객체 변수 안에 데이터 넣기
        obj.price = Number(req.body.price);
        obj.author = req.body.author;

        // 객체에 저장
        const result = await obj.save();
        console.log("추가 결과" + result);
        if (result._id > 0) {
            return res.json({status:200});
        }
        // 리턴 값으로 json 형식의 응답을 보냄
        return res.json({status:0});

    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }
  });

// 127.0.0.1:3000/book/select
// 요청 형식: get
// 도서 조회하기
router.get('/select', async function(req, res, next) {
    try {
        const result = await Book.find({}).sort({_id: -1});
        console.log(result);

        return res.json({status:200, result:result});
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }

});

// 127.0.0.1:3000/book/delete
router.delete('/delete', async function(req, res, next) {
    try {
        const result = await Book.deleteOne({_id: req.body._id});
        console.log(result);

        return res.json({status:200});
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }

});

module.exports = router;
