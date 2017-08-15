import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Record from './record';
import { refreshRecordsAction } from "../redux/action";
class Tbody extends Component {
    componentDidMount() {
        let { fetchData } = this.props;
        fetchData();
    }
    render() {
        let { records } = this.props, empty, renderContent;
        if (records.length > 0) {
            renderContent = records.map((v) => (
                <Record key={v.recid} name={v.name} user={v.user} recid={v.recid} code={v.code} priceall={v.priceall} date={v.date} />
            ));
        }
        else {
            empty = (
                <tr>
                    <th>empty</th>
                    <th>empty</th>
                    <th>empty</th>
                    <th>empty</th>
                    <th>empty</th>
                    <th>empty</th>
                    <th>empty</th>
                </tr>
            );
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
            dispatch(refreshRecordsAction());
        }
    };
};

const cntTbody = connect(
    mapStateToProps,
    mapDispatchToProps
)(Tbody);


export default cntTbody;
