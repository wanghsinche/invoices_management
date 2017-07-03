import React from "react";
import {  Pane, NavGroup, NavTitle, NavGroupItem } from "../photon/photon";
import { Route, Link } from 'react-router-dom';
 
class NavLink extends NavGroupItem {
  constructor(props){
    super(props);
  }

	render() {
    let result = super.render.call(this);
    let props = result.props, className = result.props.className;
		const icon = this.getIconComponent();

		return (
			<Link {...props} className={className}>
				{icon}{this.props.text}
			</Link>
		);
	}
}

class Sidebar extends React.Component {
  onSelect(key) {

  }

  render() {
    return (
      <Pane ptSize="sm" sidebar>
        <NavGroup activeKey={0} onSelect={this.onSelect}>
          <NavTitle>nav group icon &amp; text</NavTitle>
          <NavLink eventKey={0} glyph="home" text="Home" to="/"/>
          <NavLink eventKey={1} glyph="doc-text-inv" text="List" to="/List"/>
          <NavLink eventKey={2} glyph="info-circled" text="About" to="/About"/>
          <NavLink eventKey={2} glyph="plus-circled" text="Post" to="/Post"/>
        </NavGroup>
      </Pane>
    );
  }
}

export default Sidebar;