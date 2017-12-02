const router = require('express').Router();
const getDetailList = require('../model/index').getAllDetail;
const url = require('url');
const accessMiddelware = require('../middleware/access');
const moment = require('moment');
const fs = require('fs');
const JSZip = require('jszip');
const Docxtemplater = require('docxtemplater');
const pathMD = require('path');
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
            res.status(403).send({
                code:-3,
                msg:'need super user'
            });
        } else {
            getDetailList(users, from, to).then(function(list) {
                let token = ['csv_', from, to, Date.now()].join('_');
                let path = pathMD.resolve(__dirname, '..', 'public/static', token + '.txt');
                let result = list.map(v => [moment(v.date).format('YYYY/MM/DD'), v.good.goodcode, v.good.priceall, v.invs.price, v.user.name, v.invs.code ? v.invs.code : '未上交', moment(v.invs.date).format('YYYY/MM/DD'), v.invs.type, v.mark.content,'\r\n'].join('\t'));
                result.unshift(['订单日期', '订单编号', '金额', '发票金额', '买家', '发票状态', '发票时间', '分类', '备注','\r\n'].join('\t'));
                fs.writeFile(path, result.join('\n'), function(err) {
                    if (err) {
                        return Promise.reject(err);
                    } else {
                        res.send({
                            code: 1,
                            msg: 'export successfully',
                            data:{path: '/static/' + token + '.txt'}
                        });
                        setTimeout(function() {
                            fs.unlinkSync(path);
                        }, 60000);
                    }
                });
            }).catch(function(err) {
                res.status(500).send({
                    code:-1,
                    msg:'server error at export.js //csv/:users',
                    data:err
                });
                console.log(err);
            });
        }
    } else {
        res.status(400).send({
            code: -4,
            msg: '请求格式错误'
        });
    }

});

router.get('/docx/', function(req, res) {
    let user = req.extraInfo.userid,
        {
            from,
            to
        } = url.parse(req.url, true).query;
    if (user && from && to) {
        getDetailList([user], from, to).then(function(list) {
                //Load the docx file as a binary
                let content = fs
                    .readFileSync(pathMD.resolve(__dirname, '..', 'public/static', 'input.docx'), 'binary');
                let zip = new JSZip(content);
                let doc = new Docxtemplater();
                let today = moment(Date.now());
                let buf, token = [user, from, to, Date.now()].join('_'),
                    dest = pathMD.resolve(__dirname, '..', 'public/static', token + '.docx');
                doc.loadZip(zip);
                doc.setData({
                    'yyyy': today.year(),
                    'mm': today.month()+1,
                    'dd': today.date(),
                    'list': list.map((v) => {
                        return {
                            code: v.good.goodcode,
                            name: v.good.name,
                            num: v.good.num || 0,
                            price: v.good.price,
                            priceall: v.good.priceall,
                            content: v.mark.content
                        };
                    }),
                    'sum': list.reduce(function(sum, v) {
                        return sum + v.good.priceall;
                    }, 0).toFixed(2)
                });

                // render the document 
                doc.render();
                buf = doc.getZip()
                    .generate({
                        type: 'nodebuffer'
                    });

                // buf is a nodejs buffer, you can either write it to a file or do anything else with it.
                fs.writeFile(dest, buf, function(err) {
                    if (err) {
                        return Promise.reject(err);
                    } else {
                        res.send({
                            code: 1,
                            msg: 'export successfully',
                            data:{path: '/static/' + token + '.docx'}
                        });
                        setTimeout(function() {
                            fs.unlinkSync(dest);
                        }, 60000);
                    }
                });
            }).catch(function(err) {
                res.status(500).send({
                    code:-1,
                    msg:'server error at export.js //docx/',
                    data:err
                });
                console.log(err);
            });
    } else {
        res.status(400).send({
            code: -4,
            msg: '请求格式错误'
        });
    }

});

module.exports = router;