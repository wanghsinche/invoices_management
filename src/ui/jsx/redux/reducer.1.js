//define reducer
import { combineReducers } from 'redux';
import {
    ADD_RECORD,
    RM_RECORD,
    SET_FILTER,
    FilterLS,
    REFRESH_RECORDS,
    XHR_REQUEST,
    requestStatus,
    CHANGE_PAGE,
    PAGINGNUM,
    SHOW_PAGE,
    REFRESH_LIST,
    UPDATE_LIST,
    SET_CURRENT
} from './action';
//reducer is a store that cant hold state, it is created to change states by previous state
//store is a really store to hold state
function rdsRecords(state = [], action) {
    let tmp, { recid, goodid, usrid, invsid, markid, name } = action;

    switch (action.type) {
        case ADD_RECORD:
            tmp = state.slice();
            tmp.push({
                recid, goodid, usrid, invsid, markid, name
            });
            return tmp;
        case RM_RECORD:
            return state.filter((v) => v.recid !== v.recid);
        case REFRESH_RECORDS:
            tmp = action.records.map(function (v) {
                return {
                    name: v.name,
                    goodid: v.goodid,
                    usrid: v.usrid,
                    invsid: v.invsid,
                    recid: v.recid,
                    markid: v.markid
                };
            });
            return tmp;
        default:
            return state;
    }
}

function rdsFilter(state = FilterLS.SHOW_ALL, action) {
    switch (action.type) {
        case SET_FILTER:
            return action.filter;
        default:
            return state;
    }
}

function rdsAsync(state = {
    status: requestStatus.NORMAL,
    msg: ''
}, action) {
    switch (action.type) {
        case XHR_REQUEST:
            return Object.assign({}, state, {
                status: action.status,
                msg: action.msg
            });
        default:
            return state;
    }
}

function rdsPage(state = { show: true, current: 0, paging: PAGINGNUM }, action) {
    let { current, paging } = action, tmp;
    switch (action.type) {
        case CHANGE_PAGE:
            tmp = Object.assign({}, state, {
                current, paging
            });
            return tmp;
        case SHOW_PAGE:
            return Object.assign({}, state, {
                show: action.show
            });
        default:
            return state;
    }
}


function rdsCurrent(state = {
    name: null,
    goodid: null,
    usrid: null,
    invsid: null,
    recid: null,
    markid: null
}, action) {
    let { type, record } = action;
    switch (type) {
        case SET_CURRENT:
            return Object.assign({}, state, record);
        default:
            return state;
    }
}

//combine reducers
const reducer = combineReducers({
    rdsRecords, rdsPage, rdsCurrent, rdsNetwork, rdsAccount
});

export default reducer;