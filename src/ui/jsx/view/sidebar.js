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
            connors
          </NavLink>
          <NavLink className="nav-group-item" to="/List" >
            <span className="icon icon-doc-text-inv"></span>
            List
          </NavLink>
          <NavLink className="nav-group-item" to="/About" >
            <span className="icon icon-info-circled"></span>
            About
          </NavLink>
          <NavLink className="nav-group-item" to="/Post" >
            <span className="icon icon-plus-circled"></span>
            Post
          </NavLink>
        </nav>      
      </Pane>
    );
  }
}


export default Sidebar;