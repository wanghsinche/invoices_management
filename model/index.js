const sqlite3 = require('sqlite3').verbose();
const dburl = global.myDataBase;
let database = new sqlite3.Database(dburl);
let recordls = require('./recordls');
let detail = require('./detail');

function closeDataBase(){
    database.close();
}



module.exports.getAllInfo = recordls.getAllInfo(database);
module.exports.getDetail = detail.getDetail(database);
module.exports.closeDataBase = closeDataBase;