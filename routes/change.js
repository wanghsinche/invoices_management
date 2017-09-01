const router = require('express').Router();
const newRecord = require('../model/index').insertDetail;
const updateRecord = require('../model/index').updateDetail;
const bodyParser = require('body-parser');
const escapeHTML = require('escape-html');
const sendMail = require('../utils/mail.js').init(global.linkRecv);

router.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// parse application/x-www-form-urlencoded 
router.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json 
router.use(bodyParser.json());

router.put('/newRecord', function(req, res) {

    // let {
    //     good,
    //     invs,
    //     mark,
    //     userid,
    // } = detail;
    let detail, {
            name,
            price,
            priceall,
            num,
            goodcode,
            buyDate,
            invscode,
            invsprice,
            invsdate,
            type,
            link,
            content,
            mailFlag,
        } = req.body,
        userid = req.extraInfo.userid;


    detail = {
        good: {
            code: escapeHTML(goodcode) || null,
            name: escapeHTML(name) || null,
            price: Number(price) || NaN,
            priceall: Number(priceall) || NaN,
            num: Number(num) || NaN,
            buyDate: Number(buyDate) || NaN
        },
        invs: {
            code: invscode || null,
            price: Number(invsprice) || NaN,
            date: Number(invsdate) || NaN,
            type: type || null
        },
        mark: {
            link: escapeHTML(link) || null,
            content: escapeHTML(content) || null
        },
        userid: userid
    };
    console.log(detail);
    if (!detail.good.code) {
        res.status(400).send({
            msg: '订单号填写错误'
        });
    } else if (!detail.good.name) {
        res.status(400).send({
            msg: '货物名称填写错误'
        });
    } else if (!detail.good.buyDate) {
        res.status(400).send({
            msg: '购买日期填写错误，请用日期选择框填写'
        });
    } else if (!detail.good.price) {
        res.status(400).send({
            msg: '单价填写错误，必须为数字'
        });
    } else if (!detail.good.priceall) {
        res.status(400).send({
            msg: '总价填写错误，必须为数字'
        });
    } else if (!detail.good.num) {
        res.status(400).send({
            msg: '货物数量必须为数字'
        });
    } else if (!detail.mark.link) {
        res.status(400).send({
            msg: '订单链接必填'
        });
    } else {
        newRecord(detail).then(function(msg) {
            if (mailFlag) {
                sendMail(name, '订单系统', link, content, 0);
            }
            res.send({
                code: 1,
                lastid: msg
            });
        }).catch(function(err) {
            if (err.code) {
                res.status(400).send(err);
            } else {
                res.status(500).send(err);
            }

        });
    }



});

router.post('/updateRecord/:recordid', function(req, res) {
    let detail,
        recordid = req.params.recordid,
        {
            price,
            priceall,
            num,
            invscode,
            invsprice,
            invsdate,
            type,
            link,
            content
        } = req.body,
        userid = req.extraInfo.userid;
    detail = {
        good: {
            price: Number(price) || NaN,
            priceall: Number(priceall) || NaN,
            num: Number(num) || NaN,
        },
        invs: {
            code: invscode || null,
            price: Number(invsprice) || NaN,
            date: Number(invsdate) || NaN,
            type: type || null
        },
        mark: {
            link: escapeHTML(link) || null,
            content: escapeHTML(content) || null
        },
        userid: userid,
        recordid: recordid
    };
    if (!recordid) {
        res.status(400).send('params error');
    } else {
        console.log(detail);
        if (!detail.good.price) {
            res.status(400).send({
                msg: '单价填写错误，必须为数字'
            });
        } else if (!detail.good.priceall) {
            res.status(400).send({
                msg: '总价填写错误，必须为数字'
            });
        } else if (!detail.good.num) {
            res.status(400).send({
                msg: '货物数量必须为数字'
            });
        } else if (!detail.mark.link) {
            res.status(400).send({
                msg: '订单链接必填'
            });
        } else {
            updateRecord(detail).then(function() {
                res.send({
                    code: 1,
                    msg: 'updateRecord success'
                });
            }).catch(function(err) {
                res.status(500).send(err);
            });
        }
    }

});

module.exports = router;