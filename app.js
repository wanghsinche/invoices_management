const config = require('./utils/config.js').getConfig();
let
    express = require('express'),
    app = express(),
    cors = require('cors'),
    query = require('./routes/query'),
    change = require('./routes/change'),
    account = require('./routes/account'),
    exportDetail = require('./routes/export'),
    tokenMiddleWare = require('./middleware/token'),
    logger = require('./utils/logger'),
    model = require('./model/index');
    
global.logger = logger.logger;
app.use(cors());
app.use(express.static('public'));

app.use(tokenMiddleWare);
app.use('/api/query', query);
app.use('/api/account', account);
app.use('/api/change', change);
app.use('/api/export', exportDetail);

app.listen(config.port, () => {
    console.log(`listening on ${config.port}`);
});

process.on('SIGINT', function () {
  model.closeDatabase();
  console.log('Got a exit. Goodbye cruel world');
  process.exit(0);
});

