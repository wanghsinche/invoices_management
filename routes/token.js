const router = require('express').Router();


router.use(function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
});


router.get('/getToken', function(req, res) {
    console.log('getToken');
     res.send({ csrfToken: 'dhdfghddfgh' });
});


module.exports = router;