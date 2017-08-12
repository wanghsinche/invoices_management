let loremIpsum = '生身師……事車阿，出臺投鄉其設；城女細上地：關交先能手指決業外他同遊前，就謝不香微：一出品維力要空，球面中我，上我多，考遠資聯，著觀好光子來女是成，角在事自。和賣建情畫這的物理我方回法。聽了可麗公登國都字相對光預無不係來不起類價我此老頭走的分事本使大劇過海……排方去下你部很子細運出。著思回得設之合處……原本較自體都家仍生友是把！系情的的出親上道有下與寫營情國期在進重有是水獲到何燈，未看車安那……長命代，經著大教自家服麼出處濟金樣、羅數中洋個。'.match(/.{1,3}/g);
let urlIpsum = "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc".split(/\s/);
let users = ['生身師…','關交先能手','品維力','上我多','女細','臺投鄉'];
const sqlite3 = require('sqlite3').verbose();
const dburl = './database/formal.db';
let database = new sqlite3.Database(dburl);
const now = Math.round(Date.now() / 1000);


// generate a random array without shuffle
// we can just generate an array from 0 to 100
// then we shuffle it !
// that would be an efficient way

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var jj = 76, idls=[], goodls=[], invsls=[], markls=[];
while(--jj){
    idls.push(jj);
}
shuffle(idls);
jj = 76;
while(--jj){
    goodls.push(jj);
}
shuffle(goodls);
jj = 76;
while(--jj){
    invsls.push(jj);
}
jj = 76;
shuffle(invsls);
while(--jj){
    markls.push(jj);
}
shuffle(markls);



console.log(Date.now());
database.serialize(() => {
    let stmt = database.prepare('INSERT INTO records (goodid, userid, invoiceid, markid, date) VALUES (?, ?, ?, ?, ?)');
    idls.forEach((id, index)=>{
        stmt.run(goodls[index], Math.floor(Math.random()*6)+1, invsls[index], markls[index], Math.round(Math.random()*now));
    });
    stmt.finalize();
});
console.log(Date.now());
database.close();