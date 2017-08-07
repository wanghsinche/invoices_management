const router = require('express').Router();
const getIdentity = require('../model/index').getAccess;

router.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});


router.get('/getidentity', function(req, res) {
        // 能到这里的前面的验证肯定都通过了
        getIdentity(req.extraInfo.userid, req.extraInfo.nonce).then(function(msg){
            res.send(msg);
        }).catch(function(err){
            res.status(500).send(err);
        });


});


module.exports = router;