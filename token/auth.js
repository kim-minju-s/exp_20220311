
const jwt = require('jsonwebtoken');

// module.exports = { }
const self = module.exports = {

    // 토큰발행 salt 값
    securityKEY : 'feilj!a4w$i6ejf2o',
    
    // 토큰발행에 필요한 옵션들
    options : {
        algorithm : 'HS256',
        expiresIn : '10h', // 10시간
        issuer : 'ds',
    },

    // 프런트엔드에서 오는 토큰 검증
    checkToken : async(req, res, next) => {
        try {
            
            const token = req.headers.auth; // 키는 auth;
            // 토큰의 존재유무 확인
            if (token === null) {
                return res.send({status:0, result:'토큰 없음'});
            }

            // 발행시 sign <=> verify 검증시
            // (발행된 토큰, 보안키)
            const sessionData = jwt.verify(token, self.securityKEY);

            // USERID, USERNAME 키가 존재하는지 확인
            if (typeof sessionData.USERID === 'undefined') {
                return res.send({status:0, result:'토큰 복원 실패'});
            }
            if (typeof sessionData.USERNAME === 'undefined') {
                return res.send({status:0, result:'토큰 복원 실패'});
            }

            // routes/member.js 에서 사용가능하도록 정보전달
            req.body.USERID = sessionData.USERID;
            req.body.USERNAME = sessionData.USERNAME;

            next();     // routes/member.js 로 전환

        } catch (e) {
            console.error(e.message);
            if (e.message === 'invalid signature') {
                return res.send({status:-1, result:'인증 실패'});
            }
            else if (e.message === 'jwt expired') {
                return res.send({status:-1, result:'시간 만료'});
            }
            else if (e.message === 'invalid token') {
                return res.send({status:-1, result:'유효하지 않는 토큰'});
            }
            return res.send({status:-1, result:'유효하지 않는 토큰'});
        }
    }
}