const express = require('express');
const router = express.Router();
const getRecordList = require('../model/index').getAllInfo;
const getDetail = require('../model/index').getDetail;
const url = require('url');

router.use(function(req, res, next){
    res.setHeader('Content-Type', 'application/json');
    next();
});


router.get('/list', function(req, res) {
    console.log('adm');
    res.end('adm');
});

router.get('/records/:users', function(req, res) {

    let users = req.params.users.split('+'),
        {
            from,
            to
        } = url.parse(req.url, true).query;

    if(users&&from&&to){
        getRecordList(users, from, to).then(function(list){
            res.send(list);
        });
    }
    else{
        res.end('error');
    }
    
});


router.get('/detail/:recordid', function(req, res) {

    let recordid = req.params.recordid;

    if(recordid){
        getDetail(recordid).then(function(detail){
            res.send(detail);
        });
    }
    else{
        res.end('error');
    }
    
});



module.exports = router;