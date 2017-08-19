import React, { Component, PropTypes } from 'react';
import { Window, Toolbar, Content, Pane, Input, Button, CheckBox } from "../photon/photon";
import { connect } from 'react-redux';
import { login, clearInfo } from '../redux/action';

class Home extends Component {
        constructor(props) {
                super(props);
                let localinfo = localStorage.getItem('localinfo');
                if (!!localinfo) {
                        localinfo = JSON.parse(localinfo);
                        this.state = {
                                usercode: localinfo.usercode, userpswd: localinfo.userpswd, remember: true
                        };
                }
                else {
                        this.state = {
                                usercode: '', userpswd: '', remember: true
                        };
                }

        }

        handleChange(obj) {
                let newState = Object.assign({}, this.state, obj);
                this.setState(newState);
        }
        handleClick() {
                let localinfo;
                if (this.state.usercode && this.state.userpswd) {
                        this.props.tologin(this.state.usercode, this.state.userpswd);
                        if (this.state.remember) {
                                localinfo = JSON.stringify({
                                        usercode: this.state.usercode,
                                        userpswd: this.state.userpswd
                                });
                                localStorage.setItem('localinfo', localinfo);
                        }
                        else {
                                localStorage.removeItem('localinfo');
                        }
                }
        }
        logout() {
                this.props.clearInfo();
        }
        render() {
                let {
                        usercode, userpswd, remember
                } = this.state,
                        username = this.props.username;
                return this.props.loged ?
                        (<Pane className="padded-more" >
                                <div className="grid grid-pad">
                                        <div className="col-1-1"><h1>vortex订单系统</h1></div>
                                        <div className="col-1-1"><p>welcome! {username}</p></div>
                                        <div className="col-1-1">
                                                <div className="col-1-3"><Button type="submit" ptStyle="btn-primary btn-large" text="注销" onClick={this.logout.bind(this)} /></div>
                                        </div>
                                </div>
                        </Pane>) : (
                                <Pane className="padded-more" >
                                        <div className="grid grid-pad">
                                                <div className="col-1-1"><h1>vortex订单系统</h1></div>
                                                <div className="col-1-1">
                                                        <div className="col-1-2"><Input label="登陆账号" value={usercode} onChange={(e) => { this.handleChange({ usercode: e.target.value }); }} /></div>
                                                </div>
                                                <div className="col-1-1">
                                                        <div className="col-1-2"><Input label="密码" type="password" value={userpswd} onChange={(e) => { this.handleChange({ userpswd: e.target.value }); }} /></div>
                                                </div>
                                                <div className="col-1-1">
                                                        
                                                </div>
                                                <div className="col-1-1"><CheckBox label="记住密码" checked={remember} onChange={(e) => { this.handleChange({ remember: e.target.checked }); }} /></div>
                                                <div className="col-1-1"><Button type="submit" ptStyle="btn-primary btn-large" text="登陆" onClick={this.handleClick.bind(this)} /></div>
                                                
                                        </div>
                                </Pane>
                        );
        }
}


const mapStateToProps = (state) => {
        return {
                loged: !!state.rdsInfo.loged,
                username: state.rdsInfo.data.info && state.rdsInfo.data.info.name
        };
};

const mapDispatchToProps = (dispatch) => {
        return {
                tologin: (code, pswd) => {

                        dispatch(login(code, pswd));
                },
                clearInfo: () => {
                        dispatch(clearInfo());
                }
        };
};




const home = connect(
        mapStateToProps,
        mapDispatchToProps
)(Home);



export default home;
