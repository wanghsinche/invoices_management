const sqlite3 = require('sqlite3').verbose();
const dburl = global.myDataBase;
let database = new sqlite3.Database(dburl);
let recordls = require('./recordls');
let detail = require('./detail');
let user = require('./user');
function closeDataBase(){
    database.close();
}



module.exports.getAllInfo = recordls.getAllInfo(database);
module.exports.getDetail = detail.getDetail(database);
module.exports.insertDetail = detail.insertDetail(database);
module.exports.updateDetail = detail.changeDetail(database);
module.exports.getPSWD = user.getPSWD(database);
module.exports.getAccess = user.getAccessls(database);
module.exports.getUserid = user.getUserid(database);
module.exports.createUser = user.createUser(database);
module.exports.changePassword = user.changePSWD(database);
module.exports.makeSuper = user.makeSuper(database);
module.exports.removeSuper = user.removeSuper(database);
module.exports.closeDataBase = closeDataBase;