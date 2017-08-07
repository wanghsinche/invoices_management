const router = require('express').Router();
const getRecordList = require('../model/index').getAllInfo;
const getDetail = require('../model/index').getDetail;
const url = require('url');
const CryptoJS = require('crypto-js');

function checkSuperUser(token, userid, nonce) {
    var trueToken = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256('supertoken', userid.toString(), nonce.toString()));
    return token === trueToken;
}

router.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});



router.get('/records/:users', function(req, res) {

    let users = req.params.users.split('+'),
        {
            from,
            to,
            page,
            accessToken,
        } = url.parse(req.url, true).query,
        {
            userid,
            nonce
        } = req.extraInfo;


    if (users && from && to) {
        console.log('1');
        if ((users.length > 1 || users[0] !== userid) && !checkSuperUser(accessToken, userid, nonce)) {
            console.log('2');
            res.send('No enough right');
        } else {
            console.log('3');
            getRecordList(users, from, to, page).then(function(list) {
                res.send(list);
            }).catch(function(err) {
                console.log(err);
            });
        }
    } else {
        res.end('error');
    }

});


router.get('/detail/:recordid', function(req, res) {

    let recordid = req.params.recordid;

    if (recordid) {
        getDetail(recordid).then(function(detail) {
            res.send(detail);
        });
    } else {
        res.end('error');
    }

});



module.exports = router;