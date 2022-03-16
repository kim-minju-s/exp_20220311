var express = require('express');
var router = express.Router();

var Item = require('../models/item');

// 127.0.0.1:3000/item/insert
router.post('/insert', async function(req, res, next) {
    try {
        var item = new Item();
        item.code1 = req.body.code1;
        item.code2 = req.body.code2;
        item.code3 = req.body.code3;
        item.name = req.body.name;
        item.price = Number(req.body.price);
        item.quantity = Number(req.body.quantity);

        console.log('routes/item --->', item);

        const result = await item.save();
        console.log('result --->', result);
        
        if (result._id > 0) {
            return res.send({status:200});
        }
        return res.send({status:0});
    } catch (e) {
        console.error(e);
        return res.send({status:-1});
    }
});

// 물품목록
// 127.0.0.1:3000/item/select
router.get('/select', async function(req, res, next) {
    try {
        const query = {};
        const result = await Item.find(query).sort({"_id":-1});

        return res.json({status:200, result:result});
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }
});

// 대분류별 등록물품 개수
// 127.0.0.1:3000/item/groupcode1
router.get('/groupcode1', async function(req, res, next) {
    try {
        // const code1 = req.query.code;

        // aggregate: 배열의 형태
        // 가져온 연산을 다음 단계의 연산에 이용
        // 내부에 여러 옵션을 기능 구현 가능
        const result = await Item.aggregate([
            // {
            //     $match : {
            //         code1 : code1
            //     }
            // },
            {
                $project : {
                    code1: 1,
                    price: 1,
                    quantity: 1

                }
            },
            {
                $group : {
                    _id : '$code1', // 그룹 기준
                    count : {$sum : 1},
                    pricesum : {$sum : '$price'},
                    quantitytotal : {$sum : '$quantity'}
                }
            }
        ]).sort({"_id":1});

        return res.json({status:200, result:result});
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }
});

// 중분류별 등록물품 개수
// 127.0.0.1:3000/item/groupcode2
router.get('/groupcode2', async function(req, res, next) {
    try {
        // const code2 = req.query.code;
        const result = await Item.aggregate([
            // {
            //     $match : {
            //         code2 : code2
            //     }
            // },
            {
                $project : {
                    code2: 1,
                    price: 1,
                    quantity: 1

                }
            },
            {
                $group : {
                    _id : '$code2', // 그룹 기준
                    count : {$sum : 1},
                    pricesum : {$sum : '$price'},
                    quantitytotal : {$sum : '$quantity'}
                }
            }
        ]).sort({"_id":1});

        return res.json({status:200, result:result});
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }
});

// 소분류별 등록물품 개수
// 127.0.0.1:3000/item/groupcode3
router.get('/groupcode3', async function(req, res, next) {
    try {
        // const code3 = req.query.code;
        const result = await Item.aggregate([
            // {
            //     $match : {
            //         code3 : code3
            //     }
            // },
            {
                $project : {
                    code3: 1,
                    price: 1,
                    quantity: 1

                }
            },
            {
                $group : {
                    _id : '$code3', // 그룹 기준
                    count : {$sum : 1},
                    pricesum : {$sum : '$price'},
                    quantitytotal : {$sum : '$quantity'}
                }
            }
        ]).sort({"_id":1});

        return res.json({status:200, result:result});
    } catch (e) {
        console.error(e);
        return res.json({status:-1});
    }
});


module.exports = router;
