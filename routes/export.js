const router = require('express').Router();
const getDetailList = require('../model/index').getAllDetail;
const url = require('url');
const accessMiddelware = require('../middleware/access');
const fs = require('fs');
const exec = require('child_process').execSync;

// all query need to check access right
router.use(accessMiddelware);


router.get('/csv/:users', function(req, res) {

    let users = req.params.users.split('+'),
        {
            from,
            to
        } = url.parse(req.url, true).query;



    if (users && from && to) {
        if ((users.length > 1 || users[0] !== req.extraInfo.userid) && !req.extraInfo.superuser) {
            res.status(403).send('No enough right');
        } else {
            getDetailList(users, from, to).then(function(list) {
                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', 'attachment; filename=' + [users.join('+'), from, to].join('_') + '.csv');
                let token = [users.join('_'), from, to, Date.now()].join('_');
                let path = __dirname + '/' + '../public/static/' + token + '.csv';
                fs.writeFile(path, list.map(v => [v.recid, v.userid, v.invoiceid, v.markid].join('\t')).join('\n'), function(err) {
                    if (err) {
                        res.status(500);
                        console.log(err);
                        return Promise.reject(err);
                    } else {
                        res.setHeader('Content-Type', 'application/json');
                        res.send({
                            msg: 'export successfully',
                            path: '/static/' + token + '.csv'
                        });
                        setTimeout(function() {
                            fs.unlinkSync(path);
                        }, 60000);
                    }
                });
                // res.send(list.map(v=>[v.recid, v.userid, v.invoiceid, v.markid].join('\t')).join('\n'));
            }).catch(function(err) {
                console.log(err);
            });
        }
    } else {
        res.end('error');
    }

});



module.exports = router;