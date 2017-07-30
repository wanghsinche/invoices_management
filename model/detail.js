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
                        reject('usr',err);
                    } else {
                        resolve(row);
                    }
                });
            });

            goodP = new Promise((resolve, reject) => {
                database.get('SELECT name, num, price, priceall, buyDate FROM goods WHERE rowid = ' + result.goodid, function(err, row) {
                    if (err) {
                        reject('goodP',err);
                    } else {
                        resolve(row);
                    }
                });
            });

            invsP = new Promise((resolve, reject) => {
                database.get('SELECT price as invoicePrice, code, date as invoiceDate FROM invoices WHERE rowid = ' + result.invoiceid, function(err, row) {
                    if (err) {
                        reject('invsP',err);
                    } else {
                        resolve(row);
                    }
                });
            });

            markP = new Promise((resolve, reject) => {
                database.get('SELECT content, link FROM marks WHERE rowid = ' + result.markid, function(err, row) {
                    if (err) {
                        reject('markP',err);
                    } else {
                        resolve(row);
                    }
                });
            });

            recordP = Promise.resolve(result);

            return Promise.all([recordP, goodP, invsP, userP, markP]);
        }).catch(err => {
            console.log(err);
        }).then(([record, good, invs, user, mark]) => {

            // attention recordls has been change since element is object
            return Promise.resolve(
                Object.assign({}, record, good, invs, user, mark)
            );
        });
        return bigPromise;
    };
}



module.exports.getDetail = getDetail;