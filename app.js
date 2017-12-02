function simpleArgvMatch(argvls){
    let argvmap = {}, name='', value='', matchResult;
    const regexp = /^\-([a-zA-z_]+)\=([a-zA-z0-9\.\/]+)/;
    argvls.forEach((val)=>{
        matchResult = val.match(regexp);
        if(matchResult && matchResult.length>2){
            name = matchResult[1];
            value = matchResult[2];   
            argvmap[name] = value;
        }
    });
    return argvmap;
}
let argvMap = simpleArgvMatch(process.argv);

global.myDataBase = argvMap.real||'./database/real.db';
global.nonceDataBase = argvMap.nonce||'./database/nonce.db';
global.logDataBase = argvMap.log||'./database/log.db';
global.linkRecv = 'vortexdoctor@zju.edu.cn';//'wang.xinzhe@qq.com'; test
let
    express = require('express'),
    app = express(),
    cors = require('cors'),
    query = require('./routes/query'),
    change = require('./routes/change'),
    account = require('./routes/account'),
    exportDetail = require('./routes/export'),
    tokenMiddleWare = require('./middleware/token'),
    patch = require('./utils/patch');

// patch.patchConsole_log(console);
setTimeout(function logtime(){
    console.log((new Date()).toLocaleDateString());
    setTimeout(logtime, 1000*3600*24);
}, 1000*3600*24);

app.use(cors());

app.use(express.static('public'));

app.use(tokenMiddleWare);
app.use('/api/query', query);
app.use('/api/account', account);
app.use('/api/change', change);
app.use('/api/export', exportDetail);

app.listen(8000, () => {
    console.log('listening on 8000');
});

process.on('SIGINT', function () {
  console.log('Got a exit. Goodbye cruel world');
  process.exit(0);
});

