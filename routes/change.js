const router = require('express').Router();
const newRecord = require('../model/index').insertDetail;
const updateRecord = require('../model/index').updateDetail;
const bodyParser = require('body-parser');
const escapeHTML = require('escape-html');


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
            link,
            content
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
            date: Number(invsdate) || NaN
        },
        mark: {
            link: escapeHTML(link) || null,
            content: escapeHTML(content) || null
        },
        userid: userid
    };
    newRecord(detail).then(function(msg) {
        res.send({
            lastid: msg
        });
    }).catch(function(err) {
        res.status(500).send(err);
    });


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
            date: Number(invsdate) || NaN
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
        updateRecord(detail).then(function() {
            res.send({
                msg: 'updateRecord success'
            });
        }).catch(function(err) {
            res.status(500).send(err);
        });
    }

});

module.exports = router;