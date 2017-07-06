import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Icon } from "../photon/photon";
import { requestStatus } from '../redux/action';

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


const Rawerr = ({ err }) => (
    <div style={{position: "fixed",top: "40%",left: "45%", "fontSize": "20px"}} hidden={!err}>
        <Icon glyph="signal"  withText={true} style={{ "fontSize": "50px","zIndex": 99, verticalAlign: 'middle',color:'#ff4455',animation: "2s rotate linear infinite" }} />&nbsp;network error
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

        };
    }
)(Rawerr);


export { Loading, EmptyContent, ErrorModal };


