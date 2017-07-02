import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Record from './record';
import { asyncAction } from "../redux/action";
class Tbody extends Component {
    componentDidMount() {
        let { fetchData } = this.props;
        fetchData();
    }
    render() {
        let { records } = this.props, empty, renderContent;
        if (records.length > 0) {
            renderContent = records.map((v) => (
                <Record key={v.recid} ordid={v.ordid} usrid={v.usrid} invsid={v.invsid} recid={v.recid} />
            ));
        }
        else {
            empty = (<tr><td>empty</td><td>empty</td><td>empty</td><td>empty</td></tr>);
        }
        return (
            <tbody>{empty || renderContent}</tbody>
        );
    }
}

const mapStateToProps = (state) => {
    let { current, paging } = state.rdsPage;
    return {
        records: state.rdsRecords.slice(current * paging, current * paging + paging)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: () => {
            dispatch(asyncAction());
        }
    };
};

const cntTbody = connect(
    mapStateToProps,
    mapDispatchToProps
)(Tbody);


export default cntTbody;
