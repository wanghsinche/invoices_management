// action types 
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { remote, ipcRenderer } from 'electron';
// const global.hostname = 'http://mycloud';
let nonce = 0, times = 0, accessToken = '', usercode, usrpswd;

export const XHR_REQUEST = 'XHR_REQUEST';
export const requestStatus = {
    REQUEST: 'REQUEST',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    NORMAL: 'NORMAL'
};

axios.defaults.timeout = 3000;

function getToken(usercode = "", usrpswd = "", reqnonce = "", reqtimes = "", reqstamp = "") {
    let hash = CryptoJS.HmacSHA256([usercode, reqnonce, reqtimes, reqstamp].join(''), usrpswd);
    let hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    console.log(hashInBase64);
    return hashInBase64;
}
function buildAuthContent(usercode, nonce, times, stamp, token) {
    let str = ['usercode=' + usercode, 'nonce=' + nonce, 'times=' + times, 'stamp=' + stamp, 'token=' + token].join(';');
    return str;
}
// action function

export const SAVE_INFO = 'SAVE_INFO';
export const CLEAR_INFO = 'CLEAR_INFO';
export const LOG_IN = 'LOG_IN';

export function saveInfo(usercode, data) {
    return {
        type: SAVE_INFO,
        usercode: usercode,
        data: data
    };
}

export function clearInfo() {
    return {
        type: CLEAR_INFO
    };
}

export function login(usercodeP, usrpswdP) {
    usercode = usercodeP;
    usrpswd = usrpswdP;
    return (dispatch) => {
        dispatch(requestAction(requestStatus.REQUEST));
        return axios({
            method: 'get',
            url: global.hostname + '/api/query/getnonce',
        }).then(function (response) {
            nonce = response.data.data.nonce;
            let stamp = Date.now().toString();
            let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
            console.log('pre authorize success');
            return axios({
                method: 'get',
                url: global.hostname + '/api/account/getidentity',
                headers: {
                    'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
                }
            });
        }).then(function (response) {
            accessToken = response.data.data.accessToken;
            console.log('login success');
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(saveInfo(usercode, response.data.data));
        }).catch(function (err) {
            console.log(err.response);
            if (err.response.status == '401') {
                alert('登陆失败，请检查账号密码');
                dispatch(requestAction(requestStatus.NORMAL));
            }
            else {
                dispatch(requestAction(requestStatus.ERROR));
                alert(err.response.data.msg);
            }
        });
    };
}

export function refreshState() {
    return (dispatch) => {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        axios({
            method: 'get',
            url: global.hostname + '/api/account/getidentity',
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        })
        .then(function (response) {
            accessToken = response.data.data.accessToken;
            console.log('login success');
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(saveInfo(usercode, response.data.data));
        }).catch(function (err) {
            console.log(err.response);
            if (err.response.status == '401') {
                alert('刷新失败，请检查账号密码');
                dispatch(requestAction(requestStatus.NORMAL));
            }
            else {
                dispatch(requestAction(requestStatus.ERROR));
                alert(err.response.data.msg);
            }
        });
    };
}




export const REFRESH_RECORDS = 'REFRESH_RECORDS';
export const ADD_RECORD = 'ADD_RECORD';
export const UPDATE_RECORD = 'UPDATE_RECORD';
export function refreshRecords(records) {
    return {
        type: REFRESH_RECORDS,
        records: records
    };
}
export function addRecord(record) {
    return {
        type: ADD_RECORD,
        record: record
    };
}
export function updateRecord(record) {
    return {
        type: UPDATE_RECORD,
        record: record
    };
}
export function refreshRecordsAction(users, from, to) {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        return axios({
            method: 'get',
            url: global.hostname + '/api/query/records/' + users.join('+'),
            params: {
                from: from,
                to: to,
                accessToken: accessToken
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        }).then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(refreshRecords(res.data.data));
        }).catch(function (err) {
            dispatch(requestAction(requestStatus.ERROR));
            alert(err.response.data.data.msg);
        });
    };
}
export function postAndAdd(recid, data) {
    return (dispatch) => {
        dispatch(requestAction(requestStatus.REQUEST));
        console.log(data);
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        return axios({
            method: 'post',
            url: global.hostname + '/api/change/updateRecord/' + recid,
            params: {
                accessToken: accessToken
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            },
            data: data
        }).then((res) => {
            if (Number(res.data.code) === 1) {
                dispatch(requestAction(requestStatus.SUCCESS));
                dispatch(updateRecord({ code: data.invscode, priceall: data.priceall, recid: recid }));
                alert('success');
            }
            else {
                dispatch(requestAction(requestStatus.ERROR));
                dispatch(refreshCurrentAction());
                alert(res.data.msg);
            }

        }).catch((err) => {
            if(/40/.test(err.response.status))
            {
                alert(err.response.data.msg);
                dispatch(requestAction(requestStatus.NORMAL));
            }
            else{
                dispatch(requestAction(requestStatus.ERROR));
                alert(err.response.data.msg);
            }
            dispatch(refreshCurrentAction());
        });
    };
}
export function putNewRecord(data) {
    return (dispatch) => {
        dispatch(requestAction(requestStatus.REQUEST));
        console.log(data);
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        return axios({
            method: 'put',
            url: global.hostname + '/api/change/newRecord',
            params: {
                accessToken: accessToken
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            },
            data: data
        }).then((res) => {
            if (Number(res.data.code) === 1) {
                dispatch(requestAction(requestStatus.SUCCESS));
                alert('添加成功');
            }
            else {
                dispatch(requestAction(requestStatus.ERROR));
                alert(res.data.msg);
            }

        }).catch((err) => {
            if(/40/.test(err.response.status))
            {
                alert(err.response.data.msg);
                dispatch(requestAction(requestStatus.NORMAL));
            }
            else{
                dispatch(requestAction(requestStatus.ERROR));
                alert(err.response.data.msg);
            }
        });
    };
}
export function requestAction(status, msg) {
    return {
        type: XHR_REQUEST,
        status: status,
        msg: msg || ''
    };
}

export const PAGINGNUM = 40;
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const SHOW_PAGE = 'SHOW_PAGE';


export function pageAction(toPage) {
    return {
        type: CHANGE_PAGE,
        current: toPage,
        paging: PAGINGNUM
    };
}

export function pageShowAction(show) {
    return {
        type: SHOW_PAGE,
        show: show
    };
}


//current
export const SET_CURRENT = 'SET_CURRENT';
export const REFRESH_CURRENT = 'REFRESH_CURRENT';
export function setCurrentAction(detail) {
    // 加上stamp是保证 detail.js 中的componentWillReceiveProps能够每次都更新，这样可以刷新掉修改过的state
    return {
        type: SET_CURRENT,
        detail: Object.assign({},detail,{stamp: Date.now()})
    };
}
export function refreshCurrentAction() {
    // 加上stamp是保证 detail.js 中的componentWillReceiveProps能够每次都更新，这样可以刷新掉修改过的state
    return {
        type: REFRESH_CURRENT
    };
}
export function getDetail(recid) {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        return axios({
            method: 'get',
            url: global.hostname + '/api/query/detail/' + recid,
            params: {
                accessToken: accessToken
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        }).then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(setCurrentAction(res.data.data));
        }).catch(function (err) {
            alert(err.response.msg);
            dispatch(requestAction(requestStatus.ERROR));
        });
    };
}

// password
export function changePswd(password) {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        return axios({
            method: 'post',
            url: global.hostname + '/api/account/changePSWD',
            contentType: 'application/json; charset=utf-8',
            data: {
                password: password
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        }).then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            usrpswd = password;
            alert('密码修改成功');
        }).catch(function (err) {
            if(/40/.test(err.response.status))
            {
                alert(err.response.data.msg);
                dispatch(requestAction(requestStatus.NORMAL));
            }
            else{
                dispatch(requestAction(requestStatus.ERROR));
                alert(err.response.data.msg);
            }
        });
    };
}

// export
export function exportFile(type, from, to, users) {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        let url = type === 'csv' ? global.hostname + '/api/export/' + type + '/' + [users].join('+') : global.hostname + '/api/export/docx/';
        return axios({
            method: 'get',
            url: url,
            params: {
                from: from,
                to: to,
                accessToken: accessToken
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        }).then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            ipcRenderer.send('asynchronous-download', global.hostname + res.data.path);
        }).catch(function (err) {
            dispatch(requestAction(requestStatus.ERROR));
        });
    };
}

// new user
export function createUser(code, name, email) {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);

        return axios({
            method: 'put',
            url: global.hostname + '/api/account/create',
            params: {

                accessToken: accessToken
            },
            data: {
                usercode: code,
                username: name,
                emailAddress: email,
            },
            contentType: 'application/json; charset=utf-8',
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        }).then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            alert('创建成功，密码已发至用户邮箱');
        }).catch(function (err) {
            if(/40/.test(err.response.status))
            {
                alert(err.response.data.msg);
                dispatch(requestAction(requestStatus.NORMAL));
            }
            else{
                dispatch(requestAction(requestStatus.ERROR));
                alert(err.response.data.msg);
            }
        });
    };
}


// changeUser
export function changeUser(userid, superuser){
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        let url = global.hostname + '/api/account/'+(superuser?'makeSuper/':'removeSuper/')+userid;
        return axios({
            method: superuser?'post':'delete',
            url: url,
            params: {
                accessToken: accessToken
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        }).then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(refreshState());
            alert('修改权限成功，列表刷新');
        }).catch(function (err) {
            if(/40/.test(err.response.status))
            {
                alert(err.response.data.msg);
                dispatch(requestAction(requestStatus.NORMAL));
            }
            else{
                dispatch(requestAction(requestStatus.ERROR));
                alert(err.response.data.msg);
            }
        });
    };
}