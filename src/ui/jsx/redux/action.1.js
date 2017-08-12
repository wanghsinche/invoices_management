// action types 
import axios from 'axios';
const hostname = 'http://mycloud';
export const PAGINGNUM = 40;
export const REFRESH_RECORDS = 'REFRESH_RECORDS';


export const XHR_REQUEST = 'XHR_REQUEST';
export const requestStatus = {
    REQUEST: 'REQUEST',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    NORMAL: 'NORMAL'
};

export const CHANGE_PAGE = 'CHANGE_PAGE';
export const SHOW_PAGE = 'SHOW_PAGE';


//current
export const SET_CURRENT = 'SET_CURRENT';


// action function


export function refreshRecords(records) {
    return {
        type: REFRESH_RECORDS,
        records: records
    };
}


export function asyncAction() {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        return axios.get(hostname+'/query/records/4?from=0&to=360000000').then(function (res) {
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


export function pageAction(toPage) {
    return {
        type: CHANGE_PAGE,
        current: toPage,
        paging: PAGINGNUM
    };
}

export function setCurrentAction(record) {
    return {
        type: SET_CURRENT,
        record: record
    };
}



export function pageShowAction(show) {
    return {
        type: SHOW_PAGE,
        show: show
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
                if(res.data.record){
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

export function refreshListAction() {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        return axios.get('http://mytest.163.com/api/list').then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(refreshList(res.data));

        }).catch(function (err) {
            dispatch(requestAction(requestStatus.ERROR));
        });
    };
}