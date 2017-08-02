global.myDataBase = './database/formal.db';
let
    express = require('express'),
    app = express(),
    query = require('./routes/query'),
    closeDataBase = require('./model/index').closeDataBase;

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true); //可以带cookies
    res.header('X-Powered-By', '3.2.1');
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});


app.use(express.static('public'));


app.use('/query', query);



app.listen(8083, () => {
    console.log('listening on 8083');
});

process.on('SIGINT', function () {
  console.log('Got a SIGINT. Goodbye cruel world');
  closeDataBase();
  process.exit(0);
});