import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Record from './record';
import { refreshRecordsAction } from "../redux/action";
class Tbody extends Component {
    fetchFunc(userid, dateType){
        let { fetchData } = this.props;
        let users, from, to = Date.now();
        if (userid === 'all') {
            users = this.props.accessList.map(v=>v.userid);
        }
        else {
            users = [userid];
        }
        switch (dateType) {
            case 'M':
                from = to - 1000 * 3600 * 24 * 30;
                break;
            case '3M':
                from = to - 1000 * 3600 * 24 * 90;
                break;
            case '6M':
                from = to - 1000 * 3600 * 24 * 180;
                break;
            case 'Y':
                from = to - 1000 * 3600 * 24 * 365;
                break;
            case 'ALL':
                from = 0;
                break;
            default:
                from = to - 1000 * 3600 * 24 * 30;
                break;
        }

        fetchData(users, from, to);
    }
    componentDidMount() {
        let { userid, dateType } = this.props;
        this.fetchFunc(userid,  dateType);
        
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.userid !== this.props.userid || nextProps.dateType !== this.props.dateType){
            this.fetchFunc(nextProps.userid, nextProps.dateType);
        }
    }

    render() {
        let { records } = this.props, empty, renderContent;

        if (records.length > 0) {
            if (this.props.invoicetype == 0) {
                renderContent = records.map((v) => (
                    <Record key={v.recid} name={v.name} user={v.user} recid={v.recid} code={v.code} priceall={v.priceall} date={v.date} />
                ));
            }
            else if (this.props.invoicetype == 1) {
                renderContent = records.filter(v => !!v.code).map((v) => (
                    <Record key={v.recid} name={v.name} user={v.user} recid={v.recid} code={v.code} priceall={v.priceall} date={v.date} />
                ));
            }
            else if (this.props.invoicetype == 2) {
                renderContent = records.filter(v => !v.code).map((v) => (
                    <Record key={v.recid} name={v.name} user={v.user} recid={v.recid} code={v.code} priceall={v.priceall} date={v.date} />
                ));
            }
        }
        else {
            empty = (
                <tr>
                    <th>无订单</th>
                    <th>无订单</th>
                    <th>无订单</th>
                    <th>无订单</th>
                    <th>无订单</th>
                    <th>无订单</th>
                    <th>无订单</th>
                </tr>
            );
        }
        return (
            <tbody >{empty || renderContent}</tbody>
        );
    }
}

const mapStateToProps = (state) => {
    let { current, paging } = state.rdsPage;
    return {
        records: state.rdsRecords.slice(current * paging, current * paging + paging),
        accessList: state.rdsInfo.accessList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: (users, from, to) => {
            dispatch(refreshRecordsAction(users, from, to));
        }
    };
};

const cntTbody = connect(
    mapStateToProps,
    mapDispatchToProps
)(Tbody);


export default cntTbody;
