import React from "react";
import {  Pane } from "../photon/photon";
import { Route, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {pageShowAction} from '../redux/action';
 

class Sidebar extends React.PureComponent {

  render() {
    return (
      <Pane ptSize="sm" sidebar>
        <nav className="nav-group">
          <h5 className="nav-group-title">Nav</h5>
          <NavLink className="nav-group-item" to="/Home" >
            <span className="icon icon-home"></span>
            首页
          </NavLink>
          <NavLink className="nav-group-item" to="/List" >
            <span className="icon icon-doc-text-inv"></span>
            订单列表
          </NavLink>
          <NavLink className="nav-group-item" to="/Post" >
            <span className="icon icon-plus-circled"></span>
            新增订单
          </NavLink>
          <NavLink className="nav-group-item" to="/Adm" >
            <span className="icon icon-info-circled"></span>
            功能面板
          </NavLink>
        </nav>      
      </Pane>
    );
  }
}


export default Sidebar;