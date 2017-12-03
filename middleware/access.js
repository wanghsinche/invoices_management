// relay on token middelware
const Crypto = require('crypto');
const url = require('url');

function checkSuperUser(token, userid, nonce) {
    var trueToken = Crypto.createHmac('sha256', 'supertoken').update([userid,nonce].join('')).digest('base64');
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
    global.logger.info(req.extraInfo);
    next();
};