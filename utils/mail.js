'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'pnumatic121@163.com',
        pass: 'pnumatic121'
    }
});


module.exports.init = function (emailAddress) {
    return function (good, user, link, content, type) {
        // setup email data with unicode symbols
        let mailOptions, retryTime = 3;

        switch (type) {
            case 1:
                mailOptions = {
                    from: 'pnumatic121@163.com', // sender address
                    to: link||emailAddress, // list of receivers
                    subject: good, // Subject line
                    text: `登录账号:${user}\n密码：${content}`, // plain text body
                    html: `<h1>登录账号:${user}</h1><p>密码：${content}</p>` // html body
                };
                break;
            default:
                mailOptions = {
                    from: 'pnumatic121@163.com', // sender address
                    to: emailAddress, // list of receivers
                    subject: `[${user}]-${good}-求老师付款`, // Subject line
                    text: `购买物品：${good}\n链接：${link}\n备注：${content}`, // plain text body
                    html: `<h1>购买物品：${good}</h1><p>淘宝链接：<a href="${link}">${link}</a></p><article>备注：${content}</article>` // html body
                };
                break;
        }

        // send mail with defined transport object, and retry when error
        setTimeout(function ii(){
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    if(retryTime){
                        retryTime--;
                        console.log('retry');
                        setTimeout(ii, 5000);
                    }
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        }, 0);
        
    };
};