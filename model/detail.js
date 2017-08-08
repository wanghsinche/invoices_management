// select records from database
// by time and user



function getDetail(database) {
    return (recordid) => {
        console.log('read data base');
        var bigPromise = new Promise((resolve, reject) => {
            database.get('SELECT rowid as recid, goodid, userid, invoiceid , markid, date FROM records WHERE rowid = ' + recordid, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        }).then(result => {
            let goodP, invsP, recordP, userP, markP;
            console.log(result);
            userP = new Promise((resolve, reject) => {
                database.get('SELECT name as username FROM users WHERE rowid = ' + result.userid, function(err, row) {
                    if (err) {
                        reject('usr', err);
                    } else {
                        resolve(row);
                    }
                });
            });

            goodP = new Promise((resolve, reject) => {
                database.get('SELECT name, num, price, priceall, buyDate FROM goods WHERE rowid = ' + result.goodid, function(err, row) {
                    if (err) {
                        reject('goodP', err);
                    } else {
                        resolve(row);
                    }
                });
            });

            invsP = new Promise((resolve, reject) => {
                database.get('SELECT price as invoicePrice, code, date as invoiceDate FROM invoices WHERE rowid = ' + result.invoiceid, function(err, row) {
                    if (err) {
                        reject('invsP', err);
                    } else {
                        resolve(row);
                    }
                });
            });

            markP = new Promise((resolve, reject) => {
                database.get('SELECT content, link FROM marks WHERE rowid = ' + result.markid, function(err, row) {
                    if (err) {
                        reject('markP', err);
                    } else {
                        resolve(row);
                    }
                });
            });

            recordP = Promise.resolve(result);

            return Promise.all([recordP, goodP, invsP, userP, markP]);
        }).then(([record, good, invs, user, mark]) => {

            // attention recordls has been change since element is object
            return Promise.resolve(
                Object.assign({}, record, good, invs, user, mark)
            );
        });
        return bigPromise;
    };
}

function insertDetail(database) {
    //全部插入
    // 先 good, invs, mark
    // 再record
    return (detail) => {
        console.log('insert detail to data base');
        var goodP, invsP, markP, {
            good,
            invs,
            mark,
            userid,
        } = detail;
        goodP = new Promise(function(resolve, reject) {
            database.run('INSERT INTO goods (name, price, priceall, num, buyDate) VALUES ($name, $price, $priceall, $num, $buyDate)', {
                $name: good.name,
                $price: good.price,
                $priceall: good.priceall,
                $num: good.num,
                $buyDate: good.buyDate
            }, function(err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('insert rowid is ' + this.lastID);
                    resolve(this.lastID);
                }
            });
        });
        invsP = new Promise(function(resolve, reject) {
            database.run('INSERT INTO invoices (code, price, date) VALUES ($code, $price, $date)', {
                $code: invs.code,
                $price: invs.price,
                $date: invs.date
            }, function(err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('insert rowid is ' + this.lastID);
                    resolve(this.lastID);
                }
            });
        });
        markP = new Promise(function(resolve, reject) {
            database.run('INSERT INTO marks (link, content) VALUES ($link, $content)', {
                $link: mark.link,
                $content: mark.content
            }, function(err) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('insert rowid is ' + this.lastID);
                    resolve(this.lastID);
                }
            });
        });

        return Promise.all([goodP, invsP, markP]).then(([goodid, invsid, markid]) => new Promise(function(resolve, reject) {
            database.run('INSERT INTO records (goodid, userid, invoiceid, markid, date) VALUES ($goodid, $userid, $invoiceid, $markid, $date)', {
                $goodid: goodid,
                $userid: userid,
                $invoiceid: invsid,
                $markid: markid,
                $date: Date.now()
            }, function(err){
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('insert rowid is ' + this.lastID);
                    resolve(this.lastID);
                }
            });
        }));


    };
}

module.exports.getDetail = getDetail;
module.exports.insertDetail = insertDetail;