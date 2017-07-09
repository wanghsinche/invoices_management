let express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/api/:path', function(req, res) {
    let path = ['./json', req.params.path + '.json'].join('/');
    res.setHeader('Content-Type', 'application/json');
    console.log('read ' + path);
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            res.status(404).send('err');
            throw err;
        }
        res.send(data);
    });
});


app.post('/postrecord', function(req, res) {
    let body = req.body,
        data = {
            code: 1
        },
        records, list, currrecord;
    console.log(body);
    if (body.recid) {
        records = fs.readFileSync('./json/records.json', 'utf8');
        list = fs.readFileSync('./json/list.json', 'utf8');
        records = JSON.parse(records);
        list = JSON.parse(list);
        currrecord = records.find(v => v.recid == body.recid)||{};
        data.good = list.goods.find(v=>v.id == currrecord.goodid)||{};
        data.mark = list.marks.find(v=>v.id == currrecord.markid)||{};
        data.invs = list.invs.find(v=>v.id == currrecord.invsid)||{};
    }
    console.log('return',data);
    res.json(data);
});


app.listen(80, () => {
    console.log('listening on 80');
});