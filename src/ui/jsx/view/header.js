import React from "react";
import { Toolbar, Actionbar, Button, ButtonGroup } from "../photon/photon";
import BtnGPR from './btngp';
import Moment from 'moment';
import { connect } from 'react-redux';
import { remote, ipcRenderer, shell } from 'electron';

class Header extends React.Component {
  openSetting() {
    ipcRenderer.send('open-setting');
  }
  openAuthor() {
    if (confirm('即将打开作者github主页')) {
      shell.openExternal('https://github.com/wanghsinche/');
    }

  }
  render() {
    let { loged, data, role } = this.props;
    return (
      <Toolbar title="Powered by electron-react">
        <Actionbar>

          <Button glyph="clock" text={Moment(Date.now()).format('YYYY-MM-DD')} />
          <Button glyph="user" text={loged ? data.info.name : '未登录'} />
          {role === 'superuser' ? <Button glyph="lock-open" text='管理员' /> : <Button glyph="lock" text='普通用户' />}
          <Button glyph="menu" text="设置" className="pull-right" onClick={this.openSetting} />
          <Button glyph="github" text="Me" className="pull-right" onClick={this.openAuthor} />
        </Actionbar>

      </Toolbar>
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
)(Header);