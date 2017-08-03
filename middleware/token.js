// const url = require('url');
const getPSWD = require('../model/index').getPSWD;
let nonce = 6;

module.exports = function(req, res, next) {
    let cAuth = req.get('Authorization'),
        userid, token;
    if (!cAuth) {
        res.set({
            'WWW-Authenticate': ['nonce=', nonce].join('')
        });
        res.status(401).send('Unauthorized');
    } else {
        userid = cAuth.match(/userid=(\d+)/);
        userid = userid && userid[1];
        token = cAuth.match(/token=([\w\.\-\~\_\%]+)/);
        token = token && token[1].toString();
        if (!(userid && token)) {
            res.set({
                'WWW-Authenticate': ['nonce=', nonce].join('')
            });
            res.status(401).send('Unauthorized');
        } else {
            console.log(userid, token);
            getPSWD(parseInt(userid, 10)).then(function(usrpswd) {
                var sToken = userid + '' + usrpswd;
                if (sToken !== token) {
                    res.set({
                        'WWW-Authenticate': ['nonce=', nonce].join('')
                    });
                    res.status(401).send('Unauthorized');
                } else {
                    next();
                }

            }).catch(function(err) {
                console.log(err);
                res.set({
                    'WWW-Authenticate': ['nonce=', nonce].join('')
                });
                res.status(401).send('Unauthorized');
            });

        }
    }

};