const winston = require('winston');
const config = require('../utils/config').getConfig();
const path = require('path');

var logger = new(winston.Logger)({
    level: 'info',
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new(winston.transports.File)({
            maxsize: 1000000,
            filename: path.resolve(__dirname, '../', config.log),
            json: false,
            handleExceptions: true,
            humanReadableUnhandledException: true
        })
    ]
});

function reqLogMiddle(req, res, next){
    logger.info({ip: req.ip, path: req.path, Authorization:req.get('Authorization')});
    next();
}

module.exports.logger = logger;
module.exports.reqLogMiddle = reqLogMiddle;