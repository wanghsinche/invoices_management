import React from 'react';
import {SimpleItem, DropdownItem} from './navcomponents.jsx';
// import css from './nav.less';

class Nav extends React.Component{
	render(){
		return (
			<ul className="nav nav-pills nav-stacked">
				<SimpleItem to="/home" name="Home" />
				<SimpleItem to="/inputpanel" name="InputPanel" />
				<SimpleItem to="/manage" name="ManagePanel" />
				<DropdownItem name="dashboard">
					<SimpleItem to="/dashboard/manage" name="manage" />
					<SimpleItem to="/dashboard/inputpanel" name="inputpanel" />
				</DropdownItem>
				<SimpleItem to="/about" name="About" />
			</ul>
		);
	}
}

export default Nav;