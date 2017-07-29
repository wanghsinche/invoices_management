const sqlite3 = require('sqlite3').verbose();
const dburl = global.myDataBase;
let database = new sqlite3.Database(dburl);
// select records from database
// by time and user

function array2Map(array, map, key) {
    array.forEach(v => {
        map[key + v[key]] = v;
    });
}


function getAllInfo(user, from, to){
    console.log('read data base');
    var bigPromise = new Promise((resolve, reject) => {
        database.all('SELECT rowid as recid, goodid, invoiceid, markid FROM records WHERE userid = '+user+' AND date <' + to +' AND date >=' + from, (err, rows) => {
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

        let goodP, invsP, markP, recordP;

        goodP = new Promise((resolve, reject) => {
            database.all('SELECT rowid as goodid, name, price, priceall, num, buyDate FROM goods WHERE rowid in (' + goodcon + ')', function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        invsP = new Promise((resolve, reject) => {
            database.all('SELECT rowid as invsid, code, price, date FROM invoices WHERE rowid in (' + invscon + ')', function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        markP = new Promise((resolve, reject) => {
            database.all('SELECT rowid as markid, content, link FROM marks WHERE rowid in (' + markcon + ')', function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        recordP = Promise.resolve(result);

        return Promise.all([recordP, goodP, invsP, markP]);
    }).catch(err => {
        console.log(err);
    }).then(([recordls, goodls, invsls, markls]) => {
        //list to map
        var goodmap = {},
            invsmap = {},
            markmap = {};
        array2Map(goodls, goodmap, 'goodid');
        array2Map(invsls, invsmap, 'invsid');
        array2Map(markls, markmap, 'markid');

        // attention recordls has been change since element is object
        return Promise.resolve(
            recordls.map(v => {
                return Object.assign(v, {
                    goodinfo: goodmap['goodid' + v.goodid],
                    invsinfo: invsmap['invsid' + v.invoiceid],
                    markinfo: markmap['markid' + v.markid],
                });
            })
        );
    });

    
    return bigPromise;
}


function closeDataBase(){
    database.close();
}

module.exports.getAllInfo = getAllInfo;
module.exports.closeDataBase = closeDataBase;