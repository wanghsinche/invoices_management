const router = require('express').Router();
const newRecord = require('../model/index').insertDetail;
const bodyParser = require('body-parser');


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
            name: name||null,
            price: Number(price)||NaN,
            priceall: Number(priceall)||NaN,
            num: Number(num)||NaN,
            buyDate: Number(buyDate)||NaN
        },
        invs: {
            code: invscode||null,
            price: Number(invsprice)||NaN,
            date: Number(invsdate)||NaN
        },
        mark: {
            link: link||null,
            content: content||null
        },
        userid: userid
    };
    newRecord(detail).then(function(msg) {
        res.send({lastid:msg});
    }).catch(function(err) {
        res.status(500).send(err);
    });


});


module.exports = router;