const sqlite3 = require('sqlite3').verbose();
const dburl = './import/real.db';
let database = new sqlite3.Database(dburl);
var csv = require('node-csv').createParser();


csv.parseFile('./import/record.csv', function(err, data) {
    // console.log(data);
    data.shift();
    insertAll(data);



});


let peoplels = {
'黎鑫':1,
'周强':2,
'赵江宏':3,
'王鑫哲':4,
'冯伟亚':5,
'邹成业':6,
'施凯戈':7,
'楼君':8,
'韩婷':9,
'李硕':10,
'韩婷':11,
'胡健力':12,
'朱凌峰':13,
'吴威涛':14,
'李军汲':15,
'陈宁宁':16,
'程渭钧':17,
'钟志航':18,
'王靖':19,
'吴致远':20,
'陈德渊':21,
'朱睿豪':22
};




function insertAll(data){
database.serialize(() => {

    let stmt = database.prepare('INSERT INTO records (goodid, userid, invoiceid, markid, date) VALUES (?, ?, ?, ? ,?)');
    data.forEach((row, index)=>{
            console.log(index+1, peoplels[row[4]], index+1, index+1, (new Date(row[0])).getTime());
            stmt.run(index+1, peoplels[row[4]]||23, index+1, index+1, (new Date(row[0])).getTime());
        });
    stmt.finalize();
});
database.close();
}
