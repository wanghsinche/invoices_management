const router = require('express').Router();
const getRecordList = require('../model/index').getAllInfo;
const getDetail = require('../model/index').getDetail;
const url = require('url');
const accessMiddelware = require('../middleware/access');


router.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// all query need to check access right
router.use(accessMiddelware);


router.get('/records/:users', function (req, res) {

    let users = req.params.users.split('+'),
        {
            from,
            to
        } = url.parse(req.url, true).query



    if (users && from && to) {
        if ((users.length > 1 || users[0] !== req.extraInfo.userid) && !req.extraInfo.superuser) {
            res.status(403).send('No enough right');
        } else {
            getRecordList(users, from, to).then(function (list) {
                res.send(list);
            }).catch(function (err) {
                console.log(err);
            });
        }
    } else {
        res.end('error');
    }

});


router.get('/detail/:recordid', function (req, res) {

    let recordid = req.params.recordid;

    if (recordid) {
        getDetail(recordid).then(function (detail) {
            if (detail.userid === req.extraInfo.userid || req.extraInfo.superuser) {
                res.send(detail);
            }
            else {
                res.status(403).send('no enough right');
            }

        }).catch(function(err){
            console.log(err);
            res.status(500).send(err);
        });
    } else {
        res.status(400).end('Bad request');
    }

});



module.exports = router;