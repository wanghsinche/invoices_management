// action types 
export const ADD_RECORD = 'ADD_RECORD';
export const RM_RECORD = 'RM_RECORD';
export const SET_FILTER = 'SET_FILTER';
// filter msg details
export const FilterLS = {
    SHOW_BY_USR:'SHOW_BY_USR',
    SHOW_ALL:'SHOW_ALL'
};

// action function
export function addRecord(ordid, usrid, invsid, recid){
    return {
        type: ADD_RECORD,
        ordid: ordid,
        usrid: usrid,
        invsid: invsid,
        recid: recid
    };
}

export function rmRecord(recid){
    return {
        type: RM_RECORD,
        recid: recid
    };
}

export function setFilter(filter){
    return {
        type: SET_FILTER,
        filter: filter
    };
}