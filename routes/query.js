const router = require('express').Router();
const getRecordList = require('../model/index').getAllInfo;
const getAllUsersList = require('../model/index').getAllUsersList;
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
        } = url.parse(req.url, true).query;



    if (users && from && to) {
        if ((users.length > 1 || users[0] != req.extraInfo.userid) && !req.extraInfo.superuser) {
            res.status(403).send({
                code:-3,
                msg:'need super user'
            });
        } else {
            getRecordList(users, from, to).then(function (list) {
                res.send({
                    code:1,
                    msg:'get records successfully',
                    data: list
                });
            }).catch(function (err) {
                res.status(500).send({
                    code:-1,
                    msg:'server error at query.js //records/:users',
                    data:err
                });
                console.log(err);
            });
        }
    } else {
        res.status(400).send({
            code: -4,
            msg: '请求格式错误'
        });
    }

});

router.get('/records', function (req, res) {

    let {
            from,
            to
        } = url.parse(req.url, true).query;



    if (from && to) {
        if (!req.extraInfo.superuser) {
            res.status(403).send({
                code:-3,
                msg:'need super user'
            });
        } else {
            getAllUsersList(from, to).then(function (list) {
                res.send({
                    code:1,
                    msg:'get records successfully',
                    data: list
                });
            }).catch(function (err) {
                res.status(500).send({
                    code:-1,
                    msg:'server error at query.js //records/',
                    data:err
                });
                console.log(err);
            });
        }
    } else {
        res.status(400).send({
            code: -4,
            msg: '请求格式错误'
        });
    }

});

router.get('/detail/:recordid', function (req, res) {

    let recordid = req.params.recordid;

    if (recordid) {
        getDetail(recordid).then(function (detail) {
            if (detail.userid === req.extraInfo.userid || req.extraInfo.superuser) {
                res.send({
                    code:1,
                    msg:'get detail successfully',
                    data: detail
                });
            }
            else {
                res.status(403).send({
                    code:-3,
                    msg:'need super user'
                });
            }

        }).catch(function(err){
            console.log(err);
            res.status(500).send({
                code:-1,
                msg:'server error at query.js detail/:recordid',
                data:err
            });
        });
    } else {
        res.status(400).send({
            code: -4,
            msg: '请求格式错误'
        });
    }

});



module.exports = router;