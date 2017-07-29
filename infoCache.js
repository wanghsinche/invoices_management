let expire = 60;
let infoCache = {
    'sample-userid_from_to': {
        timer: setTimeout(function() {}, 0),
        expire: Date.now() + 1000 * 60, // 60 seconds
        data: [{
            recid: '',
            goodid: '',
            invoiceid: '',
            markid: '',
            goodinfo: {
                goodid: '',
                name: '',
                price: '',
                priceall: '',
                num: '',
                buyDate: ''
            },
            invsinfo: {
                invsid: '',
                code: '',
                price: '',
                date: ''
            },
            markinfo: {
                markid: '',
                content: '',
                link: ''
            }
        }]
    }
};

function getCache(userid_from_to) {
    let res = infoCache[userid_from_to];
    return Promise.resolve(res && res.data);
}

function setCache(userid_from_to, info) {
    var newtimer;
    if (infoCache.hasOwnProperty(userid_from_to)) {
        newtimer = createExpireTimer(userid_from_to, infoCache[userid_from_to].timer);
    } else {
        newtimer = createExpireTimer(userid_from_to);
    }
    infoCache[userid_from_to] = {
        timer: newtimer,
        expire: Date.now() + 1000 * expire,
        data: info
    };

}

function createExpireTimer(userid_from_to, oldTimer) {
    if (oldTimer) {
        clearTimeout(oldTimer);
    }
    return setTimeout(function() {
        console.log('delete ' + userid_from_to);
        delete infoCache[userid_from_to];
    }, 1000 * expire);
}

function setExpire(maxtime) {
    expire = maxtime;
}

module.exports.getCache = getCache;
module.exports.setCache = setCache;
module.exports.setExpire = setExpire;