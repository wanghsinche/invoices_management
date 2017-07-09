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
    let tmp, { recid, goodid, usrid, invsid, markid } = action;

    switch (action.type) {
        case ADD_RECORD:
            tmp = state.slice();
            tmp.push({
                recid, goodid, usrid, invsid, markid
            });
            return tmp;
        case RM_RECORD:
            return state.filter((v) => v.recid !== v.recid);
        case REFRESH_RECORDS:
            tmp = action.records.map(function (v) {
                return {
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

function rdsList(state = { goods: [], users: [], marks: [], invs: [] }, action) {
    let { type, list, good, invs, mark } = action,
        gls, mls, ils,
        tmp;
    switch (type) {
        case REFRESH_LIST:
            return Object.assign({}, list);
        case UPDATE_LIST:
            gls = state.goods;
            mls = state.marks;
            ils = state.invs;

            tmp = gls.findIndex(v => v.id == good.id);
            if (tmp > -1) {
                gls[tmp] = good;
            }
            else {
                gls.push(good);
            }

            tmp = mls.findIndex(v => v.id == mark.id);
            if (tmp > -1) {
                mls[tmp] = mark;
            }
            else {
                mls.push(mark);
            }

            tmp = ils.findIndex(v => v.id == invs.id);
            if (tmp > -1) {
                ils[tmp] = invs;
            }
            else {
                ils.push(invs);
            }
            return Object.assign(state, { goods: gls, marks: mls, invs: ils });;
        default:
            return state;
    }
}

function rdsCurrent(state = {
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
    rdsRecords, rdsFilter, rdsAsync, rdsPage, rdsList, rdsCurrent
});

export default reducer;