// action types 
import axios from 'axios';

export const PAGINGNUM = 40;

export const ADD_RECORD = 'ADD_RECORD';
export const REFRESH_RECORDS = 'REFRESH_RECORDS';
export const RM_RECORD = 'RM_RECORD';
export const SET_FILTER = 'SET_FILTER';
// filter msg details
export const FilterLS = {
    SHOW_BY_USR: 'SHOW_BY_USR',
    SHOW_ALL: 'SHOW_ALL'
};

export const XHR_REQUEST = 'XHR_REQUEST';
export const requestStatus = {
    REQUEST: 'REQUEST',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    NORMAL: 'NORMAL'
};

export const CHANGE_PAGE = 'CHANGE_PAGE';
export const SHOW_PAGE = 'SHOW_PAGE';

//list
export const REFRESH_LIST = 'REFRESH_LIST';
export const UPDATE_LIST = 'UPDATE_LIST';

//current
export const SET_CURRENT = 'SET_CURRENT'; 


// action function
export function addRecord(ordid, usrid, invsid, recid) {
    return {
                type: ADD_RECORD,
                ordid, usrid, invsid, recid
            };

}

export function rmRecord(recid) {
    return {
        type: RM_RECORD,
        recid: recid
    };
}

export function setFilter(filter) {
    return {
        type: SET_FILTER,
        filter: filter
    };
}

export function refreshRecords(records) {
    return {
        type: REFRESH_RECORDS,
        records: records
    };
}

export function refreshList(list){
    return {
        type: REFRESH_LIST,
        list: list
    };
}

export function updateList(good, mark, invs){
    return {
            type: UPDATE_LIST,
            good, mark, invs
        };
}

export function requestAction(status, msg) {
    return {
        type: XHR_REQUEST,
        status: status,
        msg: msg || ''
    };
}

export function asyncAction() {
    return function (dispatch) {
        dispatch(requestAction(requestStatus.REQUEST));
        return axios.get('http://mytest.163.com/api/records').then(function (res) {
            dispatch(requestAction(requestStatus.SUCCESS));
            dispatch(refreshRecords(res.data));

        }).catch(function (err) {
            dispatch(requestAction(requestStatus.ERROR));
        });
    };
}

export function pageAction(toPage) {
    return {
        type: CHANGE_PAGE,
        current: toPage,
        paging: PAGINGNUM
    };
}

export function setCurrentAction(record){
    return {
        type: SET_CURRENT,
        record: record
    };
}



export function pageShowAction(show){
    return {
        type: SHOW_PAGE,
        show: show
    };
}

export function postAndAdd(data) {
    return (dispatch)=>{
        dispatch(requestAction(requestStatus.REQUEST));
        console.log(data);
        return axios.post('http://mytest.163.com/postrecord',data).then((res)=>{
            if(parseInt(res.data.code,10) === 1){
                console.log(res.statusText);
                dispatch(requestAction(requestStatus.SUCCESS));
                dispatch(updateList({},{},{}));
                alert('success');
            }
            else{
                dispatch(requestAction(requestStatus.ERROR));
                console.log(res.statusText);
            }

        }).catch((err)=>{
            console.log(err,'err');
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