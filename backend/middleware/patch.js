const sqlite3 = require('sqlite3').verbose();
let logdb = new sqlite3.Database(global.logDataBase);
module.exports.patchConsole_log=function(target){
  let next = target.log;
  target.log = function(){
    logdb.run('INSERT INTO console VALUES ($time, $log)',{
        $time: Date.now(),
        $log: Array.prototype.join.call(arguments,';')
    });
    next.apply(this, arguments);
  };
};