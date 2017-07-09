let fs = require('fs');
let NUM = 265,
    buffer, objList = [],
    tmp, baseID,
    jsonPath = './json/records.json';
for (let i = 0; i < NUM; i++) {
    baseID = Math.random() * Math.random() * 100000000;
    tmp = {
        ordid: (baseID + 1).toFixed(0),
        usrid: (baseID + 2).toFixed(0),
        invsid: (baseID + 3).toFixed(0),
        recid: (baseID + 4).toFixed(0),
        done: Boolean(parseInt(baseID.toFixed(0),10)%2)
    };
    objList.push(tmp);
}
buffer = JSON.stringify(objList);
fs.writeFile(jsonPath, buffer, (err) => {
    if (err) {
        throw err;
    }
    console.log('save to', jsonPath);
});
