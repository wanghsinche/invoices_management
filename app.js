// global.myDataBase = './database/formal.db';
global.myDataBase = './database/real.db';
global.nonceDataBase = './database/nonce.db';
global.logDataBase = './database/log.db';
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

