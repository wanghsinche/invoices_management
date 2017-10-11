const Crypto = require('crypto');
const assert = require('assert');
const axios = require('axios');
global.hostname = 'http://localhost:8000';
let usercode = '666', 
usrpswd = '123321';
let nonce, times=0, stamp, accessToken;

function getToken(usercode = '', usrpswd = '', reqnonce = '', reqtimes = '', reqstamp = '') {
    return Crypto.createHmac('sha256', usrpswd.toString()).update([usercode, reqnonce, reqtimes, reqstamp].join('')).digest('base64');
}

function buildAuthContent(usercode, nonce, times, stamp, token) {
    let str = ['usercode=' + usercode, 'nonce=' + nonce, 'times=' + times, 'stamp=' + stamp, 'token=' + token].join(';');
    return str;
}

describe('login',function(){
    it('should get nonce and account',function(){

        return axios({
            method: 'get',
            url: global.hostname + '/api/query/getnonce',
        })
        .then(response=>{
            assert.equal(response.data.code, 0);
            assert.ok(response.data.data.nonce);
            // get nonce
            nonce = response.data.data.nonce;
            console.log(nonce);
            // login
            stamp = Date.now();
            times++;
            return axios({
                method: 'get',
                url: global.hostname + '/api/account/getidentity',
                headers: {
                    'Authorization': buildAuthContent(usercode, nonce, times, stamp, getToken(usercode, usrpswd, nonce, times, stamp))
                }
            });
        })
        .then(response=>{
            console.log(response.data);
            assert.equal(response.data.code, 1);
            assert.ok(response.data.data);
            accessToken = response.data.data.accessToken;
        })
        .catch(err=>{
            console.log(err.response.data);
            throw err;
        });
            
    });
});
// describe('fail login',function(){
//     it('should get nonce and account',function(done){

//         axios({
//             method: 'get',
//             url: global.hostname + '/api/query/getnonce',
//         })
//         .then(response=>{
//             assert.equal(response.data.code, 0);
//             assert.ok(response.data.data.nonce);
//             // get nonce
//             nonce = response.data.data.nonce;
//             console.log(nonce);
//             // login
//             stamp = Date.now();
//             times++;
//             return axios({
//                 method: 'get',
//                 url: global.hostname + '/api/account/getidentity',
//                 headers: {
//                     'Authorization': buildAuthContent(usercode, nonce, times, stamp, getToken(usercode, usrpswd+1, nonce, times, stamp))
//                 }
//             });
//         })
//         .then(response=>{
//             console.log(response.data);
//             done();
//         })
//         .catch(err=>{
//             console.log(err.response.data);
//             assert.equal(err.response.data.code, -2);
//             done();
//         })
//         .catch(done);
            
//     });
// });

// describe('restpassword',function(){
//     it('should success',function(done){
//         stamp = Date.now();
//         times++;
//         axios({
//             method:'post',
//             url: global.hostname + '/api/account/resetPSWD',
//             params: {
//                 accessToken: accessToken
//             },
//             headers: {
//                     'Authorization': buildAuthContent(usercode, nonce, times, stamp, getToken(usercode, usrpswd, nonce, times, stamp))
//             },
//             data:{
//                 usercode: '11425038',
//                 username: '赵江宏',
//                 emailAddress: '13082806906@163.com'
//             }
//         })
//         .then(response=>{
//             assert.equal(response.data.code, 1);
//             console.log(response.data);
//             done();
//         }) 
//         .catch(done);
//     });
// });
// let lastid ;
// describe('new order',function(){
//     it('it should be lastid', function(done){
//         stamp = Date.now();
//         times++;
//         axios({
//             method:'put',
//             url: global.hostname + '/api/change/newRecord',
//             params: {
//                 accessToken: accessToken
//             },
//             headers: {
//                 'Authorization': buildAuthContent(usercode, nonce, times, stamp, getToken(usercode, usrpswd, nonce, times, stamp))
//             },
//             data:{
//                 name: '1232sdf342',
//                 price: 12.3,
//                 priceall: 1,
//                 num: 1,
//                 goodcode: 'sfsdfsdf',
//                 buyDate: 123,
//                 invscode: null,
//                 invsprice: null,
//                 invsdate: null,
//                 type: null,
//                 link: null,
//                 content: null,
//                 mailFlag: false,
//             }
//         })
//         .then(response=>{
//             assert.equal(response.data.code, 1);
//             console.log(response.data);
//             lastid = response.data.data.lastid;
//             done();
//         }) 
//         .catch(err=>{
//             console.log(err.response.data);
//             assert.equal(err.response.status, 400);
//             done();
//         })
//         .catch(done);
//     });
// });
// describe('change order',function(){
//     it('it should be success', function(done){
//         stamp = Date.now();
//         times++;
//         axios({
//             method:'post',
//             url: global.hostname + '/api/change/updateRecord/'+lastid,
//             params: {
//                 accessToken: accessToken
//             },
//             headers: {
//                 'Authorization': buildAuthContent(usercode, nonce, times, stamp, getToken(usercode, usrpswd, nonce, times, stamp))
//             },
//             data:{
//                 name: '1232sdf342',
//                 price: 12.3,
//                 priceall: 1,
//                 num: 1,
//                 goodcode: 'sfsdfsdf',
//                 buyDate: 123,
//                 invscode: null,
//                 invsprice: null,
//                 invsdate: null,
//                 type: null,
//                 link: null,
//                 content: null,
//                 mailFlag: false,
//             }
//         })
//         .then(response=>{
//             assert.equal(response.data.code, 1);
//             console.log(response.data);
//             done();
//         }) 
//         .catch(err=>{
//             console.log(err.response.data);
//             assert.equal(err.response.status, 400);
//             done();
//         })
//         .catch(done);
//     });
// });
// describe('get all order', function(){
//     it('should be list', function(){
//         stamp = Date.now();
//         times++;
//         return axios({
//             method: 'get',
//             url: global.hostname + '/api/query/records',
//             params: {
//                 from: 0,
//                 to: Date.now(),
//                 accessToken: accessToken
//             },
//             headers: {
//                 'Authorization': buildAuthContent(usercode, nonce, times, stamp, getToken(usercode, usrpswd, nonce, times, stamp))
//             },
//         })
//         .then(response=>{
//             assert.equal(response.data.code, 1);
//             assert.ok(response.data.data instanceof Array);
//             console.log(response.data.data.length);
//         });
//     });
// });
// describe('test collection',function(){
//     this.timeout(0);
//     it('case1',function(){
//         return new Promise(function(resolve){
//             setTimeout(function(){
//                 assert.equal(1,1);
//                 resolve();
//             },1000);
//         })
//         .then(function(){
//             return new Promise(function(resolve){
//                 setTimeout(function(){
//                     assert.equal(2,2);
//                     resolve();
//                 },1000);
//             });
//         })
//         .then(function(){
//             return new Promise(function(resolve){
//                 setTimeout(function(){
//                     assert.equal(3,3);
//                     resolve();
//                 },1000);
//             });
//         });
//     });
//     it('case2',function(){
//         return new Promise(function(resolve){
//             setTimeout(function(){
//                 assert.equal(4,4);
//                 resolve();
//             },1000);
//         })
//         .then(function(){
//             return new Promise(function(resolve){
//                 setTimeout(function(){
//                     assert.equal(5,5);
//                     resolve();
//                 },1000);
//             });
//         });
//     });
// });