const sqlite3 = require('sqlite3');
const dburl = './database/real.db';
let database = new sqlite3.Database(dburl);
let csv = require('node-csv').createParser();
let fs = require('fs');
fs.writeFile('D:/mine/expressServer/public/static/1_2_3_0_1417968000000_1081191.csv','sdf');

// csv.parseFile('./import/record.csv', function(err, data) {
//     // console.log(data);
//     data.shift();
//     insertAll(data);



// });


let peoplels = {
'黎鑫':1,
'周强':2,
'赵江宏':3,
'王鑫哲':4,
'冯伟亚':5,
'邹成业':6,
'施凯戈':7,
'楼君':8,
'duplicated':9,
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

    let stmt = database.prepare('UPDATE marks SET content = $content WHERE rowid = $rowid');
    data.forEach((row, index)=>{
            stmt.run(row[7]+row[8], index+1);
        });
    stmt.finalize();
});
database.close();
}
