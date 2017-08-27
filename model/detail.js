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
                database.get('SELECT code as goodcode, name, num, price, priceall, buyDate FROM goods WHERE rowid = ' + result.goodid, function(err, row) {
                    if (err) {
                        reject('goodP', err);
                    } else {
                        resolve(row);
                    }
                });
            });

            invsP = new Promise((resolve, reject) => {
                database.get('SELECT price as invoicePrice, code, date as invoiceDate, type FROM invoices WHERE rowid = ' + result.invoiceid, function(err, row) {
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
        let goodP, invsP, markP, {
            good,
            invs,
            mark,
            userid,
        } = detail;
        return new Promise(function(resolve, reject){
            database.get('SELECT rowid FROM goods WHERE code = $code',{
                $code: good.code
            }, function(err, row){
                if(err){
                    reject(err);
                }
                else{
                    if(row){
                        reject({code:-1,msg:'订单号已经存在,不要重复提交'});
                    }
                    else{
                        resolve();
                    }
                }
            });
        })
        .then(function(){
            goodP = new Promise(function(resolve, reject) {
                database.run('INSERT INTO goods (name, price, priceall, num, buyDate, code) VALUES ($name, $price, $priceall, $num, $buyDate, $code)', {
                    $name: good.name,
                    $price: good.price,
                    $priceall: good.priceall,
                    $num: good.num,
                    $buyDate: good.buyDate,
                    $code: good.code
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
                database.run('INSERT INTO invoices (code, price, date, type) VALUES ($code, $price, $date, $type)', {
                    $code: invs.code,
                    $price: invs.price,
                    $date: invs.date,
                    $type: invs.type
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
                }, function(err) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log('insert rowid is ' + this.lastID);
                        resolve(this.lastID);
                    }
                });
            }));
        });
        

        


    };
}

function changeDetail(database) {
    //全部插入
    // 先 good, invs, mark
    // 再record
    return (detail) => {
        console.log('change detail to data base');
        let goodP, invsP, markP, {
            recordid,
            good,
            invs,
            mark,
            userid,
        } = detail;

        let bigPromise = new Promise(function(resolve, reject) {
            database.get('SELECT goodid, invoiceid, markid, userid FROM records WHERE rowid = $rowid', {$rowid:recordid}, function(err, row) {
                if (err) {
                    reject(err);
                } else {
                    if (row) {
                        resolve(row);
                    } else {
                        reject('no found');
                    }
                }
            });
        }).then(function(recordinfo) {
            if (recordinfo.userid !== userid) {
                return Promise.reject('forbid to change other user');
            } else {

                goodP = new Promise(function(resolve, reject) {
                    var columns = Object.keys(good),
                        values = [], param = {};

                    columns.forEach(function(k) {
                        if (typeof good[k] !== 'undefined') {
                            values.push(k.concat('=$', k));
                            param['$'+k] = good[k];
                        }
                    });



                    database.run('UPDATE goods SET ' + values.join(',') + ' WHERE rowid = ' + recordinfo.goodid, param, function(err) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(recordinfo.goodid);
                        }
                    });
                });
                invsP = new Promise(function(resolve, reject) {
                    var columns = Object.keys(invs),
                        values = [], param = {};

                    columns.forEach(function(k) {
                        if (typeof invs[k] !== 'undefined') {
                            values.push(k.concat('=$', k));
                            param['$'+k] = invs[k];
                        }
                    });


                    database.run('UPDATE invoices SET ' + values.join(',') + ' WHERE rowid = ' + recordinfo.invoiceid, param, function(err) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(recordinfo.invoiceid);
                        }
                    });
                });
                markP = new Promise(function(resolve, reject) {
                    var columns = Object.keys(mark),
                        values = [], param = {};

                    columns.forEach(function(k) {
                        if (typeof mark[k] !== 'undefined') {
                            values.push(k.concat('=$', k));
                            param['$'+k] = mark[k];
                        }
                    });


                    database.run('UPDATE marks SET ' + values.join(',') + ' WHERE rowid = ' + recordinfo.markid, param, function(err) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve(recordinfo.markid);
                        }
                    });
                });
                return Promise.all([goodP, invsP, markP]);
            }
        });

        return bigPromise;


    };
}


module.exports.getDetail = getDetail;
module.exports.insertDetail = insertDetail;
module.exports.changeDetail = changeDetail;