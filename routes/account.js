const router = require('express').Router();
const getIdentity = require('../model/index').getAccess;
const createUser = require('../model/index').createUser;
const changePSWD = require('../model/index').changePassword;
const getUseridByCodeAndName = require('../model/index').getUseridByCodeAndName;
const makeSuper = require('../model/index').makeSuper;
const removeSuper = require('../model/index').removeSuper;
const accessMiddelware = require('../middleware/access');
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

router.get('/getidentity', function(req, res) {
        // 能到这里的前面的验证肯定都通过了
        getIdentity(req.extraInfo.userid, req.extraInfo.nonce).then(function(data){
            res.send({
                code:1,
                msg:'get info success',
                data:data
            });
        }).catch(function(err){
            res.status(500).send({
                code:-1,
                msg:'get info error',
                data:err
            });
        });


});


router.put('/create', accessMiddelware,function (req, res) {
    // only superuser can create user
    // can not prevent somebody sniff password
    let {
        usercode, username, emailAddress
    } = req.body,
    ran = Math.floor(Math.random()*1000000+100000),
    password = String(ran);
    if(req.extraInfo.superuser){
        createUser(usercode, escapeHTML(username), password).then(function(id){
            sendMail('订单系统密码',usercode,emailAddress,password,1);
            res.send({
                code:1,
                msg:'create user successfully',
                data: {userid:id}
            });
        })
        .catch(function(err){
            res.status(500).send({
                code:-1,
                msg:'server error at account.js /create',
                data:err
            });
            console.log(err);
        });
    }
    else{
        res.status(403).send({
            code:-3,
            msg:'need super user'
        });
    }
    

});

router.post('/resetPSWD', accessMiddelware,function (req, res) {
    let {
        usercode, username, emailAddress
    } = req.body,
    ran = Math.floor(Math.random()*1000000+100000),
    password = String(ran),
    userid;
    if(req.extraInfo.superuser){
        getUseridByCodeAndName(usercode, username)
        .then(function(id){
            userid = id;
            return changePSWD(userid, password);
        })
        .then(function(){
            sendMail('重置订单系统密码',usercode,emailAddress,password,1);
            res.send({
                code:1,
                msg:'change password successfully',
                data: {userid:userid}
            });
        })
        .catch(function(err){
            res.status(500).send({
                code:-1,
                msg:'server error at account.js /resetPSWD',
                data:err
            });
            console.log(err);
        });
    }
    else{
        res.status(403).send({
            code:-3,
            msg:'need super user'
        });
    }
});

router.post('/changePSWD',function (req, res) {
    // can not prevent somebody sniff password
    let {
        password
    } = req.body,
    userid = req.extraInfo.userid;
    changePSWD(userid, password)
    .then(function(){
        res.send({
                code:1,
                msg:'change password successfully',
                data: {userid:userid}
            });
    })
    .catch(function(err){
        res.status(500).send({
            code:-1,
            msg:'server error at account.js /changePSWD',
            data:err
        });
        console.log(err);
    });

});

router.post('/makeSuper/:userid', accessMiddelware,function (req, res) {
    // only superuser can create super
    let userid = req.params.userid;
    if(req.extraInfo.superuser){
        makeSuper(userid).then(function(){
        res.send({
            code:1,
            msg:'makeSuper successfully',
            data: {userid:userid}
        });
    })
    .catch(function(err){
        res.status(500).send({
            code:-1,
            msg:'server error at account.js /makeSuper',
            data:err
        });
        console.log(err);
    });
    }
    else{
        res.status(403).send({
            code:-3,
            msg:'need super user'
        });
    }
    

});

router.delete('/removeSuper/:userid', accessMiddelware,function (req, res) {
    // only superuser can create super
    let userid = req.params.userid;
    if(req.extraInfo.superuser){
        removeSuper(userid).then(function(){
        res.send({
            code:1,
            msg:'removeSuper successfully',
            data: {userid:userid}
        });
    })
    .catch(function(err){
        res.status(500).send({
            code:-1,
            msg:'server error at account.js /removeSuper',
            data:err
        });
        console.log(err);
    });
    }
    else{
        res.status(403).send({
            code:-3,
            msg:'need super user'
        });
    }
    

});


module.exports = router;