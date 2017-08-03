// const url = require('url');
const getPSWD = require('../model/index').getPSWD;
const sqlite3 = require('sqlite3').verbose();
let noncedb = new sqlite3.Database(global.nonceDataBase);

// 其实客户端传过来不就好了么。。。
// 反正只是防replay，我这里就不处理了
function generateNonce() {
    return Math.round(Math.random() * 1000000);
}

module.exports = function (req, res, next) {
    let cAuth = req.get('Authorization'),
        userid, token, reqnonce, reqtimes, reqstamp,
        nonce = generateNonce();
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
        reqnonce = cAuth.match(/nonce=(\d+)/);
        reqnonce = reqnonce && reqnonce[1];
        reqtimes = cAuth.match(/times=(\d+)/);
        reqtimes = reqtimes && reqtimes[1];
        reqstamp = cAuth.match(/stamp=(\d+)/);
        reqstamp = reqstamp && reqstamp[1];

        if (!(userid && token && reqnonce && reqtimes && reqstamp)) {
            res.set({
                'WWW-Authenticate': ['nonce=', nonce].join('')
            });
            res.status(401).send('Unauthorized');
        } else {
            console.log(userid, token, reqnonce, reqtimes, reqstamp);

            // check nonce database

            new Promise((resolve, reject) => {
                noncedb.get('SELECT lastnum FROM nonce WHERE stamp = ' + Number(reqstamp) + ' AND nonce = ' + Number(reqnonce), function (err, row) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log(row);
                        if (typeof row === 'undefined') {
                            // new nonce
                            // write into database
                            resolve();
                        }
                        else {
                            reject(403);
                        }
                    }
                });
            }).then(function () {
                // authorize
                return getPSWD(parseInt(userid, 10)).then(function (usrpswd) {
                    var sToken = userid + '' + usrpswd + reqnonce + reqstamp;
                    console.log('token should be ',sToken);
                    if (sToken !== token) {
                        return Promise.reject(401);
                    } else {
                        next();
                    }
                })
            }).catch(function (err) {
                console.log(err);
                if (err === 403) {
                    res.status(403).send('Unauthorized');
                }
                else {
                    res.set({
                        'WWW-Authenticate': ['nonce=', nonce].join('')
                    });
                    res.status(401).send('Unauthorized');
                }

            });

        }
    }

};