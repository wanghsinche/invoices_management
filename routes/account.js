const router = require('express').Router();
const getIdentity = require('../model/index').getAccess;
const createUser = require('../model/index').createUser;
const changePSWD = require('../model/index').changePassword;
const makeSuper = require('../model/index').makeSuper;
const removeSuper = require('../model/index').removeSuper;
const accessMiddelware = require('../middleware/access');
const bodyParser = require('body-parser');
const escapeHTML = require('escape-html');
const CryptoJS = require('crypto-js');

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
        getIdentity(req.extraInfo.userid, req.extraInfo.nonce).then(function(msg){
            res.send(msg);
        }).catch(function(err){
            res.status(500).send(err);
        });


});


router.put('/create', accessMiddelware,function (req, res) {
    // only superuser can create user
    // can not prevent somebody sniff password
    let {
        usercode, username
    } = req.body,
    ran = Math.round(Math.random()*10),
    password = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256('pswd', ran.toString())).substring(ran, ran+6);
    if(req.extraInfo.superuser){
        createUser(usercode, escapeHTML(username), password).then(function(id){
        res.send({userid:id, pswd:password});
    })
    .catch(function(err){
        res.status(500).send('create failed');
        console.log(err);
    });
    }
    else{
        res.status(403).send('not a superuser');
    }
    

});

router.post('/changePSWD',function (req, res) {
    // can not prevent somebody sniff password
    let {
        password
    } = req.body,
    userid = req.extraInfo.userid;
    changePSWD(userid, password).then(function(){
        res.send({msg:'success change'});
    })
    .catch(function(err){
        res.status(500).send('change failed');
        console.log(err);
    });

});

router.post('/makeSuper/:userid', accessMiddelware,function (req, res) {
    // only superuser can create super
    let userid = req.params.userid;
    if(req.extraInfo.superuser){
        makeSuper(userid).then(function(){
        res.send({msg:'success'});
    })
    .catch(function(err){
        res.status(500).send('make super failed');
        console.log(err);
    });
    }
    else{
        res.status(403).send('not a superuser');
    }
    

});

router.delete('/removeSuper/:userid', accessMiddelware,function (req, res) {
    // only superuser can create super
    let userid = req.params.userid;
    if(req.extraInfo.superuser){
        removeSuper(userid).then(function(){
        res.send({msg:'success'});
    })
    .catch(function(err){
        res.status(500).send('remove super failed');
        console.log(err);
    });
    }
    else{
        res.status(403).send('not a superuser');
    }
    

});


module.exports = router;