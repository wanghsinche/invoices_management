import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from "react-photonkit";
import { addRecord } from "../redux/action";
const AddBtn = ({ text, usrid, onAddClick }) => (
    <Button text={text} ptStyle="primary" onClick={() => {
        onAddClick(usrid);
    }} />
);

AddBtn.propTypes = {
    text: PropTypes.string.isRequired,
    onAddClick: PropTypes.func.isRequired,
    usrid:PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
    return {

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAddClick: (usrid) => {
            let ordid = Math.random().toString(), invsid = Math.random().toString(), recid = Date.now().toString();
            dispatch(addRecord(ordid, usrid, invsid, recid));
        }
    };
};

const cntAddBtn = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddBtn);

export default cntAddBtn;