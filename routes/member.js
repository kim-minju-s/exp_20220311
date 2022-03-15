var express = require('express');
var router = express.Router();

// 문자를 HASH 하기
// 문자가 들어오면 암호화해서 단반향으로 출력(16진수 사용)
const crypto = require('crypto');

// 토큰 발행
const jwt = require('jsonwebtoken');
const auth = require('../token/auth');

// member 스키마 가져오기 import
var Member = require('../models/member');


// 127.0.0.1:3000/member/selectone
router.get('/selectone', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID;

        // 쿼리로 받아오는 아이디로 조회하기
        const result = await Member.findOne({_id:sessionID})
            .select({"name":1, "age":1});
        // 존재하는 아이디와 존재하지 않는 아이디를 사용하여 결과 값 비교하기
        console.log(result);

        if (result != null) {
            return res.send({status:200, result:result});
        }
        return res.send({status:200, result:0});

    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});

// 로그인: 회원정보 수정
// 토큰, 이름과 나이 변경
// 127.0.0.1:3000/member/update
router.put('/update', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID;  // 토큰에서 추출
        const name = req.body.name;         // 전달된 값
        const age = req.body.age;

        // 아이디에 해당하는 값을 조회 후 변경할 항목 2개 변경
        var Member1 = await Member.findOne({_id: sessionID});
        Member1.name = name;
        Member1.age = age;
        console.log(Member1);

        const result = await Member1.save();
        if (result._id != '') {
            return res.send({status:200});
        }
        return res.send({status:0});
    }
    catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});

// 로그인: 암호변경
// 127.0.0.1:3000/member/updatepw
router.put('/updatepw', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID;

        const hashPW = crypto.createHmac('sha256', sessionID )
        .update(req.body.password).digest('hex');

        // 로그인
        // DB 연동 키 (_id, password)
        const query = {_id: sessionID, password: hashPW };
        const Member1 = await Member.findOne(query);

        const hashPW1 = crypto.createHmac('sha256', sessionID )
        .update(req.body.newpw).digest('hex');

        // 새로운 비밀번호 덮어씌우기
        Member1.password = hashPW1;

        const result = await Member1.save();
        console.log('암호 변경--->', result);
        if (result._id != '') {
            return res.send({status:200});
        }
        return res.send({status:0});

    }
    catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});

// 로그인: 회원탈퇴
// 127.0.0.1:3000/member/deletepw
router.delete('/deletepw', auth.checkToken, async function(req, res, next) {
    try {
        const sessionID = req.body.USERID;
        console.log('세션아이디---_>', sessionID);

        const hashPW = crypto.createHmac('sha256', sessionID )
        .update(req.body.password).digest('hex');

        const query = {_id: sessionID, password: hashPW };

        const result = await Member.deleteOne(query);
        console.log('삭제 결과', result);
        
        if (result.deletedCount == 1) {
            return res.send({status:200});
        }
        return res.send({status:0});

    }
    catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});

// 로그인
// 로그인을 하면 아이디와 암호를 토큰에 저장
// 127.0.0.1:3000/member/select
router.post('/select', async function(req, res, next) {
    try {
        // get => req.query.키
        // post => req.body.키
        console.log(req.body._id);
        console.log(req.body.password);

        const hashPW = crypto.createHmac('sha256', req.body._id )
        .update(req.body.password).digest('hex');

        // DB 연동 키 (_id, password)
        // 아이디와 비밀번호가 둘 다 일치하는 항목
        const query = {$and : [{_id: req.body._id, password:hashPW}]};

        const result = await Member.findOne(query);
        console.log(result);

        if (result != null) {
            // 세션에 정보를 추가함
            // 같은서버가 아니기때문에 세션을 확인할 방법없음
            // 토큰(출입할 수 있는 키를)을 발행
            
            const sessionData = {
                USERID: result._id, 
                USERNAME: result.name,

            };
            // 아이디, 이름, 암호를 토큰에 보관
            // (세션에 추가할 값, 보안 키, 옵션)
            const token = jwt.sign(sessionData, auth.securityKEY, auth.options);

            // DB에 token 이라는 키로 수정함

            return res.send({status:200, result:token});
        }
        return res.send({status:0});
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});

// 아이디 중복 확인하기 
// 127.0.0.1:3000/member/idcheck
router.get('/idcheck', async function(req, res, next) {
    try {
        // 쿼리로 받아오는 아이디로 조회하기
        const result = await Member.findOne({_id:req.query._id});
        // 존재하는 아이디와 존재하지 않는 아이디를 사용하여 결과 값 비교하기
        console.log(result);

        if (result != null) {
            return res.send({status:200, result:1});
        }
        return res.send({status:200, result:0});

    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});

// 회원 추가하기 
// 127.0.0.1:3000/member/insert
router.post('/insert', async function(req, res, next) {
    try {
        // a+1 => a5sg153
        // a+2 => a65s4dg
        const hashPW = crypto.createHmac('sha256', req.body._id )
            .update(req.body.password).digest('hex');

        // 빈 member 객체 생성
        var obj = new Member();
        // obj['id'] = req.body.id;
        obj._id = req.body._id;
        obj.name = req.body.name;
        obj.password = hashPW;
        obj.age = Number(req.body.age);
        obj.email = req.body.email;
        
        const result = await obj.save();
        console.log("member 추가" + result);
        if (result._id != '') {
            return res.json({status:200});
        }
        return res.json({status:0});
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
// router.put('/update', async function(req, res, next) {
//     try {
//         // 기존의 데이터를 읽음
//         const obj = await Member.findOne({_id:req.body._id});
        
//         // 변경할 항목(이름, 나이) 설정
//         obj.name = req.body.name;
//         obj.age = Number(req.body.age);
//         console.log("수정하기 위해 아이디 찾음" + obj);

//         // 저장하기(아이디 값이 동일하기 때문에 수정됨)
//         const result = await obj.save();
//         console.log("수정 결과" + result);

//         return res.json({status:200});        
//     } catch (e) {
//         console.error(e);
//         return res.json({status:-1});
//     }
// });

module.exports = router;
