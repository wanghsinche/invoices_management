const router = require('express').Router();
const getRecordList = require('../model/index').getAllInfo;
const getDetail = require('../model/index').getDetail;
const url = require('url');


router.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true); //可以带cookies    
    res.setHeader('Content-Type', 'application/json');
    next();
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