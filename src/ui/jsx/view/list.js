import React, { Component } from 'react';
import { Pane, Toolbar, Actionbar, Button, CheckBox } from "../photon/photon";
import Tbody from './tbody';
import Page from './page';
import Detail from './detail';
import { connect } from 'react-redux';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: this.props.data.info && this.props.data.info.userid,
            invoicetype: 0,
            dateType: 'M', // M 3M 6M Y ALL
        };
    }
    setUser() {

    }
    render() {
        let { userid, invoicetype, dateType } = this.state, { accessList, role } = this.props;
        let userUL;
        if(role === 'superuser'){
            userUL =  [(<option value='all' key="all">所有人</option>)].concat(accessList.map(v => (<option  key={v.userid} value={v.userid}>{v.name}</option>)));
        } 
        else{
            userUL = accessList.map(v => (<option  key={v.userid} value={v.userid}>{v.name}</option>));
        }
        return (
            <div className="pane" style={{ overflow: 'hidden' }}>

                <div style={{ overflow: 'auto', height: '400px' }}>
                    <table className="table-striped" >
                        <thead>
                            <tr>
                                <th>发票状态</th>
                                <th>编号</th>
                                <th>名称</th>
                                <th>总金额</th>
                                <th>用户</th>
                                <th>发票号码</th>
                                <th>日期</th>
                            </tr>
                        </thead>
                        <Tbody userid={userid} invoicetype={invoicetype} dateType={dateType}/>
                    </table>
                </div>
                <div >
                    <Toolbar>
                        <Actionbar >
                            <div className="btn btn-default" >
                                <span className="icon icon-user"></span>
                                <select value={userid} onChange={e => { this.setState({ userid: e.target.value }); }}>{userUL}</select>
                            </div>
                            <div className="btn btn-default" >
                                <span className="icon icon-clock"></span>
                                <select value={dateType} onChange={e => { this.setState({ dateType: e.target.value }); }}>
                                    <option value='M'>一个月内</option>
                                    <option value='3M'>三个月内</option>
                                    <option value='6M'>半年内</option>
                                    <option value='Y'>一年内</option>
                                    {/* <option value='ALL'>全部时间</option> */}
                                </select>
                            </div>
                            <div className="btn btn-default" >
                                <span className="icon icon-newspaper"></span>
                                <select value={invoicetype} onChange={e => { this.setState({ invoicetype: e.target.value }); }}>
                                    <option value='0'>全部状态</option>
                                    <option value='1'>已上交</option>
                                    <option value='2'>未上交</option>
                                </select>
                            </div>
                            <Page style={{ float: 'right' }} />


                        </Actionbar>
                    </Toolbar >
                </div>
                <Detail />
            </div>

        );
    }
}




const mapStateToProps = (state) => {
    return state.rdsInfo;
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);


