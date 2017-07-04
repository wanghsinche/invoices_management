import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ButtonGroup, Button, Toolbar, Actionbar } from "../photon/photon";
import BtnGPR from './btngp';
import {pageAction} from '../redux/action';

const Page = ({ current, total,onPageClick, show, style }) => {
    let i, renderContent = [];
    for (i = 0; i < total; i++) {
        renderContent.push((<Button key={i} text={i + 1} active={i === current}
            onClick={
                (function iief(ii) {
                    return () => { onPageClick(ii); };
                })(i)
            }
        />));
    }
    return (
            <BtnGPR style={style}>
                {show?renderContent:''}
            </BtnGPR>
    );
};

Page.propTypes = {
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onPageClick: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    let { current, paging, show } = state.rdsPage,
    recordNum = state.rdsRecords.length;
    return {
        current, 
        total: Math.ceil(recordNum/paging)||1,
        show: show
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onPageClick: (pageid) => {
            dispatch(pageAction(pageid));
        }
    };
};


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Page);;