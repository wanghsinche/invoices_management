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
    PAGINGNUM
} from './action';
//reducer is a store that cant hold state, it is created to change states by previous state
//store is a really store to hold state
function rdsRecords(state = [], action) {
    let tmp, { recid, ordid, usrid, invsid } = action;

    switch (action.type) {
        case ADD_RECORD:
            tmp = state.slice();
            tmp.push({
                ordid: ordid,
                usrid: usrid,
                invsid: invsid,
                recid: recid
            });
            return tmp;
        case RM_RECORD:
            return state.filter((v) => v.recid !== v.recid);
        case REFRESH_RECORDS:
            tmp = action.records.map(function (v) {
                return {
                    ordid: v.ordid,
                    usrid: v.usrid,
                    invsid: v.invsid,
                    recid: v.recid
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

function rdsPage(state = { current: 0, paging: PAGINGNUM}, action) {
    let {current,paging} = action, tmp;
    switch (action.type) {
        case CHANGE_PAGE:
            tmp = Object.assign({},state,{
                current, paging
            });
            return tmp;
        default:
            return state;
    }
}

//combine reducers
const reducer = combineReducers({
    rdsRecords, rdsFilter, rdsAsync,rdsPage
});

export default reducer;