const argv = require('./utils/argv.js');
let argvMap = argv.loadFromConfig() || argv.getArgvMap();
global.myDataBase = argvMap.real||'./database/real.db';
global.nonceDataBase = argvMap.nonce||'./database/nonce.db';
global.logDataBase = argvMap.log||'./database/log.db';
global.linkRecv = argvMap.email||'wang.xinzhe@qq.com'; 
global.port = argvMap.port||8000;
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

app.listen(global.port, () => {
    console.log('listening on 8000');
});

process.on('SIGINT', function () {
  console.log('Got a exit. Goodbye cruel world');
  process.exit(0);
});

