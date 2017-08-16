import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Icon } from "../photon/photon";
import { requestStatus, requestAction } from '../redux/action';

const itStyle = {
    position: "fixed",
    top: "40%",
    left: "45%",
    "fontSize": "50px",
    "zIndex": 99, animation: "2s rotate linear infinite"
};
const app = ({ loadingProps }) => (
    <Icon glyph="arrows-ccw" style={itStyle} hidden={!loadingProps} />
);

app.propTypes = {
    loadingProps: PropTypes.bool.isRequired

};

const mapStateToProps = (state) => {
    return {
        loadingProps: state.rdsAsync.status === requestStatus.REQUEST
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};




const Loading = connect(
    mapStateToProps,
    mapDispatchToProps
)(app);


const EmptyContent = ({ text }) => (
    <div style={{ textAlign: 'center', fontSize: '20px' }}>
        <Icon glyph="comment" withText={true} style={{ color: '#57acf5', fontSize: '50px', verticalAlign: 'middle' }} />&nbsp;{text}
    </div>
);


const Rawerr = ({ err,setNormal }) => (
    <div style={{position: "absolute","fontSize": "20px", width:"100%", height:"100%", backgroundColor: "#3c3c3c", opacity: "0.9"}} hidden={!err} onClick={setNormal.bind(this)}>
        <div style={{position:"absolute", top:"50%",left:"50%",margin:"-25px 0 0 -25px" ,color:'#ff4455'}}>
        <Icon glyph="signal"  withText={true} style={{ "fontSize": "50px","zIndex": 99,color:'#ff4455'}} />&nbsp;network error
        </div>
    </div>
);

const ErrorModal = connect(
    (state) => {
        return {
            err: state.rdsAsync.status === requestStatus.ERROR
        };
    },
    (dispatch) => {
        return {
            setNormal(){
                dispatch(requestAction(requestStatus.NORMAL));
            }
        };
    }
)(Rawerr);


export { Loading, EmptyContent, ErrorModal };


