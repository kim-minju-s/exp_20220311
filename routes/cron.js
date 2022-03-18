
// 스케줄러

var express = require('express');
var router = express.Router();

// 스케줄러 모듈
// npm i node-cron --save
var cron = require('node-cron');

// DB연동 모델
var Book1 = require('../models/book1');

// 10초 단위로 실행
cron.schedule('*/10 * * * * *', async()=> {
    console.log('aaa');

    // 10초 간격으로 자료저장, 자료이동
    var book1 = new Book1();
    book1.title = "aaa";
    await book1.save();


})

module.exports = router;
