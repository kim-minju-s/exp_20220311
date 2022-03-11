var express = require('express');
var router = express.Router();

var Member = require('../models/member');

// 127.0.0.1:3000/member/insert
router.post('/insert', async function(req, res, next) {
    try {
        var obj = new Member();
        obj._id = req.body._id;
        obj.name = req.body.name;
        obj.password = Number(req.body.password);
        obj.age = Number(req.body.age);
        obj.email = req.body.email;
        
        const result = await obj.save();
        console.log("member 추가" + result);
        
        return res.json({status:200});
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }

});

// 127.0.0.1:3000/member/select
router.get('/select', async function(req, res, next) {
    try {
        const result = await Member.find({});
        console.log("member 조회" + result);

        return res.json({status:200, result:result});        
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }
});

// 127.0.0.1:3000/member/delete
router.delete('/delete', async function(req, res, next) {
    try {
        const result = await Member.deleteOne({_id:req.body._id});
        console.log("member 삭제" + result);

        return res.json({status:200});        
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }
});

// 127.0.0.1:3000/member/update
// {"_id":"a", "name":"변경할 이름", "age":123}
router.put('/update', async function(req, res, next) {
    try {
        // 기존의 데이터를 읽음
        const obj = await Member.findOne({_id:req.body._id});
        
        // 변경할 항목(이름, 나이) 설정
        obj.name = req.body.name;
        obj.age = Number(req.body.age);
        console.log("수정하기 위해 아이디 찾음" + obj);

        // 저장하기(아이디 값이 동일하기 때문에 수정됨)
        const result = await obj.save();
        console.log("수정 결과" + result);

        return res.json({status:200});        
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }
});

module.exports = router;
