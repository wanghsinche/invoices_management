// action types 
import axios from 'axios';
import CryptoJS from 'crypto-js';
// const hostname = 'http://mycloud';
const hostname = 'http://localhost:8000';
let nonce = 0, times = 0, accessToken = '', usercode, usrpswd;

export const XHR_REQUEST = 'XHR_REQUEST';
export const requestStatus = {
    REQUEST: 'REQUEST',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    NORMAL: 'NORMAL'
};



function getToken(usercode, usrpswd, reqnonce, reqtimes, reqstamp) {
    let hash = CryptoJS.HmacSHA256(usercode, usrpswd, reqnonce, reqtimes, reqstamp);
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

export function saveInfo(usercode, info) {
    return {
        type: SAVE_INFO,
        usercode,
        info
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
            url: hostname + '/api/query/getnonce',
        }).then(function (response) {
            nonce = response.data.data.nonce;
            let stamp = Date.now().toString();
            let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
            console.log('pre authorize success');
            return axios({
                method: 'get',
                url: hostname + '/api/account/getidentity',
                headers: {
                    'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
                }
            });
        }).then(function (response) {
            accessToken = response.data.accessToken;
            console.log('login success');
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(saveInfo(usercode, response.data));
        }).catch(function (err) {
            console.log(err);
            dispatch(requestAction(requestStatus.ERROR));
        });
    };

}

export const REFRESH_RECORDS = 'REFRESH_RECORDS';
export const ADD_RECORD = 'ADD_RECORD';
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
export function refreshRecordsAction() {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        return axios({
            method: 'get',
            url: hostname + '/api/query/records/1',
            params:{
                from:0,
                to:Date.now(),
                accessToken:accessToken
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        }).then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(refreshRecords(res.data));
        }).catch(function (err) {
            dispatch(requestAction(requestStatus.ERROR));
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

export function setCurrentAction(detail) {
    return {
        type: SET_CURRENT,
        detail: detail
    };
}

export function getDetail(recid){
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        let stamp = Date.now().toString();
        let token = getToken(usercode, usrpswd, nonce, times.toString(), stamp);
        return axios({
            method: 'get',
            url: hostname + '/api/query/detail/'+recid,
            params:{
                accessToken:accessToken
            },
            headers: {
                'Authorization': buildAuthContent(usercode, nonce, times++, stamp, token)
            }
        }).then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(setCurrentAction(res.data));
        }).catch(function (err) {
            dispatch(requestAction(requestStatus.ERROR));
        });
    };
}




export function postAndAdd(data) {
    return (dispatch) => {
        dispatch(requestAction(requestStatus.REQUEST));
        console.log(data);
        return axios.post('http://mytest.163.com/postrecord', data).then((res) => {
            if (parseInt(res.data.code, 10) === 1) {
                console.log(res.statusText);
                dispatch(requestAction(requestStatus.SUCCESS));
                dispatch(updateList(res.data.good, res.data.mark, res.data.invs));
                if (res.data.record) {
                    dispatch(addRecord(res.data.record));
                }
                alert('success');
            }
            else {
                dispatch(requestAction(requestStatus.ERROR));
                console.log(res.statusText);
            }

        }).catch((err) => {
            console.log(err, 'err');
            dispatch(requestAction(requestStatus.ERROR));
        });
    };
}
