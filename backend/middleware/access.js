// relay on token middelware
const CryptoJS = require('crypto-js');
const url = require('url');

function checkSuperUser(token, userid, nonce) {
    var trueToken = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256('supertoken', userid.toString(), nonce.toString()));
    return token === trueToken;
}

module.exports = function (req, res, next) {
    let {
            accessToken
        } = url.parse(req.url, true).query,
        {
            userid,
            nonce
        } = req.extraInfo;
    
    req.extraInfo.superuser = checkSuperUser(accessToken, userid, nonce);
    console.log(req.extraInfo);
    next();
};