global.myDataBase = './database/formal.db';
global.nonceDataBase = './database/nonce.db';
global.logDataBase = './database/log.db';
let
    express = require('express'),
    app = express(),
    cors = require('cors'),
    query = require('./routes/query'),
    tokenMiddleWare = require('./middleware/token'),
    patch = require('./middleware/patch');

patch.patchConsole_log(console);

app.use(cors());

app.use(express.static('public'));

app.use(tokenMiddleWare);
app.use('/query', query);



app.listen(8000, () => {
    console.log('listening on 8000');
});

process.on('SIGINT', function () {
  console.log('Got a exit. Goodbye cruel world');
  process.exit(0);
});

