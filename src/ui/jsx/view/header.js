import React from "react";
import { Toolbar, Actionbar, Button, ButtonGroup } from "../photon/photon";
import BtnGPR from './btngp';
import Moment from 'moment';
import { connect } from 'react-redux';

class Header extends React.Component {
  render() {
    let {loged, data, role} = this.props;
    return (
      <Toolbar title="Powered by electron-react">
        <Actionbar>
          
            <Button glyph="clock" text={ Moment(Date.now()).format('YYYY-MM-DD')}/>
            <Button glyph="user" text={loged?data.info.name:'未登录' }/>
            {role==='superuser'?<Button glyph="lock-open" text='管理员' />:<Button glyph="lock" text='普通用户'/>}
            
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