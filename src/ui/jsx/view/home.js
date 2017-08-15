import React, { Component, PropTypes } from 'react';
import { Window, Toolbar, Content, Pane, Input, Button } from "../photon/photon";
import { connect } from 'react-redux';
import { login } from '../redux/action';

class Home extends Component {
        constructor(props) {
                super(props);
                this.state = {
                        usercode: 'code0', userpswd: 'xxxxxx'
                };
        }
        handleChange(obj) {
                let newState = Object.assign({}, this.state, obj);
                this.setState(newState);
        }
        handleClick() {
                if (this.state.usercode && this.state.userpswd) {
                        this.props.tologin(this.state.usercode, this.state.userpswd);
                }
        }

        render() {
                let {
                        usercode, userpswd
                } = this.state;
                return this.props.loged ?
                        (<Pane className="padded-more" >
                                welcome!
                        </Pane>) : (
                                <Pane className="padded-more" >
                                        <Input label="usercode" value={usercode} onChange={(e) => { this.handleChange({ usercode: e.target.value }); }} />
                                        <Input label="password" value={userpswd} onChange={(e) => { this.handleChange({ userpswd: e.target.value }); }} />
                                        <Button type="submit" ptStyle="btn-primary btn-large" text="login" onClick={this.handleClick.bind(this)} />
                                </Pane>
                        );
        }
}


const mapStateToProps = (state) => {
        return {
                loged: !!state.rdsInfo.loged
        };
};

const mapDispatchToProps = (dispatch) => {
        return {
                tologin: (code, pswd) => {

                        dispatch(login(code, pswd));
                }
        };
};




const home = connect(
        mapStateToProps,
        mapDispatchToProps
)(Home);



export default home;
