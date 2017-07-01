//define action type
export const XHR_REQUEST = 'XHR_REQUEST';
export const requestType = {
    REQUEST:'REQUEST',
    SUCCESS:'SUCCESS',
    ERROR:'ERROR'
};
//define action creater
export function requestAction(status){
    return {
        type: XHR_REQUEST,
        status: status
    };
}