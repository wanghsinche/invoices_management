global.myDataBase = './database/formal.db';
global.nonceDataBase = './database/nonce.db';
let
    express = require('express'),
    app = express(),
    cors = require('cors');
    query = require('./routes/query'),
    tokenMiddleWare = require('./middleware/token'),
    closeDataBase = require('./model/index').closeDataBase;


app.use(cors());

app.use(express.static('public'));

app.use(tokenMiddleWare);
app.use('/query', query);



app.listen(8000, () => {
    console.log('listening on 8000');
});

process.on('SIGINT', function () {
  console.log('Got a exit. Goodbye cruel world');
  closeDataBase();
  process.exit(0);
});

