const getPSWD = require('../model/index').getPSWD;
const CryptoJS = require('crypto-js');
const sqlite3 = require('sqlite3').verbose();
let noncedb = new sqlite3.Database(global.nonceDataBase);

// 其实客户端传过来不就好了么。。。
// 反正只是防replay，我这里就不处理了



function generateNonce() {
    let nonce = Math.floor(Math.random() * (10000-1000)+1000);
    return nonce;
}

function simpleCheckNonce(nonce){
    return /\d{4}/.test(nonce);
}

// every 60 minutes
(function clearNoncedb(period) {
    let expire = Date.now() - period;
    console.log('clearNoncedb');
    noncedb.run('DELETE FROM nonce WHERE stamp <= $stamp', {
        $stamp: expire
    });

    setTimeout(clearNoncedb, period, period);

})(1000 * 60*60);

function checkToken(usercode, usrpswd, reqnonce, reqtimes, reqstamp, token) {
    console.log(usercode, usrpswd, reqnonce, reqtimes, reqstamp, token);
    let hash = CryptoJS.HmacSHA256(usercode, usrpswd, reqnonce, reqtimes, reqstamp);
    let hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    console.log(hashInBase64);
    console.log(token, token === hashInBase64);
    console.log(usercode, usrpswd, reqnonce, reqtimes, reqstamp, token);
    return token === hashInBase64;
}


module.exports = function(req, res, next) {
    let cAuth = req.get('Authorization'),
        usercode, token, reqnonce, reqtimes, reqstamp,
        nonce = generateNonce();
    if (!cAuth) {
        res.set({
            'WWW-Authenticate': ['nonce=', nonce].join('')
        });
        res.status(200).send({
            msg:'Pleace login',
            data:{
                nonce:nonce
            }
        });
    } else {
        usercode = cAuth.match(/usercode=(\d+)/);
        usercode = usercode && usercode[1];
        token = cAuth.match(/token=([\w+/=]+)/);
        token = token && token[1].toString();
        reqnonce = cAuth.match(/nonce=(\d+)/);
        reqnonce = reqnonce && reqnonce[1];
        reqtimes = cAuth.match(/times=(\d+)/);
        reqtimes = reqtimes && reqtimes[1];
        reqstamp = cAuth.match(/stamp=(\d+)/);
        reqstamp = reqstamp && reqstamp[1];

        if (!(usercode && token && reqnonce && reqtimes && reqstamp && simpleCheckNonce(Number(reqnonce)))) {
            res.status(401).send('Some headers were missed');
        } else {
            console.log(usercode, token, reqnonce, reqtimes, reqstamp);

            // check nonce database

            new Promise((resolve, reject) => {

                    if (isNaN(Number(reqstamp)) || isNaN(Number(reqnonce)) || isNaN(Number(reqtimes))) {
                        reject(403);
                    } else {
                        noncedb.get('SELECT rowid, lastnum FROM nonce WHERE nonce = $nonce', {
                            $nonce: Number(reqnonce)
                        }, function(err, row) {
                            if (err) {
                                reject(err);
                            } else {
                                if (typeof row === 'undefined') {
                                    // new nonce
                                    // write into nonce database
                                    console.log('new nonce, write into nonce database');
                                    noncedb.run('INSERT INTO nonce VALUES ($stamp, $nonce, $lastum)', {
                                        $stamp: reqstamp,
                                        $nonce: reqnonce,
                                        $lastum: reqtimes
                                    });
                                    resolve();
                                } else if (row.lastnum > -1 && row.lastnum < Number(reqtimes) && Number(reqtimes) <= row.lastnum + 9) {
                                    // old nonce, new time
                                    // update
                                    console.log('old nonce, new time, update');
                                    console.log(row.lastnum , Number(reqtimes));
                                    noncedb.run('Update nonce SET stamp = $stamp, lastnum = $lastum WHERE rowid = $rowid', {
                                        $stamp: reqstamp,
                                        $lastum: reqtimes,
                                        $rowid: row.rowid
                                    });
                                    resolve();
                                } else {
                                    // old nonce, bad time, abandon nonce
                                    console.log('old nonce, bad time, abandon nonce');
                                    noncedb.run('Update nonce SET lastnum = -1 WHERE rowid = $rowid', {
                                        $rowid: row.rowid
                                    });
                                    reject(403);
                                }
                            }
                        });
                    }
                }).then(function() {
                    // authorize
                    return getPSWD(usercode.toString());
                }).then(function({userid,usrpswd}) {
                if (checkToken(usercode, usrpswd, reqnonce, reqtimes, reqstamp, token)) {
                        req.extraInfo = {userid: userid, nonce: reqnonce };
                        return Promise.resolve();
                    } else {
                        return Promise.reject(403);
                    }
                }).then(function() {
                    // give userid
                    next();
                })
                .catch(function(err) {
                    console.log(err);
                    if (err === 403) {
                        res.status(403).send('Forbidern');
                    } else {
                        res.status(401).send('Unauthorized');
                    }

                });

        }
    }

};