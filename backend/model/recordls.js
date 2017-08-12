// select records from database
// by time and user

function array2Map(array, map, key) {
    array.forEach(v => {
        map[key + v[key]] = v;
    });
}


function getAllInfo(database) {
    return (users, from, to) => {
        console.log('read data base');
        var bigPromise = new Promise((resolve, reject) => {
            database.all('SELECT rowid as recid, goodid, userid, invoiceid, markid, date FROM records WHERE userid in (' + users.join(',') + ') AND date <' + to + ' AND date >=' + from,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
        }).then(result => {
            let goodcon = result.map(v => v.goodid).join(','),
                invscon = result.map(v => v.invoiceid).join(',');

            let goodP, invsP, recordP, userP;

            userP = new Promise((resolve, reject) => {
                database.all('SELECT rowid as userid, name FROM users WHERE rowid in (' + users.join(',') + ')', function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
            goodP = new Promise((resolve, reject) => {
                database.all('SELECT rowid as goodid, name FROM goods WHERE rowid in (' + goodcon + ')', function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
            invsP = new Promise((resolve, reject) => {
                database.all('SELECT rowid as invsid, code FROM invoices WHERE rowid in (' + invscon + ')', function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });


            recordP = Promise.resolve(result);

            return Promise.all([recordP, goodP, invsP, userP]);
        }).then(([recordls, goodls, invsls, userP]) => {
            //list to map
            var goodmap = {},
                invsmap = {},
                usermap = {};
            array2Map(goodls, goodmap, 'goodid');
            array2Map(invsls, invsmap, 'invsid');
            array2Map(userP, usermap, 'userid');

            // attention recordls has been change since element is object
            return Promise.resolve(
                recordls.map(v => {
                    return Object.assign({}, v, {
                        name: goodmap['goodid' + v.goodid].name,
                        code: invsmap['invsid' + v.invoiceid].code,
                        user: usermap['userid' + v.userid].name
                    });
                })
            );
        });
        return bigPromise;
    };
}

function getAllDetail(database) {
    return (users, from, to) => {
        console.log('read data base');
        var bigPromise = new Promise((resolve, reject) => {
            database.all('SELECT rowid as recid, goodid, userid, invoiceid, markid, date FROM records WHERE userid in (' + users.join(',') + ') AND date <' + to + ' AND date >=' + from,
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
        }).then(result => {
            let goodcon = result.map(v => v.goodid).join(','),
                invscon = result.map(v => v.invoiceid).join(','),
                markcon = result.map(v => v.markid).join(',');
            let goodP, invsP, recordP, userP, markP;

            userP = new Promise((resolve, reject) => {
                database.all('SELECT rowid as userid, code, name FROM users WHERE rowid in (' + users.join(',') + ')', function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
            goodP = new Promise((resolve, reject) => {
                database.all('SELECT rowid as goodid, name, price, priceall, num, buyDate, code FROM goods WHERE rowid in (' + goodcon + ')', function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
            invsP = new Promise((resolve, reject) => {
                database.all('SELECT rowid as invsid, code, price, date, type FROM invoices WHERE rowid in (' + invscon + ')', function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
            markP = new Promise((resolve, reject) => {
                database.all('SELECT rowid as markid, link, content FROM marks WHERE rowid in (' + markcon + ')', function(err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            recordP = Promise.resolve(result);

            return Promise.all([recordP, goodP, invsP, userP, markP]);
        }).then(([recordls, goodls, invsls, userP, markP]) => {
            //list to map
            var goodmap = {},
                invsmap = {},
                markmap = {},
                usermap = {};
            array2Map(goodls, goodmap, 'goodid');
            array2Map(invsls, invsmap, 'invsid');
            array2Map(userP, usermap, 'userid');
            array2Map(markP, markmap, 'markid');
            // attention recordls has been change since element is object
            return Promise.resolve(
                recordls.map(v => {
                    return Object.assign({}, v, {
                        good: goodmap['goodid' + v.goodid],
                        invs: invsmap['invsid' + v.invoiceid],
                        user: usermap['userid' + v.userid],
                        mark: markmap['markid' + v.markid]
                    });
                })
            );
        });
        return bigPromise;
    };
}



module.exports.getAllInfo = getAllInfo;
module.exports.getAllDetail = getAllDetail;