//define reducer
import { combineReducers } from 'redux';
import { ADD_RECORD, RM_RECORD, SET_FILTER, FilterLS } from './action';

//reducer is a store that cant hold state, it is created to change states by previous state
//store is a really store to hold state
function rdsRecords(state = {}, action) {
    let tmp,{recid,ordid,usrid,invsid}=action;
    
    switch (action.type) {
        case ADD_RECORD:
            tmp = Object.assign({}, state);
            tmp[recid] = {
                ordid: ordid,
                usrid: usrid,
                invsid: invsid,
                recid: recid
            };
            return tmp;
        case RM_RECORD:
            tmp = Object.assign({}, state);
            delete tmp[recid];
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

//combine reducers
const reducer = combineReducers({
    rdsRecords, rdsFilter
});

export default reducer;